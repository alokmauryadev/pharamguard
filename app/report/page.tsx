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

            {/* Report Content - Explicit white background for PDF safety */}
            <div id="report-content" className="max-w-5xl mx-auto px-6 py-12 bg-[#f8fafc]">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Pharmacogenomic Risk Assessment</h1>
                    <p className="text-slate-500">Generated on {new Date().toLocaleDateString()} for Patient ID: {analysisResults[0]?.patient_id}</p>
                </div>

                <div className="space-y-8">
                    {analysisResults.map((result, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{result.drug}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-500">Gene Targeted:</span>
                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                                            {result.pharmacogenomic_profile.primary_gene}
                                        </span>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-4 py-2 rounded-xl border flex items-center gap-2",
                                    result.risk_assessment.severity === "critical" || result.risk_assessment.severity === "high"
                                        ? "bg-red-50 border-red-200 text-red-700"
                                        : result.risk_assessment.severity === "moderate"
                                            ? "bg-amber-50 border-amber-200 text-amber-700"
                                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                )}>
                                    {result.risk_assessment.severity === "critical" || result.risk_assessment.severity === "high" ? <XCircle className="w-5 h-5" /> :
                                        result.risk_assessment.severity === "moderate" ? <AlertTriangle className="w-5 h-5" /> :
                                            <CheckCircle className="w-5 h-5" />}
                                    <span className="font-bold uppercase tracking-wide text-sm">{result.risk_assessment.risk_label}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Left: AI Explanation */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
                                            <Dna className="w-3.5 h-3.5" />
                                        </span>
                                        <h3 className="font-semibold text-slate-900">Clinical Insight</h3>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <p className="text-slate-700 leading-relaxed mb-4">
                                            {result.llm_generated_explanation.summary}
                                        </p>
                                        <div className="text-sm">
                                            <span className="font-semibold text-slate-900 block mb-1">Mechanism:</span>
                                            <p className="text-slate-600 italic">
                                                "{result.llm_generated_explanation.mechanism}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Technical Details */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d9488]/10 text-[#0d9488]">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                        <h3 className="font-semibold text-slate-900">Genomic Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between p-3 rounded-lg bg-white border border-slate-100 text-sm">
                                            <span className="text-slate-500">Phenotype</span>
                                            <span className="font-medium text-slate-900">{result.pharmacogenomic_profile.phenotype}</span>
                                        </div>
                                        <div className="flex justify-between p-3 rounded-lg bg-white border border-slate-100 text-sm">
                                            <span className="text-slate-500">Diplotype</span>
                                            <span className="font-medium text-slate-900">{result.pharmacogenomic_profile.diplotype}</span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white border border-slate-100 text-sm">
                                            <span className="text-slate-500 block mb-2">Detailed Recommendation</span>
                                            <p className="font-medium text-slate-900">
                                                {result.clinical_recommendation.summary}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
