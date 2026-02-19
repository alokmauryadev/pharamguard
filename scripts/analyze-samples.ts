
import fs from 'fs';
import path from 'path';

// --- Interfaces ---

interface VcfVariant {
    chrom: string;
    pos: string;
    rsid: string;
    ref: string;
    alt: string;
    qual: string;
    filter: string;
    info: Record<string, string>;
    genotype: string; // e.g. "0/1", "1/1"
    zygosity: string;
    starAllele?: string;
    gene?: string;
    function?: string;
    cpic?: string;
    af?: string;
    clinSig?: string;
}

interface AnalysisResult {
    file: string;
    patientId: string; // Placeholder
    variants: VcfVariant[];
    phenotypes: Record<string, { phenotype: string, diplotype: string, alleles: string[] }>;
}

// --- Configuration ---
const SAMPLE_DIR = path.join(process.cwd(), 'sample_data');


// --- Helpers ---

function parseInfo(infoStr: string): Record<string, string> {
    const data: Record<string, string> = {};
    const parts = infoStr.split(';');
    for (const part of parts) {
        const [key, val] = part.split('=');
        if (key) data[key] = val || "true";
    }
    return data;
}

function getZygosity(gt: string): string {
    if (!gt || gt === "./.") return "Unknown";
    if (gt === "0/0" || gt === "0|0") return "Homozygous Reference";
    if (gt === "1/1" || gt === "1|1") return "Homozygous Variant";
    if (gt.includes("0") && gt.includes("1")) return "Heterozygous";
    return "Unknown"; // e.g. 1/2
}

// --- Main Logic ---

function analyzeVcf(filePath: string): AnalysisResult {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    const variants: VcfVariant[] = [];
    let isHeaderFound = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("#")) {
            if (trimmed.startsWith("#CHROM")) isHeaderFound = true;
            continue;
        }

        if (!isHeaderFound) continue; // Skip until header

        const cols = trimmed.split('\t');
        if (cols.length < 10) continue; // Expect at least one sample

        const [chrom, pos, rsid, ref, alt, qual, filter, infoStr, format, sample] = cols;

        // Parse INFO
        const info = parseInfo(infoStr);

        // Parse GT
        const formatParts = format.split(':');
        const gtIdx = formatParts.indexOf('GT');
        const sampleParts = sample.split(':');
        const gt = gtIdx !== -1 ? sampleParts[gtIdx] : "./.";

        // We only care if it's a known PGx variant (has STAR annotation) OR if it's in our list
        // The file seems pre-annotated with STAR, GENE, etc.

        // Zygosity
        const zygosity = getZygosity(gt);

        variants.push({
            chrom, pos, rsid, ref, alt, qual, filter, info,
            genotype: gt,
            zygosity,
            starAllele: info.STAR,
            gene: info.GENE,
            function: info.FUNC,
            cpic: info.CPIC,
            af: info.AF,
            clinSig: info.CLNSIG
        });
    }

    // --- Inferred Phenotypes (Simplified based on VCF annotations) ---
    // Group by Gene
    const geneVariants: Record<string, VcfVariant[]> = {};
    for (const v of variants) {
        const gene = v.gene || "Unknown";
        if (!geneVariants[gene]) geneVariants[gene] = [];
        geneVariants[gene].push(v);
    }

    const phenotypes: AnalysisResult['phenotypes'] = {};

    for (const gene of Object.keys(geneVariants)) {
        if (gene === "Unknown") continue;
        const vs = geneVariants[gene];

        let alleles: string[] = [];

        for (const v of vs) {
            if (v.starAllele && v.zygosity !== "Homozygous Reference") {
                if (v.zygosity === "Homozygous Variant") {
                    alleles.push(v.starAllele);
                    alleles.push(v.starAllele);
                } else { // Het
                    alleles.push(v.starAllele);
                }
            }
        }

        if (alleles.length === 0) alleles = ["*1", "*1"];
        else if (alleles.length === 1) alleles.push("*1");

        const diplotype = `${alleles[0]}/${alleles[1]}`;

        phenotypes[gene] = {
            phenotype: "Unknown (Needs KnowledgeBase)",
            diplotype,
            alleles
        };
    }

    return {
        file: filename,
        patientId: "PATIENT_001",
        variants,
        phenotypes
    };
}

// --- Run ---

async function main() {
    console.log("Analyzing VCFs in " + SAMPLE_DIR);

    // Find all VCFs
    let files: string[] = [];
    try {
        files = fs.readdirSync(SAMPLE_DIR).filter(f => f.endsWith('.vcf'));
    } catch (e) {
        console.error("Could not read directory:", e);
        return;
    }

    const results = files.map(f => analyzeVcf(path.join(SAMPLE_DIR, f)));

    console.log(JSON.stringify(results, null, 2));
}

main();
