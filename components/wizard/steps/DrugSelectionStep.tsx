"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { SUPPORTED_DRUGS } from "@/lib/knowledge-base";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, Pill, Cpu } from "lucide-react";

const PROVIDERS = {
    openrouter: [
        { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash (Free)" },
        { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
        { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
    ],
    groq: [
        { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
        { id: "llama3-70b-8192", name: "Llama 3 70B" },
        { id: "mixtral-8x7b-32768", name: "Mixtral 8x7b" },
        { id: "openai/gpt-oss-120b", name: "GPT OSS 120B" },
    ]
};

export function DrugSelectionStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const {
        selectedDrugs, setSelectedDrugs,
        llmProvider, setLlmProvider,
        llmModel, setLlmModel
    } = useAnalysis();

    const toggleDrug = (drug: string) => {
        if (selectedDrugs.includes(drug)) {
            setSelectedDrugs(selectedDrugs.filter((d) => d !== drug));
        } else {
            setSelectedDrugs([...selectedDrugs, drug]);
        }
    };

    const selectAll = () => setSelectedDrugs([...SUPPORTED_DRUGS]);
    const clearAll = () => setSelectedDrugs([]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
                >
                    Select Medications to Screen
                </h2>
                <p style={{ color: "var(--gray-500)", fontSize: "14px" }}>
                    Choose the drugs you want to analyze against the patient's genomic profile.
                </p>
            </div>

            <div className="ds-card-lg p-6" style={{ borderRadius: "var(--radius-2xl)" }}>
                {/* Quick actions */}
                <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-semibold" style={{ color: "var(--gray-600)" }}>
                        {selectedDrugs.length > 0
                            ? `${selectedDrugs.length} drug${selectedDrugs.length > 1 ? "s" : ""} selected`
                            : "Select one or more drugs"}
                    </span>
                    <div className="flex gap-3">
                        <button
                            onClick={selectAll}
                            className="text-xs font-semibold transition-colors"
                            style={{ color: "var(--primary)" }}
                            onMouseOver={e => (e.currentTarget.style.color = "var(--primary-dark)")}
                            onMouseOut={e => (e.currentTarget.style.color = "var(--primary)")}
                        >
                            Select All
                        </button>
                        {selectedDrugs.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-xs font-semibold transition-colors"
                                style={{ color: "var(--gray-400)" }}
                                onMouseOver={e => (e.currentTarget.style.color = "var(--error)")}
                                onMouseOut={e => (e.currentTarget.style.color = "var(--gray-400)")}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Drug Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                    {SUPPORTED_DRUGS.map((drug) => {
                        const isSelected = selectedDrugs.includes(drug);
                        return (
                            <button
                                key={drug}
                                onClick={() => toggleDrug(drug)}
                                className={cn("relative flex items-center gap-2.5 px-4 py-3 text-left transition-all duration-200")}
                                style={{
                                    borderRadius: "var(--radius-pill)",
                                    border: isSelected
                                        ? "2px solid var(--accent-blue)"
                                        : "1.5px solid var(--border)",
                                    background: isSelected ? "var(--accent-blue)" : "var(--surface)",
                                    color: isSelected ? "#FFFFFF" : "var(--gray-600)",
                                    boxShadow: isSelected ? "0 2px 8px rgba(74,123,247,0.25)" : "none",
                                    transform: isSelected ? "translateY(-1px)" : "none",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                }}
                                onMouseOver={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-blue)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--accent-blue)";
                                    }
                                }}
                                onMouseOut={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--gray-600)";
                                    }
                                }}
                            >
                                <span
                                    className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                                    style={{
                                        background: isSelected ? "rgba(255,255,255,0.25)" : "var(--gray-100)",
                                    }}
                                >
                                    {isSelected
                                        ? <Check className="w-3 h-3" />
                                        : <Pill className="w-3 h-3" style={{ color: "var(--gray-400)" }} />
                                    }
                                </span>
                                <span className="truncate">{drug}</span>
                            </button>
                        );
                    })}
                </div>

                {/* LLM Selection Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu className="w-4 h-4 text-indigo-500" />
                        <h3 className="font-semibold text-sm text-slate-800">AI Model Settings</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Provider</label>
                            <select
                                value={llmProvider}
                                onChange={(e) => {
                                    const newProvider = e.target.value as "openrouter" | "groq";
                                    setLlmProvider(newProvider);
                                    setLlmModel(PROVIDERS[newProvider][0].id); // reset model when provider changes
                                }}
                                className="w-full text-sm font-medium bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="openrouter">OpenRouter</option>
                                <option value="groq">Groq (Ultra-Fast)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Model</label>
                            <select
                                value={llmModel}
                                onChange={(e) => setLlmModel(e.target.value)}
                                className="w-full text-sm font-medium bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {PROVIDERS[llmProvider].map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div
                    className="flex items-center justify-between pt-5"
                    style={{ borderTop: "1px solid var(--border)" }}
                >
                    <button onClick={onBack} className="ds-btn-ghost">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={onNext}
                        disabled={selectedDrugs.length === 0}
                        className="ds-btn-primary"
                        style={{
                            padding: "12px 28px",
                            opacity: selectedDrugs.length === 0 ? 0.45 : 1,
                            cursor: selectedDrugs.length === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        Analyze Risk Profile
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
