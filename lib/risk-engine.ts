import { DRUG_RISKS, DEFAULT_PHENOTYPE, Phenotype, GeneSymbol, KNOWN_VARIANTS } from "./knowledge-base";
import { DetectedVariant } from "./vcf-parser";

export interface RiskAssessment {
    riskLabel: string;
    confidenceScore: number;
    severity: "none" | "low" | "moderate" | "high" | "critical";
    phenotype: Phenotype;
    diplotype: string;
    recommendation: string;
}

// Helper to determine phenotype from variants
// Simplified logic: 
// No variants -> NM
// 1 variant -> IM (Intermediate)
// 2 variants (homozygous or compound het) -> PM (Poor) 
// This is a heuristic for the hackathon.
function determinePhenotype(gene: GeneSymbol, variants: DetectedVariant[]): { phenotype: Phenotype; diplotype: string } {
    const geneVariants = variants.filter(v => v.gene === gene);

    if (geneVariants.length === 0) {
        return { phenotype: "NM", diplotype: "*1/*1 (Assumed Normal)" };
    }

    // If we have variants, check their zygosity (simplified)
    // "1/1" -> Homozygous variant -> Likely PM (Poor Metabolizer)
    // "0/1" -> Heterozygous -> Likely IM (Intermediate)

    // If multiple variants exist, it's complex, but let's assume worst case for safety (PM)
    // or if one "1/1" exists -> PM.

    const hasHomozygous = geneVariants.some(v => v.genotype === "1/1" || v.genotype === "1|1");
    const variantImpacts = geneVariants.map(v => v.impact).join(", ");

    if (hasHomozygous || geneVariants.length >= 2) {
        return { phenotype: "PM", diplotype: `Mutant/Mutant (${variantImpacts})` };
    } else {
        return { phenotype: "IM", diplotype: `Wildtype/Mutant (${variantImpacts})` };
    }
}

export function assessRisk(drugName: string, variants: DetectedVariant[]): Record<GeneSymbol, RiskAssessment> | null {
    const upperDrug = drugName.toUpperCase();
    const drugRules = DRUG_RISKS[upperDrug];

    if (!drugRules) return null; // Drug not supported

    const results: any = {};

    for (const gene of Object.keys(drugRules) as GeneSymbol[]) {
        // 1. Determine Phenotype
        const { phenotype, diplotype } = determinePhenotype(gene, variants);

        // 2. Look up risk
        const rule = drugRules[gene][phenotype] || drugRules[gene]["Unknown"];

        results[gene] = {
            riskLabel: rule.risk,
            confidenceScore: 0.95, // Static rules are high confidence
            severity: rule.severity,
            phenotype: phenotype,
            diplotype: diplotype,
            recommendation: rule.recommendation
        };
    }

    return results;
}
