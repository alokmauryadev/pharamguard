import { GoogleGenerativeAI } from "@google/generative-ai";
import { RiskAssessment } from "./risk-engine";
import { DetectedVariant } from "./vcf-parser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    You are an expert clinical pharmacogenomicist. 
    Analyze the following patient result:
    
    Drug: ${drug}
    Gene: ${gene}
    Phenotype: ${risk.phenotype} (${risk.diplotype})
    Risk Level: ${risk.riskLabel}
    Detected Variants: ${variants.map(v => `${v.rsid} (Genotype: ${v.genotype})`).join(", ") || "None"}
    
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
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("LLM Generation Error:", error);
        return {
            summary: "Detailed clinical explanation unavailable at this time.",
            mechanism: "Integration with knowledge base suggests " + risk.recommendation,
            citations: ["CPIC Guidelines"]
        };
    }
}
