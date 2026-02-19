
import { NextRequest, NextResponse } from "next/server";
import { parseVCF, ParseResult } from "@/lib/vcf-parser";
import { assessRisk, RiskAssessment } from "@/lib/risk-engine";
import { generateClinicalExplanation, LLMExplanation } from "@/lib/llm-service";
import { GeneSymbol } from "@/lib/knowledge-base";
import { AnalysisResult } from "@/types";

export const maxDuration = 60; // Allow longer timeout for LLM

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const drugsInput = formData.get("drugs") as string;

        if (!file || !drugsInput) {
            return NextResponse.json({ error: "Missing file or drugs" }, { status: 400 });
        }

        // 1. Parse VCF
        const buffer = await file.arrayBuffer();
        const text = new TextDecoder().decode(buffer);
        const parseResult: ParseResult = parseVCF(text);

        // Dummy patient ID (In real app, extract from VCF header if exists)
        const patientId = "PATIENT_" + Math.random().toString(36).substr(2, 5).toUpperCase();
        const drugs = drugsInput.split(",").map(d => d.trim()).filter(Boolean);

        const results: AnalysisResult[] = [];

        // 2. Process each drug
        for (const drug of drugs) {
            const riskProfile = assessRisk(drug, parseResult.variants);

            if (!riskProfile) {
                // Handle unsupported drug gracefully or skip
                continue;
            }

            // 3. Generate Reports (For each relevant gene for the drug - usually just one major one per CPIC)
            // The requirement schema implies one "primary_gene".
            // We will pick the first gene returned by assessRisk (usually only 1 for these simple cases)
            const geneKey = Object.keys(riskProfile)[0] as GeneSymbol;
            const riskData = riskProfile[geneKey];

            // 4. LLM Explanation
            const llmExplanation = await generateClinicalExplanation(
                drug,
                geneKey,
                riskData,
                parseResult.variants.filter(v => v.gene === geneKey)
            );

            const result: AnalysisResult = {
                patient_id: patientId,
                drug: drug,
                timestamp: new Date().toISOString(),
                risk_assessment: {
                    risk_label: riskData.riskLabel,
                    confidence_score: riskData.confidenceScore,
                    severity: riskData.severity,
                },
                pharmacogenomic_profile: {
                    primary_gene: geneKey,
                    diplotype: riskData.diplotype,
                    phenotype: riskData.phenotype,
                    detected_variants: parseResult.variants
                        .filter(v => v.gene === geneKey)
                        .map(v => ({
                            rsid: v.rsid,
                            genotype: v.genotype,
                            impact: v.impact
                        }))
                },
                clinical_recommendation: {
                    summary: riskData.recommendation
                },
                llm_generated_explanation: llmExplanation,
                quality_metrics: {
                    vcf_parsing_success: parseResult.isSuccess,
                    variant_count: parseResult.variants.length,
                    error_msg: parseResult.error
                }
            };

            results.push(result);
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
