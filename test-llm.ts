
import { generateClinicalExplanation } from "./lib/llm-service";
import { RiskAssessment } from "./lib/risk-engine";
import { DetectedVariant } from "./lib/vcf-parser";
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

async function testLLM() {
    console.log("Testing OpenRouter LLM Service...");

    const mockRisk: RiskAssessment = {
        riskLabel: "High Risk",
        confidenceScore: 0.95,
        severity: "high",
        phenotype: "PM",
        diplotype: "*4/*4",
        recommendation: "Avoid drug."
    };

    const mockVariants: DetectedVariant[] = [
        { gene: "CYP2D6", rsid: "rs3892097", genotype: "1/1" } // Reduced mock
    ];

    try {
        const result = await generateClinicalExplanation("CODEINE", "CYP2D6", mockRisk, mockVariants);
        console.log("LLM Response:", JSON.stringify(result, null, 2));

        if (result.summary && result.mechanism) {
            console.log("✅ PASS: LLM returned valid JSON");
        } else {
            console.log("❌ FAIL: LLM response missing fields");
        }
    } catch (error) {
        console.error("❌ FAIL: Error calling LLM:", error);
    }
}

testLLM();
