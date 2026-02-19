
export interface AnalysisResult {
    patient_id: string;
    drug: string;
    timestamp: string;
    risk_assessment: {
        risk_label: string;
        confidence_score: number;
        severity: string;
    };
    pharmacogenomic_profile: {
        primary_gene: string;
        diplotype: string;
        phenotype: string;
        detected_variants: Array<{
            rsid: string;
            genotype: string;
            impact: string;
        }>;
    };
    clinical_recommendation: {
        summary: string;
    };
    llm_generated_explanation: {
        summary: string;
        mechanism: string;
        citations: string[];
    };
    quality_metrics: {
        vcf_parsing_success: boolean;
        variant_count: number;
        error_msg?: string;
    };
}
