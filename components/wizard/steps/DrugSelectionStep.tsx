"use client";

import { useAnalysis } from "@/context/AnalysisContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { SUPPORTED_DRUGS } from "@/lib/knowledge-base";
import { cn } from "@/lib/utils";
import { Pill, Check, ArrowRight, ArrowLeft } from "lucide-react";

export function DrugSelectionStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
    const { selectedDrugs, setSelectedDrugs } = useAnalysis();

    const toggleDrug = (drug: string) => {
        if (selectedDrugs.includes(drug)) {
            setSelectedDrugs(selectedDrugs.filter((d) => d !== drug));
        } else {
            setSelectedDrugs([...selectedDrugs, drug]);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select Medications</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Choose the drugs you want to screen against the patient's genotype.
                </p>
            </div>

            <GlassCard>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {SUPPORTED_DRUGS.map((drug) => {
                        const isSelected = selectedDrugs.includes(drug);
                        return (
                            <button
                                key={drug}
                                onClick={() => toggleDrug(drug)}
                                className={cn(
                                    "relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left group",
                                    isSelected
                                        ? "border-teal-500 bg-teal-50/80 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 ring-1 ring-teal-500 shadow-lg shadow-teal-500/10"
                                        : "border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:shadow-md"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                        isSelected
                                            ? "bg-teal-500 text-white"
                                            : "bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-teal-500"
                                    )}
                                >
                                    {isSelected ? <Check className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                                </div>
                                <span className="font-semibold">{drug}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={onNext}
                        disabled={selectedDrugs.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Analyze Risks
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
