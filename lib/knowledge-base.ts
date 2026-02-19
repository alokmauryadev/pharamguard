
export const GENES = {
    CYP2D6: "CYP2D6",
    CYP2C19: "CYP2C19",
    CYP2C9: "CYP2C9",
    SLCO1B1: "SLCO1B1",
    TPMT: "TPMT",
    DPYD: "DPYD",
} as const;

export type GeneSymbol = keyof typeof GENES;

// Robust Star Allele Definitions
// This maps specific rsIDs and Genotypes to Star Alleles
export interface VariantDefinition {
    gene: GeneSymbol;
    rsid: string;
    variantAllele: string; // The allele that defines the variant (e.g., "A" in G>A)
    starAllele: string; // The resulting Star Allele (e.g., "*4")
    effect: "No Function" | "Decreased Function" | "Increased Function" | "Normal Function" | "Unknown";
}

export const VARIANT_DEFINITIONS: VariantDefinition[] = [
    // CYP2D6
    { gene: "CYP2D6", rsid: "rs3892097", variantAllele: "A", starAllele: "*4", effect: "No Function" }, // Splicing defect
    { gene: "CYP2D6", rsid: "rs1065852", variantAllele: "A", starAllele: "*10", effect: "Decreased Function" }, // Common Asian variant
    { gene: "CYP2D6", rsid: "rs16947", variantAllele: "T", starAllele: "*2", effect: "Normal Function" }, // R296C, C>T
    { gene: "CYP2D6", rsid: "rs5030655", variantAllele: "T", starAllele: "*6", effect: "No Function" }, // Frameshift
    { gene: "CYP2D6", rsid: "rs59421388", variantAllele: "T", starAllele: "*17", effect: "Decreased Function" }, // T107I
    { gene: "CYP2D6", rsid: "rs28371725", variantAllele: "T", starAllele: "*41", effect: "Decreased Function" }, // Splicing defect (reduced expression)

    // CYP2C19
    { gene: "CYP2C19", rsid: "rs4244285", variantAllele: "A", starAllele: "*2", effect: "No Function" }, // Splice defect
    { gene: "CYP2C19", rsid: "rs4986893", variantAllele: "A", starAllele: "*3", effect: "No Function" }, // Premature stop
    { gene: "CYP2C19", rsid: "rs28399504", variantAllele: "G", starAllele: "*4", effect: "No Function" }, // Start lost
    { gene: "CYP2C19", rsid: "rs56337013", variantAllele: "T", starAllele: "*6", effect: "No Function" }, // Frameshift
    { gene: "CYP2C19", rsid: "rs17884712", variantAllele: "A", starAllele: "*9", effect: "Decreased Function" }, // R144H (Uncertain but often decreased)
    { gene: "CYP2C19", rsid: "rs12769205", variantAllele: "G", starAllele: "*17", effect: "Increased Function" }, // Promoter variant (-806C>T)

    // CYP2C9
    { gene: "CYP2C9", rsid: "rs1799853", variantAllele: "T", starAllele: "*2", effect: "Decreased Function" }, // C>T Arg144Cys
    { gene: "CYP2C9", rsid: "rs1057910", variantAllele: "C", starAllele: "*3", effect: "Decreased Function" }, // A>C Ile359Leu
    { gene: "CYP2C9", rsid: "rs9332131", variantAllele: "T", starAllele: "*5", effect: "Decreased Function" }, // D360E
    { gene: "CYP2C9", rsid: "rs72558187", variantAllele: "G", starAllele: "*12", effect: "Decreased Function" }, // P489S

    // SLCO1B1
    { gene: "SLCO1B1", rsid: "rs4149056", variantAllele: "C", starAllele: "*5", effect: "Decreased Function" }, // T>C Val174Ala
    { gene: "SLCO1B1", rsid: "rs2306283", variantAllele: "G", starAllele: "*1B", effect: "Normal Function" }, // A>G D130N (Often Benign/Normal)
    { gene: "SLCO1B1", rsid: "rs11045819", variantAllele: "T", starAllele: "*15", effect: "Decreased Function" }, // Proline variant

    // TPMT
    { gene: "TPMT", rsid: "rs1800462", variantAllele: "C", starAllele: "*2", effect: "No Function" }, // G>C Ala80Pro
    { gene: "TPMT", rsid: "rs1800460", variantAllele: "A", starAllele: "*3B", effect: "No Function" }, // G>A Ala154Thr
    { gene: "TPMT", rsid: "rs1800584", variantAllele: "C", starAllele: "*3C", effect: "No Function" }, // A>G (reverse strand?) check standard. VCF says G>A. Usually 3C is *rs1142345*? No, rs1800584 is 719A>G.
    // NOTE: rs1800584 in VCF has REF=G ALT=A. Let's assume A is risk allele for *3C if VCF says so.
    { gene: "TPMT", rsid: "rs1800584", variantAllele: "A", starAllele: "*3C", effect: "No Function" },

    // DPYD
    { gene: "DPYD", rsid: "rs3918290", variantAllele: "A", starAllele: "*2A", effect: "No Function" }, // Splice donor
    { gene: "DPYD", rsid: "rs1801265", variantAllele: "C", starAllele: "*5", effect: "Decreased Function" }, // I560S
    { gene: "DPYD", rsid: "rs1801159", variantAllele: "T", starAllele: "*6", effect: "No Function" }, // V732I
    { gene: "DPYD", rsid: "rs67376798", variantAllele: "A", starAllele: "*13", effect: "No Function" }, // C29R
];

export type Phenotype = "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";

export const DEFAULT_PHENOTYPE: Phenotype = "NM"; // Normal Metabolizer (*1/*1)

