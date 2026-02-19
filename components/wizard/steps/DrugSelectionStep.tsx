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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Medications</h2>
                <p className="text-slate-600">
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
                                        ? "border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500 shadow-md"
                                        : "border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/30 text-slate-700 hover:shadow-sm"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                                        isSelected
                                            ? "bg-teal-500 text-white"
                                            : "bg-slate-100 text-slate-400 group-hover:text-teal-500 group-hover:bg-white border border-transparent group-hover:border-teal-100"
                                    )}
                                >
                                    {isSelected ? <Check className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                                </div>
                                <span className={cn("font-bold", isSelected ? "text-teal-900" : "text-slate-700")}>{drug}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={onNext}
                        disabled={selectedDrugs.length === 0}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Analyze Risks
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
