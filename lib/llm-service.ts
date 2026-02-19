import { GoogleGenAI } from "@google/genai";
import { RiskAssessment } from "./risk-engine";
import { DetectedVariant } from "./vcf-parser";

// Remove global instance to prevent build-time error if env var is missing
// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return {
            summary: "Configuration Error: API Key missing.",
            mechanism: "Please Checking server logs.",
            citations: []
        };
    }

    const genAI = new GoogleGenAI({ apiKey });

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
        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        // In @google/genai, text is a property, not a function
        const text = response.text;

        if (!text) throw new Error("Empty response from LLM");

        // Clean up markdown code blocks if present
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
