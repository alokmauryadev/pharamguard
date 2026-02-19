"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { UploadStep } from "@/components/wizard/steps/UploadStep";
import { DrugSelectionStep } from "@/components/wizard/steps/DrugSelectionStep";
import { ProcessingStep } from "@/components/wizard/steps/ProcessingStep";
import { Dna } from "lucide-react";
import Link from "next/link";
import { AnalysisResult } from "@/types";

export default function AnalyzePage() {
    const router = useRouter();
    const { file, selectedDrugs, setAnalysisResults } = useAnalysis();
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const steps = ["Upload Data", "Select Drugs", "Analysis"];

    const handleAnalysis = async () => {
        if (!file || selectedDrugs.length === 0) return;

        setIsAnalyzing(true);
        setCurrentStep(3);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("drugs", selectedDrugs.join(","));

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data: AnalysisResult[] = await response.json();
            setAnalysisResults(data);

            setTimeout(() => {
                router.push("/report");
            }, 4000);

        } catch (error) {
            console.error(error);
            setIsAnalyzing(false);
            alert("Analysis failed. Please try again.");
            setCurrentStep(2);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            {/* Mini Navbar */}
            <nav
                className="sticky top-0 z-50 glass"
                style={{ borderBottom: "1px solid rgba(232,232,232,0.7)" }}
            >
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div
                            className="flex items-center justify-center w-8 h-8"
                            style={{ background: "var(--primary)", borderRadius: "var(--radius-md)" }}
                        >
                            <Dna className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm" style={{ color: "var(--foreground)" }}>PharmaGuard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {steps.map((step, i) => (
                            <span
                                key={i}
                                className="text-xs font-medium px-2 py-1 rounded"
                                style={{
                                    color: currentStep === i + 1 ? "var(--accent-blue)" : "var(--gray-400)",
                                    background: currentStep === i + 1 ? "var(--accent-blue-light)" : "transparent",
                                }}
                            >
                                {step}
                            </span>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
                <StepIndicator currentStep={currentStep} totalSteps={3} steps={steps} />
                <div className="mt-8">
                    {currentStep === 1 && <UploadStep onNext={() => setCurrentStep(2)} />}
                    {currentStep === 2 && (
                        <DrugSelectionStep
                            onNext={handleAnalysis}
                            onBack={() => setCurrentStep(1)}
                        />
                    )}
                    {currentStep === 3 && <ProcessingStep />}
                </div>
            </main>
        </div>
    );
}
