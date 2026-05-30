"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadStep } from "@/components/design/UploadStep";
import { RoomTypeStep } from "@/components/design/RoomTypeStep";
import { StyleStep } from "@/components/design/StyleStep";
import { OptionsStep } from "@/components/design/OptionsStep";
import { GeneratingStep } from "@/components/design/GeneratingStep";
import { ResultsStep } from "@/components/design/ResultsStep";
import { ChatWidget } from "@/components/design/ChatWidget";
import { Progress } from "@/components/ui/progress";

export type DesignStep = 'upload' | 'roomType' | 'style' | 'options' | 'generating' | 'results';

export interface DesignState {
    designId: string | null;
    uploadedImage: File | null;
    imagePreview: string | null;
    roomType: string | null;
    style: string | null;
    budget: number | null;
    dimensions: string | null;
    lighting: string | null;
    clutter: string | null;
    colorScheme: string | null;
    generatedImages: string[];
    metadata?: Record<string, any>;
}

const stepOrder: DesignStep[] = ['upload', 'roomType', 'style', 'options', 'generating', 'results'];
const stepLabels: Record<DesignStep, string> = {
    upload: 'Upload',
    roomType: 'Room Type',
    style: 'Style',
    options: 'Options',
    generating: 'Generating',
    results: 'Results',
};

export default function DesignPage() {
    const [currentStep, setCurrentStep] = useState<DesignStep>('upload');
    const [designState, setDesignState] = useState<DesignState>({
        designId: null,
        uploadedImage: null,
        imagePreview: null,
        roomType: null,
        style: null,
        budget: null,
        dimensions: null,
        lighting: 'natural',
        clutter: 'normal',
        colorScheme: 'neutral',
        generatedImages: [],
    });

    const currentStepIndex = stepOrder.indexOf(currentStep);
    const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

    const goToStep = (step: DesignStep) => {
        setCurrentStep(step);
    };

    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < stepOrder.length) {
            setCurrentStep(stepOrder[nextIndex]);
        }
    };

    const prevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(stepOrder[prevIndex]);
        }
    };

    const updateDesignState = (updates: Partial<DesignState>) => {
        setDesignState(prev => ({ ...prev, ...updates }));
    };

    const resetDesign = () => {
        setDesignState({
            designId: null,
            uploadedImage: null,
            imagePreview: null,
            roomType: null,
            style: null,
            budget: null,
            dimensions: null,
            lighting: 'natural',
            clutter: 'normal',
            colorScheme: 'neutral',
            generatedImages: [],
        });
        setCurrentStep('upload');
    };

    const renderStep = () => {
        const stepProps = {
            designState,
            updateDesignState,
            nextStep,
            prevStep,
            goToStep,
        };

        switch (currentStep) {
            case 'upload':
                return <UploadStep {...stepProps} />;
            case 'roomType':
                return <RoomTypeStep {...stepProps} />;
            case 'style':
                return <StyleStep {...stepProps} />;
            case 'options':
                return <OptionsStep {...stepProps} />;
            case 'generating':
                return <GeneratingStep {...stepProps} />;
            case 'results':
                return <ResultsStep {...stepProps} resetDesign={resetDesign} />;
            default:
                return <UploadStep {...stepProps} />;
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-b from-background to-muted/20">
            {/* Progress bar */}
            <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Step {currentStepIndex + 1} of {stepOrder.length}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                            {stepLabels[currentStep]}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />

                    {/* Step indicators */}
                    <div className="flex justify-between mt-3">
                        {stepOrder.map((step, index) => (
                            <button
                                key={step}
                                onClick={() => index < currentStepIndex && goToStep(step)}
                                disabled={index >= currentStepIndex || step === 'generating' || step === 'results'}
                                className={`text-xs font-medium transition-colors ${index < currentStepIndex
                                    ? 'text-primary cursor-pointer hover:text-primary/80'
                                    : index === currentStepIndex
                                        ? 'text-foreground'
                                        : 'text-muted-foreground/50'
                                    }`}
                            >
                                {stepLabels[step]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <ChatWidget />
        </div>
    );
}
