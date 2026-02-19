import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full -z-10" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded-full -z-10 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 bg-white dark:bg-slate-900",
                                    isCompleted ? "border-teal-500 bg-teal-500 text-white" :
                                        isCurrent ? "border-teal-500 text-teal-600 scale-110 shadow-lg shadow-teal-500/20" :
                                            "border-slate-300 dark:border-slate-600 text-slate-400"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-bold">{stepNumber}</span>
                                )}
                            </div>
                            <span className={cn(
                                "hidden sm:block text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                                isCurrent ? "text-teal-600 dark:text-teal-400" : "text-slate-400"
                            )}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
