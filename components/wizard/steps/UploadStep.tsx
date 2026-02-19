"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File as FileIcon, X, ArrowRight } from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
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
        if (e.dataTransfer.files?.[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith(".vcf") || droppedFile.name.endsWith(".vcf.gz")) {
                setFile(droppedFile);
            } else {
                alert("Please upload a .vcf or .vcf.gz file");
            }
        }
    }, [setFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: "var(--foreground)", fontFamily: "var(--font-playfair)" }}
                >
                    Upload Genetic Data
                </h2>
                <p style={{ color: "var(--gray-500)", fontSize: "14px" }}>
                    We accept standard VCF files (Variant Call Format) from major sequencing providers.
                </p>
            </div>

            {/* Drop Zone */}
            <div
                className={cn("ds-card transition-all duration-300 cursor-pointer min-h-[280px] flex flex-col items-center justify-center gap-4")}
                style={{
                    border: isDragOver
                        ? "2px dashed var(--primary)"
                        : "2px dashed var(--gray-200)",
                    background: isDragOver ? "var(--primary-light)" : "var(--surface)",
                    borderRadius: "var(--radius-2xl)",
                    boxShadow: isDragOver ? "0 0 0 4px rgba(76,175,80,0.10)" : "var(--shadow-card)",
                }}
            >
                <input
                    type="file"
                    accept=".vcf,.vcf.gz"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />

                {!file ? (
                    <label
                        htmlFor="file-upload"
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-12 gap-4"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div
                            className="flex items-center justify-center w-20 h-20 rounded-full transition-transform duration-300 hover:scale-110"
                            style={{ background: "var(--primary-light)" }}
                        >
                            <UploadCloud className="w-10 h-10" style={{ color: "var(--primary)" }} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
                                Click or drag your VCF file here
                            </p>
                            <p className="text-sm" style={{ color: "var(--gray-400)" }}>
                                Supported: .vcf &nbsp;·&nbsp; .vcf.gz
                            </p>
                        </div>
                        <div
                            className="ds-pill-tag"
                            style={{ fontSize: "11px", padding: "4px 14px", background: "var(--primary-light)", borderColor: "transparent", color: "var(--primary-dark)" }}
                        >
                            Privacy guaranteed — data never stored
                        </div>
                    </label>
                ) : (
                    <div className="w-full max-w-md px-6 py-10">
                        {/* File card */}
                        <div
                            className="flex items-center gap-4 p-4 mb-8 rounded-2xl"
                            style={{ background: "var(--primary-light)", border: "1px solid #A5D6A7" }}
                        >
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl"
                                style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
                            >
                                <FileIcon className="w-6 h-6" style={{ color: "var(--primary)" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>
                                    {file.name}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--gray-500)" }}>
                                    {file.size < 1024 * 1024
                                        ? `${(file.size / 1024).toFixed(2)} KB`
                                        : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                    &nbsp;·&nbsp; Ready for analysis
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                                style={{ color: "var(--gray-400)" }}
                                onMouseOver={e => (e.currentTarget.style.background = "#FFEBEE", e.currentTarget.style.color = "var(--error)")}
                                onMouseOut={e => (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "var(--gray-400)")}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <button onClick={onNext} className="ds-btn-primary w-full justify-center" style={{ fontSize: "15px", padding: "14px" }}>
                            Continue to Medications
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
