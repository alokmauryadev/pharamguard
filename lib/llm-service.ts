import OpenAI from 'openai';
import { RiskAssessment } from "./risk-engine";
import { DetectedVariant } from "./vcf-parser";
import { VARIANT_DEFINITIONS } from "./knowledge-base";

export interface LLMExplanation {
    summary: string;
    mechanism: string;
    citations: string[];
}

export async function generateClinicalExplanation(
    drug: string,
    gene: string,
    risk: RiskAssessment,
    variants: DetectedVariant[]
): Promise<LLMExplanation> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Debug logging for Vercel
    if (!apiKey) {
        console.error("OPENROUTER_API_KEY is missing. Env vars available:", Object.keys(process.env).filter(k => !k.includes("KEY") && !k.includes("SECRET")));
        return {
            summary: "Configuration Error: API Key missing in environment variables.",
            mechanism: "Please check Vercel Project Settings > Environment Variables. Ensure 'OPENROUTER_API_KEY' is added to the Production environment.",
            citations: []
        };
    }

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Determine if we are running in browser or server. Since this is likely a server action or API route, we should be fine, but if it runs on client, we need this or a proxy. Given it's imported in `app/api/analyze/route.ts` (Server), this is fine. Wait, `app/api` is server-side.
    });

    const variantDescriptions = variants.map(v => {
        const def = VARIANT_DEFINITIONS.find(d => d.rsid === v.rsid);
        const effect = def ? def.effect : "Unknown Effect";
        return `${v.rsid} (Genotype: ${v.genotype}, Effect: ${effect})`;
    }).join(", ");

    const prompt = `
    You are an expert clinical pharmacogenomicist. 
    Analyze the following patient result:
    
    Drug: ${drug}
    Gene: ${gene}
    Phenotype: ${risk.phenotype} (${risk.diplotype})
    Risk Level: ${risk.riskLabel}
    Detected Variants: ${variantDescriptions || "None"}
    
    Task:
    1. Provide a concise clinical summary (2-3 sentences) explaining WHY this risk exists for this patient.
    2. Explain the biological mechanism (e.g., "Reduced enzyme activity leads to high drug plasma levels...").
    3. Provide 1-2 key medical citations (e.g., "CPIC Guidelines for ${drug}", "FDA Label").
    
    Format the output as JSON:
    {
      "summary": "...",
      "mechanism": "...",
      "citations": ["..."]
    }
  `;

    try {
        const completion = await client.chat.completions.create({
            model: 'stepfun/step-3.5-flash:free',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            // @ts-ignore
            reasoning: { enabled: true }
        } as any);

        const text = completion.choices[0].message.content;

        if (!text) throw new Error("Empty response from LLM");

        // Clean up markdown code blocks if present (OpenRouter models sometimes wrap in ```json)
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("LLM Generation Error:", error);
        return {
            summary: "Clinical explanation unavailable (AI Service Error).",
            mechanism: "Integration with knowledge base suggests " + risk.recommendation,
            citations: ["CPIC Guidelines"]
        };
    }
}
