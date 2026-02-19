import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto mb-16">
            <div className="relative flex flex-col items-center">
                {/* Steps Container */}
                <div className="flex items-center justify-between w-full relative z-10">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;
                        const isUpcoming = stepNumber > currentStep;

                        return (
                            <div key={label} className="flex flex-col items-center relative group">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        backgroundColor: isCompleted || isCurrent ? "#0d9488" : "#ffffff", // teal-600 : white
                                        borderColor: isCompleted || isCurrent ? "#0d9488" : "#e2e8f0", // teal-600 : slate-200
                                        color: isCompleted || isCurrent ? "#ffffff" : "#94a3b8", // white : slate-400
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm z-10",
                                        "font-bold text-lg transition-colors duration-300",
                                        isUpcoming && "bg-slate-50 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "absolute top-14 text-sm font-bold tracking-wide uppercase whitespace-nowrap",
                                        isCurrent ? "text-teal-700" :
                                            isCompleted ? "text-slate-600" : "text-slate-400"
                                    )}
                                >
                                    {label}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar Background */}
                <div className="absolute top-6 left-0 w-full h-1 bg-slate-200 rounded-full overflow-hidden -z-0">
                    {/* Active Progress Bar */}
                    <motion.div
                        className="h-full bg-teal-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
}

