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
    const [showJsonPreview, setShowJsonPreview] = useState(false);

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

    // Calculate Summary Metrics
    const totalAnalyzed = results.length;
    let highRiskCount = 0;
    let moderateRiskCount = 0;
    let safeCount = 0;
    let totalConfidence = 0;

    results.forEach(r => {
        const severity = r.risk_assessment.severity.toLowerCase();
        const label = r.risk_assessment.risk_label.toLowerCase();

        if (severity === "high" || severity === "critical" || label === "toxic" || label === "ineffective") {
            highRiskCount++;
        } else if (severity === "moderate" || severity === "low" || label === "adjust dosage") {
            moderateRiskCount++;
        } else {
            safeCount++;
        }

        totalConfidence += r.risk_assessment.confidence_score;
    });

    const avgConfidence = totalAnalyzed > 0 ? ((totalConfidence / totalAnalyzed) * 100).toFixed(0) : "0";

    const totalProcessingTime = results.reduce((acc, r) => acc + (r.quality_metrics.processing_time_ms || 0), 0);
    const timeDisplay = totalProcessingTime > 0
        ? (totalProcessingTime > 1000 ? `${(totalProcessingTime / 1000).toFixed(2)}s` : `${totalProcessingTime}ms`)
        : "Fast";

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Highly Prominent Action Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Analysis Complete</h2>
                    <p className="text-slate-400 text-sm">Review clinical insights and raw JSON data below.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowJsonPreview(!showJsonPreview)}
                        className={clsx(
                            "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-lg border-2",
                            showJsonPreview
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-emerald-600 text-white border-transparent hover:bg-emerald-500 hover:scale-[1.02]"
                        )}
                    >
                        <FileJson className="w-5 h-5" /> {showJsonPreview ? "Hide JSON Preview" : "View Raw JSON"}
                    </button>
                    <button
                        onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        <Copy className="w-4 h-4" /> Copy
                    </button>
                </div>
            </div>
            {/* JSON Preview Panel (Always on top if expanded) */}
            {showJsonPreview && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl overflow-hidden mt-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                        <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Raw JSON Output</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                    </div>
                    <div className="overflow-auto max-h-96 pr-2">
                        <pre className="text-[13px] font-mono text-emerald-400 leading-relaxed">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </div>
                </div>
            )}

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{totalAnalyzed}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Drugs Analyzed</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{timeDisplay}</div>
                    <div className="text-[10px] font-bold text-indigo-800/70 uppercase tracking-widest">Process Time</div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{highRiskCount}</div>
                    <div className="text-[10px] font-bold text-red-800/70 uppercase tracking-widest flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> High Risk
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{moderateRiskCount}</div>
                    <div className="text-xs font-medium text-yellow-800/70 uppercase tracking-wide flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Moderation
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{safeCount}</div>
                    <div className="text-[10px] font-bold text-green-800/70 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Safe
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={downloadJSON}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                    <FileJson className="w-4 h-4" /> Download Complete Report JSON
                </button>
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
                            <div className="border-t border-slate-100 pt-4 mt-6">
                                <button
                                    onClick={() => toggleExpand(index.toString())}
                                    className="flex w-full items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        {isExpanded ? "Hide Technical Details" : "View Technical & Metric Details"}
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {isExpanded && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm animate-in slide-in-from-top-2 duration-300">
                                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                            <h5 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Genomic Profile</h5>
                                            <div className="space-y-2 text-slate-600">
                                                <div className="flex justify-between"><span className="text-slate-400">Diplotype:</span> <span className="font-mono bg-slate-100 px-1 rounded">{result.pharmacogenomic_profile.diplotype}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-400">Primary Gene:</span> <span className="font-medium">{result.pharmacogenomic_profile.primary_gene}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-400">Phenotype:</span> <span className="font-medium text-right max-w-[120px]">{result.pharmacogenomic_profile.phenotype}</span></div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                                            <h5 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Analysis Quality</h5>
                                            <div className="space-y-2 text-slate-600">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">AI Confidence:</span>
                                                    <span className="font-medium text-emerald-600">{(result.risk_assessment.confidence_score * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Process Time:</span>
                                                    <span className="font-medium">{result.quality_metrics.processing_time_ms ? `${result.quality_metrics.processing_time_ms}ms` : 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Variants Linked:</span>
                                                    <span className="font-medium">{result.pharmacogenomic_profile.detected_variants.length} Detected</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm md:col-span-2 lg:col-span-1">
                                            <h5 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">File Tracing</h5>
                                            <div className="space-y-2 text-slate-600 text-xs">
                                                <p className="flex flex-col"><span className="text-slate-400 mb-0.5">Patient ID:</span> <span className="font-mono bg-slate-50 p-1 rounded border border-slate-100">{result.patient_id}</span></p>
                                                <p className="flex justify-between"><span className="text-slate-400">Timestamp:</span> <span>{new Date(result.timestamp).toLocaleTimeString()}</span></p>
                                                <p className="flex justify-between"><span className="text-slate-400">VCF Scanned:</span> <span>{result.quality_metrics.vcf_parsing_success ? "Successful" : "Failed"}</span></p>
                                            </div>
                                        </div>

                                        {result.pharmacogenomic_profile.detected_variants.length > 0 && (
                                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl md:col-span-2 lg:col-span-3">
                                                <h5 className="font-bold text-slate-900 mb-3 text-sm">Target Variants Detailed View</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.pharmacogenomic_profile.detected_variants.map((v, i) => (
                                                        <div key={i} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs flex items-center gap-2 shadow-sm">
                                                            <span className="font-mono font-bold text-indigo-600">{v.rsid}</span>
                                                            <span className="text-slate-400">|</span>
                                                            <span className="font-medium text-slate-700">{v.genotype}</span>
                                                            <span className="text-slate-400">|</span>
                                                            <span className="text-slate-500 italic max-w-[150px] truncate">{v.impact}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
