"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { UploadStep } from "@/components/wizard/steps/UploadStep";
import { DrugSelectionStep } from "@/components/wizard/steps/DrugSelectionStep";
import { ProcessingStep } from "@/components/wizard/steps/ProcessingStep";
import { AnalysisResult } from "@/types";

export default function AnalyzePage() {
    const router = useRouter();
    const { file, selectedDrugs, setAnalysisResults } = useAnalysis();
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Steps Configuration
    const steps = ["Upload Data", "Select Drugs", "Analysis"];

    const handleAnalysis = async () => {
        if (!file || selectedDrugs.length === 0) return;

        setIsAnalyzing(true);
        setCurrentStep(3); // Move to "Processing" UI visualization

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("drugs", selectedDrugs.join(","));

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const data: AnalysisResult[] = await response.json();
            setAnalysisResults(data);

            // Artificial delay to let the animation play out for a better UX
            setTimeout(() => {
                router.push("/report");
            }, 4000);

        } catch (error) {
            console.error(error);
            setIsAnalyzing(false);
            alert("Analysis failed. Please try again.");
            setCurrentStep(2); // Go back
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <StepIndicator currentStep={currentStep} totalSteps={3} steps={steps} />

            <div className="max-w-4xl mx-auto">
                {currentStep === 1 && (
                    <UploadStep onNext={() => setCurrentStep(2)} />
                )}

                {currentStep === 2 && (
                    <DrugSelectionStep
                        onNext={handleAnalysis}
                        onBack={() => setCurrentStep(1)}
                    />
                )}

                {currentStep === 3 && (
                    <ProcessingStep />
                )}
            </div>
        </main>
    );
}
