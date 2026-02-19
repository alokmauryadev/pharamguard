import { VARIANT_DEFINITIONS, GeneSymbol } from "./knowledge-base";

export interface DetectedVariant {
    gene: GeneSymbol;
    rsid: string;
    genotype: string; // e.g., "0/1", "1/1"
    rawVcfLine?: string;
    quality?: number; // QUAL column
    filter?: string; // FILTER column
}

export interface ParseResult {
    variants: DetectedVariant[];
    isSuccess: boolean;
    error?: string;
    metadata?: {
        sampleId?: string;
        vcfVersion?: string;
        date?: string;
    };
}

export function parseVCF(vcfContent: string): ParseResult {
    const variants: DetectedVariant[] = [];
    const lines = vcfContent.split(/\r?\n/); // Handle both likely line endings

    let isHeaderFound = false;
    let formatIdx = -1;
    let sampleIdx = -1;
    let vcfVersion = "";

    // Map to quickly look up if an RSID is interesting
    const interestingVariants = new Set(VARIANT_DEFINITIONS.map(v => v.rsid));
    const rsidToGeneMap = new Map<string, GeneSymbol>();
    VARIANT_DEFINITIONS.forEach(v => rsidToGeneMap.set(v.rsid, v.gene));

    try {
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // 1. Parse Meta-information lines
            if (trimmed.startsWith("##")) {
                if (trimmed.startsWith("##fileformat=")) {
                    vcfVersion = trimmed.split("=")[1];
                }
                continue;
            }

            // 2. Parse Header line
            if (trimmed.startsWith("#CHROM")) {
                const headers = trimmed.split("\t");
                // Find indices for FORMAT and the first SAMPLE (usually column 9 and 10, index 8 and 9)
                formatIdx = headers.indexOf("FORMAT");
                // The first sample is usually the column after FORMAT, often just named "SAMPLE" or the patient ID
                // Standard VCF has fixed columns 0-7 (#CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO)
                // Column 8 is FORMAT (optional but common in clinical VCFs)
                // Column 9+ are samples
                if (headers.length > 9) {
                    sampleIdx = 9; // Take the first sample
                }
                isHeaderFound = true;
                continue;
            }

            // 3. Parse Data lines
            if (!isHeaderFound) {
                // If we haven't found a header yet, proper VCF parsing is risky. 
                // But we can try a fallback for simple files: assumed standard columns
                // #CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
                // 0      1   2  3   4   5    6      7    8      9
                // However, standard says we must see #CHROM line. Let's be strict or add loose fallback?
                // Strict is safer for "Robust" parser.
                continue;
            }

            const cols = trimmed.split("\t");
            if (cols.length < 5) continue;

            const rsid = cols[2];

            if (interestingVariants.has(rsid)) {
                const gene = rsidToGeneMap.get(rsid)!;
                let genotype = "./."; // Default to missing
                let quality = parseFloat(cols[5]) || 0;
                let filter = cols[6];

                // Extract Genotype (GT)
                if (formatIdx !== -1 && sampleIdx !== -1 && cols.length > sampleIdx) {
                    const formatFields = cols[formatIdx].split(":");
                    const gtIndex = formatFields.indexOf("GT");

                    if (gtIndex !== -1) {
                        const sampleFields = cols[sampleIdx].split(":");
                        if (sampleFields.length > gtIndex) {
                            genotype = sampleFields[gtIndex];
                        }
                    }
                } else {
                    // Fallback for simple VCF-like files (e.g. 23andMe raw data often looks different but standard VCF usually has GT)
                    // If no FORMAT column, maybe it's just a position list? 
                    // For this implementation, we assume Standard VCF 4.x with Genotypes.
                }

                // Clean genotype (handle partial calls like 0|1 => 0/1 for consistency if needed, 
                // though usually we just want to know if it's 0 or 1)
                // Normalizing 0|1 to 0/1 is useful for the risk engine
                genotype = genotype.replace("|", "/");

                // Only add if we have a valid-looking genotype (not partial missing like "./1" unless that's intended)
                // We keep 0/0 (Ref) because it's evidence of WILDTYPE, which is important!
                variants.push({
                    gene,
                    rsid,
                    genotype,
                    quality,
                    filter,
                    rawVcfLine: line
                });
            }
        }

        return {
            variants,
            isSuccess: true,
            metadata: {
                vcfVersion,
                sampleId: "Unknown" // Could extract from header if needed
            }
        };

    } catch (e: any) {
        console.error("VCF Parse Error:", e);
        return { variants: [], isSuccess: false, error: e.message };
    }
}
