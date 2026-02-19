"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export function UploadStep({ onNext }: { onNext: () => void }) {
    const { file, setFile } = useAnalysis();
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith(".vcf") || droppedFile.name.endsWith(".vcf.gz")) { // Basic check
                setFile(droppedFile);
            } else {
                alert("Please upload a .vcf or .vcf.gz file");
            }
        }
    }, [setFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Genetic Data</h2>
                <p className="text-slate-600 dark:text-slate-400">
                    We accept standard VCF files (Variant Call Format) from sequencing providers.
                </p>
            </div>

            <GlassCard className={cn(
                "border-2 border-dashed transition-all duration-300 cursor-pointer min-h-[300px] flex flex-col items-center justify-center gap-4 group",
                isDragOver ? "border-teal-500 bg-teal-50/50" : "border-slate-300 dark:border-slate-700 hover:border-teal-400 hover:bg-slate-50/50"
            )}>
                <input
                    type="file"
                    accept=".vcf,.vcf.gz"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />

                {!file ? (
                    <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all duration-300 mb-4">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                            Click or drag VCF file here
                        </p>
                        <p className="text-sm text-slate-500">
                            Supported formats: .vcf, .vcf.gz
                        </p>
                    </label>
                ) : (
                    <div className="w-full max-w-md">
                        <div className="relative flex items-center gap-4 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
                            <div className="p-3 bg-teal-100 dark:bg-teal-800 rounded-lg">
                                <FileIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={onNext}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                            >
                                Continue to Medications
                            </button>
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
