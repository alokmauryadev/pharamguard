"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { SUPPORTED_DRUGS } from "@/lib/knowledge-base";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, Pill } from "lucide-react";

export function DrugSelectionStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { selectedDrugs, setSelectedDrugs } = useAnalysis();

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
