"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { generatePDF } from "@/lib/pdf-generator";
import { GlassCard } from "@/components/ui/GlassCard";
import { Download, AlertTriangle, CheckCircle, XCircle, ArrowRight, Dna } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportPage() {
    const { analysisResults } = useAnalysis();
    const router = useRouter();
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (analysisResults.length === 0) {
            router.push("/analyze");
        }
    }, [analysisResults, router]);

    if (analysisResults.length === 0) return null;

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        // Ensure we wait for any renders
        setTimeout(async () => {
            await generatePDF("report-content", "PharmaGuard_Report.pdf");
            setIsGeneratingPdf(false);
        }, 100);
    };

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(analysisResults, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleDownloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResults, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "pharmaguard_analysis.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] pb-24 text-slate-900">
            {/* Header / Actions */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#0d9488] rounded-lg">
                            <Dna className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">Analysis Report</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/analyze")}
                            className="hidden sm:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            New Analysis
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                        <button
                            onClick={handleCopyJson}
                            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            {copySuccess ? "Copied!" : "Copy JSON"}
                        </button>

                        <button
                            onClick={handleDownloadJson}
                            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            JSON
                        </button>

                        <button
                            onClick={handleDownloadPdf}
                            disabled={isGeneratingPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-semibold hover:bg-[#1e293b] disabled:opacity-70 transition-all shadow-sm"
                        >
                            {isGeneratingPdf ? "Generating..." : (
                                <>
                                    <Download className="w-4 h-4" />
                                    PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content - Explicit white background and hex colors for PDF safety */}
            <div id="report-content" className="max-w-5xl mx-auto px-6 py-12" style={{ backgroundColor: "#f8fafc" }}>
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: "#0f172a" }}>Pharmacogenomic Risk Assessment</h1>
                    <p style={{ color: "#64748b" }}>Generated on {new Date().toLocaleDateString()} for Patient ID: {analysisResults[0]?.patient_id}</p>
                </div>

                <div className="space-y-8">
                    {analysisResults.map((result, index) => {
                        // Helper to get severity colors
                        const s = result.risk_assessment.severity;
                        let badgeBg = "#ecfdf5"; // emerald-50
                        let badgeBorder = "#a7f3d0"; // emerald-200
                        let badgeText = "#047857"; // emerald-700
                        let Icon = CheckCircle;

                        if (s === "critical" || s === "high") {
                            badgeBg = "#fef2f2"; // red-50
                            badgeBorder = "#fecaca"; // red-200
                            badgeText = "#b91c1c"; // red-700
                            Icon = XCircle;
                        } else if (s === "moderate") {
                            badgeBg = "#fffbeb"; // amber-50
                            badgeBorder = "#fde68a"; // amber-200
                            badgeText = "#b45309"; // amber-700
                            Icon = AlertTriangle;
                        }

                        return (
                            <div key={index} className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6 pb-6" style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0f172a" }}>{result.drug}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm" style={{ color: "#64748b" }}>Gene Targeted:</span>
                                            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ backgroundColor: "#f1f5f9", color: "#334155" }}>
                                                {result.pharmacogenomic_profile.primary_gene}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl border flex items-center gap-2"
                                        style={{ backgroundColor: badgeBg, borderColor: badgeBorder, color: badgeText }}>
                                        <Icon className="w-5 h-5" />
                                        <span className="font-bold uppercase tracking-wide text-sm">{result.risk_assessment.risk_label}</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Left: AI Explanation */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                                <Dna className="w-3.5 h-3.5" />
                                            </span>
                                            <h3 className="font-semibold" style={{ color: "#0f172a" }}>Clinical Insight</h3>
                                        </div>
                                        <div className="rounded-xl p-5 border" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
                                            <p className="leading-relaxed mb-4" style={{ color: "#334155" }}>
                                                {result.llm_generated_explanation.summary}
                                            </p>
                                            <div className="text-sm">
                                                <span className="font-semibold block mb-1" style={{ color: "#0f172a" }}>Mechanism:</span>
                                                <p className="italic" style={{ color: "#475569" }}>
                                                    "{result.llm_generated_explanation.mechanism}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Technical Details */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: "rgba(13, 148, 136, 0.1)", color: "#0d9488" }}>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                            <h3 className="font-semibold" style={{ color: "#0f172a" }}>Genomic Details</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between p-3 rounded-lg border text-sm" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
                                                <span style={{ color: "#64748b" }}>Phenotype</span>
                                                <span className="font-medium" style={{ color: "#0f172a" }}>{result.pharmacogenomic_profile.phenotype}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg border text-sm" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
                                                <span style={{ color: "#64748b" }}>Diplotype</span>
                                                <span className="font-medium" style={{ color: "#0f172a" }}>{result.pharmacogenomic_profile.diplotype}</span>
                                            </div>
                                            <div className="p-3 rounded-lg border text-sm" style={{ backgroundColor: "#ffffff", borderColor: "#f1f5f9" }}>
                                                <span className="block mb-2" style={{ color: "#64748b" }}>Detailed Recommendation</span>
                                                <p className="font-medium" style={{ color: "#0f172a" }}>
                                                    {result.clinical_recommendation.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
