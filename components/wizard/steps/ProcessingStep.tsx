"use client";

import { useEffect, useState } from "react";
import { Brain, FileSearch, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
    { icon: FileSearch, text: "Parsing VCF Genomic Data...", detail: "Identifying variant call records" },
    { icon: Brain, text: "Consulting Knowledge Base...", detail: "Cross-referencing CPIC guidelines" },
    { icon: Loader2, text: "AI Generating Clinical Insights...", detail: "Building your personalized report" },
];

export function ProcessingStep() {
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-xl mx-auto">
            <div
                className="ds-card-lg p-10 text-center"
                style={{ borderRadius: "var(--radius-2xl)" }}
            >
                {/* Spinner */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Outer track */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{ border: "4px solid var(--gray-100)" }}
                    />
                    {/* Spinning ring */}
                    <div
                        className="absolute inset-0 rounded-full animate-spin"
                        style={{
                            border: "4px solid transparent",
                            borderTopColor: "var(--primary)",
                            borderRightColor: "rgba(76,175,80,0.3)",
                        }}
                    />
                    {/* Second ring */}
                    <div
                        className="absolute inset-2 rounded-full animate-spin"
                        style={{
                            border: "3px solid transparent",
                            borderTopColor: "var(--accent-blue)",
                            animationDirection: "reverse",
                            animationDuration: "1.5s",
                        }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Brain
                            className="w-8 h-8 animate-pulse"
                            style={{ color: "var(--primary)" }}
                        />
                    </div>
                </div>

                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
                >
                    Analyzing Pharmacogenomic Profile
                </h2>
                <p className="text-sm mb-8" style={{ color: "var(--gray-400)" }}>
                    This may take a few moments. Please don't close this tab.
                </p>

                {/* Step list */}
                <div className="space-y-3 max-w-xs mx-auto text-left">
                    {LOADING_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const status = index < activeStepIndex ? "completed" : index === activeStepIndex ? "active" : "pending";

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-500"
                                style={{
                                    background: status === "active"
                                        ? "var(--accent-blue-light)"
                                        : status === "completed"
                                            ? "var(--primary-light)"
                                            : "transparent",
                                    opacity: status === "pending" ? 0.4 : 1,
                                }}
                            >
                                <div
                                    className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                                    style={{
                                        background: status === "completed"
                                            ? "var(--primary)"
                                            : status === "active"
                                                ? "var(--accent-blue)"
                                                : "var(--gray-200)",
                                    }}
                                >
                                    {status === "completed" ? (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    ) : status === "active" ? (
                                        <Icon className="w-4 h-4 text-white animate-pulse" />
                                    ) : (
                                        <Icon className="w-4 h-4" style={{ color: "var(--gray-400)" }} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p
                                        className="text-sm font-semibold"
                                        style={{
                                            color: status === "completed"
                                                ? "var(--primary-dark)"
                                                : status === "active"
                                                    ? "var(--accent-blue-dark)"
                                                    : "var(--gray-400)",
                                        }}
                                    >
                                        {step.text}
                                    </p>
                                    {status === "active" && (
                                        <p className="text-xs mt-0.5" style={{ color: "var(--accent-blue)" }}>
                                            {step.detail}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
