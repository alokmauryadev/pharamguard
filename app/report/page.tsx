"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { generatePDF } from "@/lib/pdf-generator";
import { Download, AlertTriangle, CheckCircle, XCircle, ArrowRight, Dna, Copy, FileJson, ArrowLeft } from "lucide-react";

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
        const a = document.createElement("a");
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "pharmaguard_analysis.json");
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // Risk severity helpers
    const getSeverityConfig = (severity: string) => {
        if (severity === "critical" || severity === "high") {
            return {
                badgeClass: "ds-badge ds-badge-error",
                headerBg: "#FFF5F5",
                headerBorder: "#FFCDD2",
                icon: XCircle,
                iconColor: "#C62828",
                leftPanelBg: "#FFF5F5",
                leftPanelBorder: "#FFCDD2",
            };
        }
        if (severity === "moderate") {
            return {
                badgeClass: "ds-badge ds-badge-warning",
                headerBg: "#FFFDE7",
                headerBorder: "#FFF176",
                icon: AlertTriangle,
                iconColor: "#E65100",
                leftPanelBg: "#FFFDE7",
                leftPanelBorder: "#FFE082",
            };
        }
        return {
            badgeClass: "ds-badge ds-badge-success",
            headerBg: "#F1F8E9",
            headerBorder: "#C5E1A5",
            icon: CheckCircle,
            iconColor: "#2E7D32",
            leftPanelBg: "#F1F8E9",
            leftPanelBorder: "#A5D6A7",
        };
    };

    return (
        <main className="min-h-screen pb-24" style={{ background: "var(--background)" }}>

            {/* ── Sticky Header ─────────────────────── */}
            <div
                className="sticky top-0 z-10 glass"
                style={{ borderBottom: "1px solid rgba(232,232,232,0.8)", backdropFilter: "blur(16px)" }}
            >
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div
                            className="flex items-center justify-center w-8 h-8"
                            style={{ background: "var(--primary)", borderRadius: "var(--radius-md)" }}
                        >
                            <Dna className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>
                            Analysis Report
                        </span>
                        <span
                            className="ds-badge"
                            style={{
                                background: "var(--primary-light)",
                                color: "var(--primary-dark)",
                                border: "1px solid #A5D6A7",
                                padding: "2px 10px",
                                fontSize: "10px",
                            }}
                        >
                            {analysisResults.length} Drug{analysisResults.length > 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push("/analyze")}
                            className="ds-btn-ghost hidden sm:flex"
                            style={{ fontSize: "13px", padding: "8px 14px" }}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            New Analysis
                        </button>

                        <button
                            onClick={handleCopyJson}
                            className="ds-btn-secondary"
                            style={{ fontSize: "12px", padding: "8px 14px", gap: "6px" }}
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copySuccess ? "Copied!" : "Copy JSON"}
                        </button>

                        <button
                            onClick={handleDownloadJson}
                            className="ds-btn-secondary"
                            style={{ fontSize: "12px", padding: "8px 14px", gap: "6px" }}
                        >
                            <FileJson className="w-3.5 h-3.5" />
                            JSON
                        </button>

                        <button
                            onClick={handleDownloadPdf}
                            disabled={isGeneratingPdf}
                            className="ds-btn-primary"
                            style={{ fontSize: "13px", padding: "8px 18px" }}
                        >
                            {isGeneratingPdf ? (
                                "Generating..."
                            ) : (
                                <>
                                    <Download className="w-3.5 h-3.5" />
                                    PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Report Content ────────────────────── */}
            <div id="report-content" className="max-w-5xl mx-auto px-6 py-12">

                {/* Page Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span
                            className="ds-badge"
                            style={{
                                background: "var(--primary-light)",
                                color: "var(--primary-dark)",
                                border: "1px solid #A5D6A7",
                                padding: "4px 14px",
                                fontSize: "11px",
                            }}
                        >
                            Pharmacogenomic Risk Assessment
                        </span>
                    </div>
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
                    >
                        Genomic Risk Report
                    </h1>
                    <p style={{ color: "var(--gray-400)", fontSize: "14px" }}>
                        Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        {analysisResults[0]?.patient_id && ` · Patient ID: ${analysisResults[0].patient_id}`}
                    </p>
                </div>

                {/* Drug Cards */}
                <div className="space-y-8">
                    {analysisResults.map((result, index) => {
                        const s = result.risk_assessment.severity;
                        const config = getSeverityConfig(s);
                        const Icon = config.icon;

                        return (
                            <div
                                key={index}
                                className="ds-card-lg overflow-hidden"
                                style={{ borderRadius: "var(--radius-2xl)" }}
                            >
                                {/* Card Header */}
                                <div
                                    className="flex items-start justify-between px-8 py-6"
                                    style={{
                                        background: config.headerBg,
                                        borderBottom: `1px solid ${config.headerBorder}`,
                                    }}
                                >
                                    <div>
                                        <h2
                                            className="text-2xl font-bold mb-2"
                                            style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
                                        >
                                            {result.drug}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs" style={{ color: "var(--gray-500)" }}>
                                                Gene Targeted:
                                            </span>
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                                                style={{
                                                    background: "rgba(255,255,255,0.7)",
                                                    color: "var(--gray-700)",
                                                    border: "1px solid var(--border)",
                                                }}
                                            >
                                                {result.pharmacogenomic_profile.primary_gene}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Risk Badge */}
                                    <div className={config.badgeClass} style={{ padding: "8px 16px", fontSize: "12px" }}>
                                        <Icon className="w-4 h-4" />
                                        {result.risk_assessment.risk_label}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="grid md:grid-cols-2 gap-0 divide-x" style={{ borderColor: "var(--border)" }}>

                                    {/* Left: AI Explanation */}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span
                                                className="flex items-center justify-center w-6 h-6 rounded-full"
                                                style={{ background: "var(--accent-blue-light)", color: "var(--accent-blue)" }}
                                            >
                                                <Dna className="w-3.5 h-3.5" />
                                            </span>
                                            <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                                                Clinical Insight
                                            </h3>
                                        </div>

                                        <div
                                            className="rounded-2xl p-5"
                                            style={{ background: "var(--accent-blue-light)", border: "1px solid #BBDEFB" }}
                                        >
                                            <p className="leading-relaxed mb-4 text-sm" style={{ color: "var(--gray-700)" }}>
                                                {result.llm_generated_explanation.summary}
                                            </p>
                                            <div
                                                className="pt-4 text-sm"
                                                style={{ borderTop: "1px solid #BBDEFB" }}
                                            >
                                                <span
                                                    className="font-semibold block mb-1.5"
                                                    style={{ color: "var(--accent-blue-dark)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                                >
                                                    Mechanism
                                                </span>
                                                <p className="italic text-sm" style={{ color: "var(--gray-600)" }}>
                                                    "{result.llm_generated_explanation.mechanism}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Genomic Details */}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span
                                                className="flex items-center justify-center w-6 h-6 rounded-full"
                                                style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                                            >
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                            <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                                                Genomic Details
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div
                                                className="flex justify-between items-center p-3.5 rounded-xl text-sm"
                                                style={{ background: "var(--gray-50)", border: "1px solid var(--border)" }}
                                            >
                                                <span style={{ color: "var(--gray-500)" }}>Phenotype</span>
                                                <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {result.pharmacogenomic_profile.phenotype}
                                                </span>
                                            </div>

                                            <div
                                                className="flex justify-between items-center p-3.5 rounded-xl text-sm"
                                                style={{ background: "var(--gray-50)", border: "1px solid var(--border)" }}
                                            >
                                                <span style={{ color: "var(--gray-500)" }}>Diplotype</span>
                                                <span
                                                    className="font-mono font-semibold"
                                                    style={{ color: "var(--foreground)", fontSize: "12px" }}
                                                >
                                                    {result.pharmacogenomic_profile.diplotype}
                                                </span>
                                            </div>

                                            {/* Recommendation callout */}
                                            <div
                                                className="p-4 rounded-xl text-sm"
                                                style={{ background: config.leftPanelBg, border: `1px solid ${config.leftPanelBorder}` }}
                                            >
                                                <span
                                                    className="block mb-2 font-semibold"
                                                    style={{ color: config.iconColor, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}
                                                >
                                                    Clinical Recommendation
                                                </span>
                                                <p className="font-medium leading-relaxed" style={{ color: "var(--gray-700)" }}>
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

                {/* Footer Note */}
                <div
                    className="mt-12 text-center p-6 rounded-2xl"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                    <p className="text-xs" style={{ color: "var(--gray-400)" }}>
                        ⚠️ This report is generated for educational and research purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed clinician before making any medical decisions.
                    </p>
                </div>
            </div>
        </main>
    );
}
