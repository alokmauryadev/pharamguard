
export const GENES = {
  CYP2D6: "CYP2D6",
  CYP2C19: "CYP2C19",
  CYP2C9: "CYP2C9",
  SLCO1B1: "SLCO1B1",
  TPMT: "TPMT",
  DPYD: "DPYD",
} as const;

export type GeneSymbol = keyof typeof GENES;

// Simplified for the hackathon: Primary variants to look for
export const KNOWN_VARIANTS: Record<string, { gene: GeneSymbol; rsid: string; impact: string }> = {
  "rs3892097": { gene: "CYP2D6", rsid: "rs3892097", impact: "*4 (No Function)" },
  "rs1065852": { gene: "CYP2D6", rsid: "rs1065852", impact: "*10 (Decreased Function)" },
  "rs4244285": { gene: "CYP2C19", rsid: "rs4244285", impact: "*2 (No Function)" },
  "rs4986893": { gene: "CYP2C19", rsid: "rs4986893", impact: "*3 (No Function)" },
  "rs1799853": { gene: "CYP2C9", rsid: "rs1799853", impact: "*2 (Decreased Function)" },
  "rs1057910": { gene: "CYP2C9", rsid: "rs1057910", impact: "*3 (Decreased Function)" },
  "rs4149056": { gene: "SLCO1B1", rsid: "rs4149056", impact: "*5 (Decreased Function)" },
  "rs1800462": { gene: "TPMT", rsid: "rs1800462", impact: "*2 (No Function)" },
  "rs1800460": { gene: "TPMT", rsid: "rs1800460", impact: "*3B (No Function)" },
  "rs3918290": { gene: "DPYD", rsid: "rs3918290", impact: "*2A (No Function)" },
};

export type Phenotype = "PM" | "IM" | "NM" | "RM" | "URM" | "Unknown";

// Simplified logic: If any no-function variant is present, we downgrade the phenotype
// In a real app, this would be a complex diplotype lookup table
export const DEFAULT_PHENOTYPE: Phenotype = "NM"; // Normal Metabolizer

// Drug-Gene Interactions (Simplified CPIC Guidelines)
export const DRUG_RISKS: Record<string, Record<GeneSymbol, Record<Phenotype, { risk: string; severity: string; recommendation: string }>>> = {
  "CODEINE": {
    "CYP2D6": {
      "NM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
      "PM": { risk: "Ineffective", severity: "high", recommendation: "Avoid codeine due to lack of efficacy. Proper pain relief will not be achieved." },
      "IM": { risk: "Monitor", severity: "low", recommendation: "Use standard label dosing; monitor for lack of effect." },
      "RM": { risk: "Toxic", severity: "critical", recommendation: "Avoid codeine. Risk of life-threatening respiratory depression." },
      "URM": { risk: "Toxic", severity: "critical", recommendation: "Avoid codeine. Risk of life-threatening respiratory depression." },
      "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing with caution." }
    }
  } as any,
  "CLOPIDOGREL": {
    "CYP2C19": {
        "NM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
        "PM": { risk: "Ineffective", severity: "high", recommendation: "Avoid clopidogrel. Risk of therapeutic failure and cardiovascular events." },
        "IM": { risk: "Ineffective", severity: "moderate", recommendation: "Avoid clopidogrel. Consider alternative antiplatelet therapy." },
        "RM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
        "URM": { risk: "Safe", severity: "none", recommendation: "Use standard label dosing." },
        "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing with caution." }
    }
  } as any,
  "WARFARIN": {
      "CYP2C9": {
          "NM": { risk: "Safe", severity: "none", recommendation: "Use standard initial dosing." },
          "PM": { risk: "Toxic", severity: "high", recommendation: "Consider lower starting dose. Increased risk of bleeding." },
          "IM": { risk: "Adjust Dosage", severity: "moderate", recommendation: "Consider lower starting dose." },
          "RM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
          "URM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
          "Unknown": { risk: "Unknown", severity: "low", recommendation: "Monitor INR closely." }
      }
  } as any,
  "SIMVASTATIN": {
      "SLCO1B1": {
          "NM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
          "PM": { risk: "Toxic", severity: "high", recommendation: "Prescribe lower dose or alternative statin. Risk of myopathy." },
          "IM": { risk: "Adjust Dosage", severity: "moderate", recommendation: "Prescribe lower dose or alternative statin." },
          "RM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
          "URM": { risk: "Safe", severity: "none", recommendation: "Use standard dosing." },
          "Unknown": { risk: "Unknown", severity: "low", recommendation: "Use standard dosing." }
      }
  } as any,
  // Add other drugs/genes as needed or default to empty/undefined handling
};

export const SUPPORTED_DRUGS = ["CODEINE", "CLOPIDOGREL", "WARFARIN", "SIMVASTATIN", "AZATHIOPRINE", "FLUOROURACIL"];
