"use client";

import { useEffect, useState } from "react";
import { Loader2, Brain, FileSearch, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
    { icon: FileSearch, text: "Parsing VCF Data...", delay: 0 },
    { icon: Brain, text: "Consulting Knowledge Base...", delay: 1500 },
    { icon: Loader2, text: "AI Generating Clinical Insights...", delay: 3000 },
];

export function ProcessingStep() {
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 2000); // Artificial delay to show progress steps
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <GlassCard className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-teal-600 animate-pulse" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                    Analyzing Pharmacogenomic Profile
                </h2>

                <div className="space-y-4 max-w-sm mx-auto text-left">
                    {LOADING_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const status = index < activeStepIndex ? "completed" : index === activeStepIndex ? "active" : "pending";

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-500",
                                    status === "active" ? "bg-teal-50 border border-teal-100" : "opacity-50"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-full",
                                    status === "completed" ? "bg-teal-100 text-teal-600" :
                                        status === "active" ? "bg-white shadow-sm text-teal-600 animate-pulse" :
                                            "bg-slate-100 text-slate-400"
                                )}>
                                    {status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={cn(
                                    "font-medium text-sm",
                                    status === "active" ? "text-teal-900" : "text-slate-500"
                                )}>
                                    {step.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
        </div>
    );
}
