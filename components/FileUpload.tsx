"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { clsx } from "clsx";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith(".vcf")) {
                setSelectedFile(file);
                onFileSelect(file);
            } else {
                alert("Please upload a .vcf file");
            }
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.name.endsWith(".vcf")) {
                setSelectedFile(file);
                onFileSelect(file);
            } else {
                alert("Please upload a .vcf file");
            }
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Patient VCF Data
            </label>

            {!selectedFile ? (
                <div
                    className={clsx(
                        "relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer",
                        dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                        accept=".vcf"
                    />
                    <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                        <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        .vcf files only (max 5MB)
                    </p>
                </div>
            ) : (
                <div className="relative border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
