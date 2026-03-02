"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnalysisResult } from "@/types";

interface AnalysisContextType {
    file: File | null;
    setFile: (file: File | null) => void;
    selectedDrugs: string[];
    setSelectedDrugs: (drugs: string[]) => void;
    llmProvider: "openrouter" | "groq";
    setLlmProvider: (provider: "openrouter" | "groq") => void;
    llmModel: string;
    setLlmModel: (model: string) => void;
    analysisResults: AnalysisResult[];
    setAnalysisResults: (results: AnalysisResult[]) => void;
    resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
    const [file, setFile] = useState<File | null>(null);
    const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
    const [llmProvider, setLlmProvider] = useState<"openrouter" | "groq">("openrouter");
    const [llmModel, setLlmModel] = useState<string>("stepfun/step-3.5-flash:free");
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

    const resetAnalysis = () => {
        setFile(null);
        setSelectedDrugs([]);
        setAnalysisResults([]);
        setLlmProvider("openrouter");
        setLlmModel("stepfun/step-3.5-flash:free");
    };

    return (
        <AnalysisContext.Provider
            value={{
                file,
                setFile,
                selectedDrugs,
                setSelectedDrugs,
                llmProvider,
                setLlmProvider,
                llmModel,
                setLlmModel,
                analysisResults,
                setAnalysisResults,
                resetAnalysis,
            }}
        >
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error("useAnalysis must be used within an AnalysisProvider");
    }
    return context;
}