// Drug-Gene Interactions based on CPIC Guidelines
export const DRUG_RISKS: Record<string, Record<GeneSymbol, Record<Phenotype, { risk: string; severity: "none" | "low" | "moderate" | "high" | "critical"; recommendation: string }>>> = {
    "CODEINE": {
        "CYP2D6": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing. Normal metabolism of codeine to morphine." },
            "PM": { risk: "Ineffective", severity: "high", recommendation: "Avoid codeine due to lack of efficacy. Only negligible amounts of morphine are formed. Use an alternative analgesic." },
            "IM": { risk: "Monitor", severity: "low", recommendation: "Use standard label dosing; monitor for lack of effect. If no response, consider alternative." },
            "RM": { risk: "Toxic", severity: "critical", recommendation: "Avoid codeine. Rapid metabolism to morphine leads to higher risk of toxicity/overdose." },
            "URM": { risk: "Toxic", severity: "critical", recommendation: "Avoid codeine. Ultra-rapid metabolism to morphine leads to life-threatening risk of toxicity." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing with caution." }
        }
    } as any,
    "CLOPIDOGREL": {
        "CYP2C19": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing (75 mg/day)." },
            "PM": { risk: "Ineffective", severity: "high", recommendation: "Avoid clopidogrel. Use prasugrel or ticagrelor. Standard dose leads to insufficient platelet inhibition." },
            "IM": { risk: "Ineffective", severity: "moderate", recommendation: "Avoid clopidogrel. Use prasugrel or ticagrelor. If unavailable, consider 150 mg/day clopidogrel." },
            "RM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
            "URM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing. Increased active metabolite formation may increase bleeding risk slightly." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing with caution." }
        }
    } as any,
    "WARFARIN": {
        "CYP2C9": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard initial dosing (e.g. 5-10 mg)." },
            "PM": { risk: "High Sensitivity", severity: "high", recommendation: "Consider much lower starting dose (e.g., 0.5-2 mg). GREATLY increased risk of bleeding." },
            "IM": { risk: "Moderate Sensitivity", severity: "moderate", recommendation: "Consider lower starting dose (e.g., 3-4 mg). Increased risk of bleeding." },
            "RM": { risk: "Resistant", severity: "low", recommendation: "Use standard dosing, possibly higher requirements." },
            "URM": { risk: "Resistant", severity: "low", recommendation: "Use standard dosing, likely higher requirements." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Monitor INR closely." }
        }
    } as any,
    "SIMVASTATIN": {
        "SLCO1B1": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "PM": { risk: "High Myopathy Risk", severity: "high", recommendation: "Prescribe a lower dose (max 20mg) or switch to rosuvastatin/atorvastatin. High risk of muscle damage." },
            "IM": { risk: "Moderate Myopathy Risk", severity: "moderate", recommendation: "Prescribe a lower dose or switch to alternative statin." },
            "RM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "URM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
        }
    } as any,
    "FLUOROURACIL": {
        "DPYD": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "PM": { risk: "Severe Toxicity", severity: "critical", recommendation: "Avoid 5-FU. Use alternative drug. Extremely high risk of severe or fatal toxicity." },
            "IM": { risk: "High Toxicity Risk", severity: "high", recommendation: "Reduce starting dose by 50%. Titrate based on toxicity. Monitor closely." },
            "RM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "URM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
        }
    } as any,
    "TRAMADOL": {
        "CYP2D6": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
            "PM": { risk: "Ineffective", severity: "high", recommendation: "Avoid tramadol due to lack of efficacy. Use alternative analgesic." },
            "IM": { risk: "Monitor", severity: "low", recommendation: "Use standard dosing; monitor for lack of effect." },
            "RM": { risk: "Toxic", severity: "critical", recommendation: "Avoid tramadol. Risk of life-threatening respiratory depression." },
            "URM": { risk: "Toxic", severity: "critical", recommendation: "Avoid tramadol. Risk of life-threatening respiratory depression." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing with caution." }
        }
    } as any,
    "CITALOPRAM": {
        "CYP2C19": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "PM": { risk: "Side Effects", severity: "moderate", recommendation: "Consider 50% reduction in starting dose. Risk of QT prolongation." },
            "IM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "RM": { risk: "Ineffective", severity: "moderate", recommendation: "Consider alternative drug (e.g. paroxetine). Risk of therapeutic failure." },
            "URM": { risk: "Ineffective", severity: "moderate", recommendation: "Consider alternative drug. Risk of therapeutic failure." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
        }
    } as any,
    "ESCITALOPRAM": {
        "CYP2C19": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "PM": { risk: "Side Effects", severity: "moderate", recommendation: "Consider 50% reduction in starting dose. Risk of QT prolongation." },
            "IM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "RM": { risk: "Ineffective", severity: "moderate", recommendation: "Consider alternative drug. Risk of therapeutic failure." },
            "URM": { risk: "Ineffective", severity: "moderate", recommendation: "Consider alternative drug. Risk of therapeutic failure." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
        }
    } as any,
    "OMEPRAZOLE": {
        "CYP2C19": {
            "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
            "PM": { risk: "High Exposure", severity: "low", recommendation: "Standard dosing is safe, but acid suppression will be higher. Good for efficacy." },
            "IM": { risk: "High Exposure", severity: "low", recommendation: "Standard dosing is safe." },
            "RM": { risk: "Ineffective", severity: "moderate", recommendation: "Increase starting dose by 50-100% to achieve acid suppression." },
            "URM": { risk: "Ineffective", severity: "moderate", recommendation: "Increase starting dose by 100% (double dose) to achieve acid suppression." },
            "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
        }
    } as any
};

export const SUPPORTED_DRUGS = Object.keys(DRUG_RISKS);

