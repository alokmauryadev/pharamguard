"use client";

import { AnalysisResult } from "@/types";
import { AlertCircle, CheckCircle, AlertTriangle, FileJson, Copy, Info, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

interface ResultsDashboardProps {
    results: AnalysisResult[];
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "pharmaguard_results.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!results.length) return null;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Copy className="w-4 h-4" /> Copy JSON
                    </button>
                    <button
                        onClick={downloadJSON}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <FileJson className="w-4 h-4" /> Download Report
                    </button>
                </div>
            </div>

            {results.map((result, index) => {
                const severity = result.risk_assessment.severity.toLowerCase();
                let colorClass = "bg-slate-50 border-slate-200";
                let icon = <Info className="w-6 h-6 text-slate-500" />;
                let statusColor = "text-slate-700";

                if (severity === "none" || result.risk_assessment.risk_label === "Safe") {
                    colorClass = "bg-green-50 border-green-200";
                    icon = <CheckCircle className="w-6 h-6 text-green-600" />;
                    statusColor = "text-green-800";
                } else if (severity === "low" || severity === "moderate" || result.risk_assessment.risk_label === "Adjust Dosage") {
                    colorClass = "bg-yellow-50 border-yellow-200";
                    icon = <AlertTriangle className="w-6 h-6 text-yellow-600" />;
                    statusColor = "text-yellow-800";
                } else if (severity === "high" || severity === "critical" || result.risk_assessment.risk_label === "Toxic" || result.risk_assessment.risk_label === "Ineffective") {
                    colorClass = "bg-red-50 border-red-200";
                    icon = <AlertCircle className="w-6 h-6 text-red-600" />;
                    statusColor = "text-red-800";
                }

                const isExpanded = expandedItems[index] || false;

                return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className={clsx("p-6 flex items-start justify-between border-b", colorClass)}>
                            <div className="flex gap-4">
                                <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                                    {icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{result.drug}</h3>
                                    <p className={clsx("font-semibold mt-1", statusColor)}>
                                        Risk: {result.risk_assessment.risk_label.toUpperCase()}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Gene: <span className="font-mono font-medium">{result.pharmacogenomic_profile.primary_gene}</span> •
                                        Phenotype: <span className="font-medium">{result.pharmacogenomic_profile.phenotype}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-slate-800">
                                    Confidence: {(result.risk_assessment.confidence_score * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">

                            {/* Clinical Recommendation */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Clinical Recommendation</h4>
                                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {result.clinical_recommendation.summary}
                                </p>
                            </div>

                            {/* LLM Explanation */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
                                    <span>AI Analysis</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 border border-purple-200">Gemini Powered</span>
                                </h4>
                                <div className="prose prose-sm max-w-none text-slate-600">
                                    <p className="mb-2"><span className="font-medium text-slate-900">Summary: </span>{result.llm_generated_explanation.summary}</p>
                                    <p className="mb-2"><span className="font-medium text-slate-900">Mechanism: </span>{result.llm_generated_explanation.mechanism}</p>

                                    {result.llm_generated_explanation.citations.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-medium text-slate-900 text-xs mb-1">References:</p>
                                            <ul className="list-disc list-inside text-xs text-slate-500">
                                                {result.llm_generated_explanation.citations.map((cite, i) => (
                                                    <li key={i}>{cite}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Technical Details (Expandable) */}
                            <div className="border-t border-slate-100 pt-4">
                                <button
                                    onClick={() => toggleExpand(index.toString())}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
                                >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    {isExpanded ? "Hide Technical Details" : "Show Technical Details"}
                                </button>

                                {isExpanded && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                                        <div>
                                            <h5 className="font-semibold text-slate-900 mb-2">Genomic Findings</h5>
                                            <p>Diplotype: <span className="font-mono">{result.pharmacogenomic_profile.diplotype}</span></p>
                                            <p>Variants Detected: {result.pharmacogenomic_profile.detected_variants.length}</p>
                                            <ul className="mt-1 space-y-1">
                                                {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                                                    <li key={i} className="text-xs font-mono text-slate-600">
                                                        {v.rsid}: {v.genotype} ({v.impact})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-slate-900 mb-2">Quality Metrics</h5>
                                            <p>VCF Parsed: {result.quality_metrics.vcf_parsing_success ? "Yes" : "No"}</p>
                                            <p>Total Variants Scanned: {result.quality_metrics.variant_count}</p>
                                            <p className="text-xs text-slate-400 mt-2">ID: {result.patient_id}</p>
                                            <p className="text-xs text-slate-400">Time: {new Date(result.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}
