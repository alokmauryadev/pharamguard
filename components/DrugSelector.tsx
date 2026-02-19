"use client";

import { useState } from "react";
import { Pill, Check } from "lucide-react";
import { clsx } from "clsx";
import { SUPPORTED_DRUGS } from "@/lib/knowledge-base";

interface DrugSelectorProps {
    selectedDrugs: string[];
    onChange: (drugs: string[]) => void;
}

export function DrugSelector({ selectedDrugs, onChange }: DrugSelectorProps) {
    const toggleDrug = (drug: string) => {
        if (selectedDrugs.includes(drug)) {
            onChange(selectedDrugs.filter((d) => d !== drug));
        } else {
            onChange([...selectedDrugs, drug]);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Drugs to Analyze
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUPPORTED_DRUGS.map((drug) => {
                    const isSelected = selectedDrugs.includes(drug);
                    return (
                        <button
                            key={drug}
                            onClick={() => toggleDrug(drug)}
                            className={clsx(
                                "relative flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                                isSelected
                                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                            )}
                        >
                            <div
                                className={clsx(
                                    "w-5 h-5 rounded flex items-center justify-center border",
                                    isSelected
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-slate-300 bg-white"
                                )}
                            >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="font-medium text-sm">{drug}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
                Select one or more drugs (* denotes major pharmacogenomic interactions)
            </p>
        </div>
    );
}
