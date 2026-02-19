
import { parseVCF } from "./lib/vcf-parser";
import { assessRisk } from "./lib/risk-engine";
import { VARIANT_DEFINITIONS } from "./lib/knowledge-base";

// 1. Mock VCF Content
const mockVCF_PM = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
10	96341059	rs3892097	G	A	.	.	.	GT	1/1
`;

const mockVCF_NM = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
10	96341059	rs3892097	G	A	.	.	.	GT	0/0
`;

const mockVCF_Carrier = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
10	96341059	rs3892097	G	A	.	.	.	GT	0/1
`;

async function test() {
    console.log("--- Testing Robust Risk Engine ---");

    // Test 1: Poor Metabolizer (*4/*4 for CYP2D6)
    console.log("\nTest 1: CYP2D6 Poor Metabolizer (rs3892097 1/1)");
    const parsedPM = parseVCF(mockVCF_PM);
    const riskPM = assessRisk("CODEINE", parsedPM.variants);

    if (riskPM?.CYP2D6.phenotype === "PM" && riskPM.CYP2D6.diplotype.includes("*4/*4")) {
        console.log("✅ PASS: Correctly identified PM (*4/*4)");
    } else {
        console.error("❌ FAIL: Expected PM, got", riskPM?.CYP2D6);
    }

    // Test 2: Normal Metabolizer (rs3892097 0/0)
    console.log("\nTest 2: CYP2D6 Normal Metabolizer (Wildtype)");
    const parsedNM = parseVCF(mockVCF_NM);
    const riskNM = assessRisk("CODEINE", parsedNM.variants);

    if (riskNM?.CYP2D6.phenotype === "NM" && riskNM.CYP2D6.diplotype.includes("*1/*1")) {
        console.log("✅ PASS: Correctly identified NM (*1/*1)");
    } else {
        console.error("❌ FAIL: Expected NM, got", riskNM?.CYP2D6);
    }

    // Test 3: Standard VCF Header Parsing
    console.log("\nTest 3: VCF Header Parsing");
    if (parsedPM.isSuccess && parsedPM.metadata?.vcfVersion === "VCFv4.2") {
        console.log("✅ PASS: Correctly parsed VCF version");
    } else {
        console.log("❌ FAIL: VCF Header parsing issues", parsedPM);
    }
}

test();
