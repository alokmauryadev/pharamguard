
import fs from 'fs';
import path from 'path';
import { parseVCF } from '../lib/vcf-parser';
import { assessRisk } from '../lib/risk-engine';
import { GeneSymbol } from '../lib/knowledge-base';

const VCF_PATH = path.join(process.cwd(), 'sample_data', 'TC_P1_PATIENT_001_Normal.vcf');

async function verify() {
    console.log("Verifying fix with " + VCF_PATH);
    const content = fs.readFileSync(VCF_PATH, 'utf-8');

    // 1. Parse
    const parsed = parseVCF(content);
    console.log("Parsed Variants Count:", parsed.variants.length);
    console.log("Parsed Variants:", JSON.stringify(parsed.variants.map(v => `${v.gene} ${v.rsid} ${v.genotype}`), null, 2));

    // 2. Assess Risk
    const genes: GeneSymbol[] = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "DPYD", "TPMT"];

    for (const gene of genes) {
        let drug = "";
        if (gene === "CYP2D6") drug = "CODEINE";
        if (gene === "CYP2C19") drug = "CLOPIDOGREL";
        if (gene === "CYP2C9") drug = "WARFARIN";
        if (gene === "SLCO1B1") drug = "SIMVASTATIN";
        if (gene === "DPYD") drug = "FLUOROURACIL";
        if (gene === "TPMT") drug = "AZATHIOPRINE";

        if (drug) {
            const risk = assessRisk(drug, parsed.variants);
            if (risk) {
                const r = risk[gene];
                if (r) {
                    console.log(`\n--- ${gene} (${drug}) ---`);
                    console.log(`Phenotype: ${r.phenotype}`);
                    console.log(`Diplotype: ${r.diplotype}`);
                    console.log(`Risk: ${r.riskLabel}`);
                } else {
                    if (gene !== "TPMT") console.log(`\n--- ${gene} --- No risk data returned`);
                }
            }
        }
    }
}

verify();
