
import fs from 'fs';
import path from 'path';
import { parseVCF } from '../lib/vcf-parser';
import { assessRisk } from '../lib/risk-engine';

const VCF_PATH = path.join(process.cwd(), 'sample_data', 'TC_P1_PATIENT_001_Normal.vcf');

async function verify() {
    console.log("Verifying fix with " + VCF_PATH);
    const content = fs.readFileSync(VCF_PATH, 'utf-8');

    // 1. Parse
    const parsed = parseVCF(content);
    console.log("Parsed Variants Count:", parsed.variants.length);
    console.log("Parsed Variants:", JSON.stringify(parsed.variants.map(v => `${v.gene} ${v.rsid} ${v.genotype}`), null, 2));

    // 2. Assess Risk
    // We test with a dummy drug to trigger gene analysis, or loop through all
    const genes = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "DPYD", "TPMT"];

    for (const gene of genes) {
        // Need a drug that targets this gene to trigger assessment in assessRisk?
        // assessRisk takes a drugName.
        // Let's find a drug for each gene.
        let drug = "";
        if (gene === "CYP2D6") drug = "CODEINE";
        if (gene === "CYP2C19") drug = "CLOPIDOGREL";
        if (gene === "CYP2C9") drug = "WARFARIN";
        if (gene === "SLCO1B1") drug = "SIMVASTATIN";
        if (gene === "DPYD") drug = "FLUOROURACIL";
        if (gene === "TPMT") drug = "AZATHIOPRINE"; // Not in KB? check
        // TPMT is in KB, but drug... "AZATHIOPRINE" or "MERCAPTOPURINE"? 
        // KB has: CODEINE, CLOPIDOGREL, WARFARIN, SIMVASTATIN, FLUOROURACIL, TRAMADOL...
        // Does it have a TPMT drug?
        // Let's check knowledge-base keys.
        // KB has: CODEINE, CLOPIDOGREL, WARFARIN, SIMVASTATIN, FLUOROURACIL... 
        // No explicit TPMT drug in the `DRUG_RISKS` keys shown in previous view_file (lines 52-143).
        // Wait, lines 52-143 showed Codeine, Clopidogrel, Warfarin, Simvastatin, Fluorouracil, Tramadol, Citalopram, Escitalopram, Omeprazole.
        // Which one uses TPMT? None of those explicitly shown used TPMT?
        // Step 16 output shows TPMT variants but maybe no drug uses it in the map?
        // Or I missed it.
        // Let's focus on CYP2D6 (Codeine) as that was the user's screenshot.

        if (drug) {
            const risk = assessRisk(drug, parsed.variants);
            if (risk && risk[gene as any]) {
                const r = risk[gene as any];
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

verify();
