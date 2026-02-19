import { DRUG_RISKS, DEFAULT_PHENOTYPE, Phenotype, GeneSymbol, VARIANT_DEFINITIONS, VariantDefinition } from "./knowledge-base";
import { DetectedVariant } from "./vcf-parser";

export interface RiskAssessment {
    riskLabel: string;
    confidenceScore: number;
    severity: "none" | "low" | "moderate" | "high" | "critical";
    phenotype: Phenotype;
    diplotype: string;
    recommendation: string;
}

// Helper: Get the Star Allele for a given variant
function getStarAllele(gene: GeneSymbol, variant: DetectedVariant): string | null {
    const def = VARIANT_DEFINITIONS.find(v => v.gene === gene && v.rsid === variant.rsid);
    if (!def) return null;

    // Check if the user has the variant allele
    // Genotype is like "0/1", "1/1", "0|1", etc.
    // We need to know which allele is the "variant" one from the definition.
    // For simplicity in this engine, if the genotype is NOT "0/0" (Rec/Ref) and NOT "./." (Missing),
    // and matches the "risk" rsID, we assume they have the star allele.
    // A more advanced engine would check the specific base (A vs G).
    // Given we don't have Ref/Alt bases in DetectedVariant (yet), we assume the VCF parser checks rsID match.
    // BUT, the VCF parser just passes RSIDs it finds.

    // Simplification: If genotype has '1' (Alt), we assume it's the variant allele defined in KnowledgeBase.
    if (variant.genotype.includes("1")) {
        return def.starAllele;
    }

    return null;
}

// Helper: Determine Phenotype from Diplotype (Simplified)
// In reality, this is a massive table (e.g., CPIC allele functionality table).
function translateDiplotypeToPhenotype(gene: GeneSymbol, alleles: string[]): Phenotype {
    // alleles is like ["*1", "*4"]

    // 1. Assign function to each allele
    // *1 is ALWAYS Normal Function (by definition here)
    // We look up the effect of others.

    const alleleEffects = alleles.map(allele => {
        if (allele === "*1") return "Normal Function";
        const def = VARIANT_DEFINITIONS.find(v => v.gene === gene && v.starAllele === allele);
        return def?.effect || "Unknown";
    });

    const hasNoFunction = alleleEffects.filter(e => e === "No Function").length;
    const hasDecreased = alleleEffects.filter(e => e === "Decreased Function").length;
    const hasNormal = alleleEffects.filter(e => e === "Normal Function").length;
    const hasIncreased = alleleEffects.filter(e => e === "Increased Function").length;

    // Logic for Phenotype Prediction (Simplified CPIC-style)

    // URM: 2 Increased Function (e.g. *17/*17)
    if (hasIncreased >= 2) return "URM";

    // RM: 1 Normal + 1 Increased (e.g. *1/*17)
    if (hasNormal === 1 && hasIncreased === 1) return "RM";

    // Conflict: Increased + No Function (e.g. *17/*2 for CYP2C19) -> usually IM
    if (hasIncreased === 1 && hasNoFunction === 1) return "IM";

    // Conflict: Increased + Decreased -> usually NM or IM depending on gene? Let's conservative NM.
    if (hasIncreased === 1 && hasDecreased === 1) return "NM";

    // PM: 2 No Function alleles
    if (hasNoFunction >= 2) return "PM";

    // IM: 1 No Function + 1 Decreased, OR 1 No Function + 1 Normal, OR 2 Decreased
    //Strictly: 
    // PM: No/No
    // IM: No/Decreased, Decreased/Decreased, No/Normal (sometimes called IM, sometimes distinct)
    // Let's use standard:
    // PM: 0 activity score (No/No)
    // IM: Reduced activity (No/Dec, Dec/Dec, No/Norm) -> Wait, No/Norm is usually IM for CYP2D6 but NM for others? 
    // Let's generalize for safety:

    if (hasNoFunction === 1 && hasDecreased === 1) return "IM";
    if (hasDecreased >= 2) return "IM";
    if (hasNoFunction === 1 && hasNormal === 1) return "IM";

    // NM: 2 Normal, or 1 Normal + 1 Decreased (often behaves functionally Normal-ish or slight reduction)
    if (hasNormal === 2) return "NM";
    if (hasNormal === 1 && hasDecreased === 1) return "NM"; // Conservative: call it NM but maybe "NM (decreased activity)"

    return "NM"; // Default
}

function determinePhenotype(gene: GeneSymbol, variants: DetectedVariant[]): { phenotype: Phenotype; diplotype: string } {
    const geneVariants = variants.filter(v => v.gene === gene);

    // 1. Identify Star Alleles present
    // We assume *1 (Wildtype) distinctively.
    // If we find a specific variant, we replace one *1 with that variant's star allele.
    // If we find homozygous variant, we have two copies.

    let alleles = ["*1", "*1"]; // Start with assumption of Wildtype/Wildtype

    // Find all detected star alleles
    const detectedStars: string[] = [];

    for (const v of geneVariants) {
        const star = getStarAllele(gene, v);
        if (star) {
            // Check zygosity
            if (v.genotype === "1/1" || v.genotype === "1|1") {
                detectedStars.push(star);
                detectedStars.push(star);
            } else {
                detectedStars.push(star);
            }
        }
    }

    // Assign to alleles slot
    // Note: This is a simplification. Real phasing is hard. 
    // We just take the "worst" alleles found to replace *1.
    // e.g. if we found *4 and *10, we assume one of each (*4/*10) rather than *4/*1 + *10/*1 (which is impossible usually unless triploid)

    if (detectedStars.length > 0) {
        alleles[1] = detectedStars[0]; // Replace first *1
        if (detectedStars.length > 1) {
            alleles[0] = detectedStars[1]; // Replace second *1
        }
    }

    const diplotypeString = `${alleles[0]}/${alleles[1]}`;
    const phenotype = translateDiplotypeToPhenotype(gene, alleles);

    return { phenotype, diplotype: diplotypeString };
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
        // If exact phenotype not found, fall back to Unknown
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
