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
                            <div key={label} className="flex flex-col items-center relative">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.12 : 1,
                                        backgroundColor: isCompleted
                                            ? "#4CAF50"
                                            : isCurrent
                                                ? "#4A7BF7"
                                                : "#FFFFFF",
                                        borderColor: isCompleted
                                            ? "#4CAF50"
                                            : isCurrent
                                                ? "#4A7BF7"
                                                : "#E8E8E8",
                                        color: isCompleted || isCurrent ? "#FFFFFF" : "#BDBDBD",
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="flex items-center justify-center w-12 h-12 rounded-full border-2 z-10 font-bold text-base"
                                    style={{
                                        boxShadow: isCurrent
                                            ? "0 0 0 4px rgba(74, 123, 247, 0.15)"
                                            : isCompleted
                                                ? "0 0 0 4px rgba(76, 175, 80, 0.12)"
                                                : "none",
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="absolute top-14 text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                                    style={{
                                        color: isCurrent
                                            ? "#4A7BF7"
                                            : isCompleted
                                                ? "#4CAF50"
                                                : "#BDBDBD",
                                    }}
                                >
                                    {label}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Track */}
                <div
                    className="absolute top-6 left-0 w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: "#E8E8E8", zIndex: 0 }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #F5D063, #4CAF50)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
