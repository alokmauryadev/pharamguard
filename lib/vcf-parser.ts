import { KNOWN_VARIANTS, GeneSymbol } from "./knowledge-base";

export interface DetectedVariant {
    gene: GeneSymbol;
    rsid: string;
    genotype: string;
    impact: string;
}

export interface ParseResult {
    variants: DetectedVariant[];
    isSuccess: boolean;
    error?: string;
}

export function parseVCF(vcfContent: string): ParseResult {
    const variants: DetectedVariant[] = [];
    const lines = vcfContent.split("\n");

    try {
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;

            const cols = trimmed.split("\t");
            if (cols.length < 5) continue;

            // VCF columns: CHROM POS ID REF ALT QUAL FILTER INFO (FORMAT SAMPLE...)
            const rsid = cols[2];

            // Check if this rsID is in our known list
            if (KNOWN_VARIANTS[rsid]) {
                const known = KNOWN_VARIANTS[rsid];

                // Extract genotype if available (usually last column, formatted like 0/1 or 1/1)
                // For simplicity in this hackathon, we assume the last column is the sample
                const sampleData = cols[lines[0].startsWith("##") ? 9 : 9] || "0/1"; // Fallback/Simplification
                const genotype = sampleData.split(":")[0]; // GT is usually first in FORMAT

                // If genotype is 0/0 or ./., they don't have the variant (usually)
                // But for target variants (which are usually "bad"), 0/1 or 1/1 means they HAVE it.
                // 0/0 means Ref/Ref (Normal).

                if (genotype !== "0/0" && genotype !== "./.") {
                    variants.push({
                        gene: known.gene,
                        rsid: rsid,
                        genotype: genotype,
                        impact: known.impact
                    });
                }
            }
        }
        return { variants, isSuccess: true };
    } catch (e: any) {
        return { variants: [], isSuccess: false, error: e.message };
    }
}
