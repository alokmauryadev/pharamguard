"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DrugSelector } from "@/components/DrugSelector";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AnalysisResult } from "@/types";
import { Dna, Activity, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a VCF file.");
      return;
    }
    if (selectedDrugs.length === 0) {
      setError("Please select at least one drug.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("drugs", selectedDrugs.join(","));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data: AnalysisResult[] = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Dna className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">PharmaGuard</h1>
          </div>
          <p className="max-w-2xl text-lg text-slate-600">
            Precision medicine risk prediction powered by AI. Upload your genetic data to get personalized pharmacogenomic insights.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Input Section */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">1</span>
              <h2 className="text-xl font-semibold text-slate-900">Upload Data</h2>
            </div>
            <FileUpload onFileSelect={(f) => { setFile(f); setError(null); }} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">2</span>
              <h2 className="text-xl font-semibold text-slate-900">Select Medications</h2>
            </div>
            <DrugSelector
              selectedDrugs={selectedDrugs}
              onChange={(drugs) => { setSelectedDrugs(drugs); setError(null); }}
            />
          </section>

          {/* Action Area */}
          <div className="flex flex-col items-center justify-center pt-4 pb-12">
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-4 border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !file || selectedDrugs.length === 0}
              className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg shadow-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Genotype...
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  Generate Risk Analysis
                  <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-16">
            <div className="flex items-center gap-2 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm">3</span>
              <h2 className="text-xl font-semibold text-slate-900">Clinical Report</h2>
            </div>
            <ResultsDashboard results={results} />
          </div>
        )}
      </div>
    </main>
  );
}
