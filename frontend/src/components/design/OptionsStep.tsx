"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Wand2, DollarSign, Ruler, Sparkles, Palette } from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";

interface OptionsStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const budgetRanges = [
    { value: "250", label: "$0 - $250", tier: "Budget" },
    { value: "500", label: "$250 - $500", tier: "Economy" },
    { value: "1000", label: "$500 - $1000", tier: "Mid-range" },
    { value: "2000", label: "$1000 - $2000", tier: "Premium" },
    { value: "5000", label: "$2000+", tier: "Luxury" },
];

export function OptionsStep({ designState, updateDesignState, nextStep, prevStep }: OptionsStepProps) {
    const handleBudgetChange = (value: string) => {
        updateDesignState({ budget: parseInt(value) });
    };

    const handleDimensionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateDesignState({ dimensions: e.target.value });
    };

    const handleGenerate = () => {
        nextStep();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Customize Your <span className="text-gradient">Design</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Fine-tune your redesign with high-end preferences.
                </p>
            </motion.div>

            {/* Summary card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-10"
            >
                <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex items-center">
                            {designState.imagePreview && (
                                <div className="w-32 h-20 overflow-hidden flex-shrink-0">
                                    <img
                                        src={designState.imagePreview}
                                        alt="Your room"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="px-6 py-4">
                                <p className="text-xs uppercase tracking-widest text-primary font-bold">Project Summary</p>
                                <p className="font-bold text-xl">
                                    {designState.style} {designState.roomType}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid gap-6">
                {/* Lighting and Clutter Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="rounded-[1.5rem] border-border/50">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Lighting Preference
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Select
                                value={designState.lighting || 'natural'}
                                onValueChange={(v) => updateDesignState({ lighting: v })}
                            >
                                <SelectTrigger className="rounded-xl border-border/50 h-12 bg-background/50">
                                    <SelectValue placeholder="Select lighting" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="natural">Natural Daylight</SelectItem>
                                    <SelectItem value="warm">Warm & Cozy</SelectItem>
                                    <SelectItem value="cool">Cool & Professional</SelectItem>
                                    <SelectItem value="cinematic">Cinematic Drama</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[1.5rem] border-border/50">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                                <Wand2 className="w-5 h-5 text-primary" />
                                Clutter Level
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Select
                                value={designState.clutter || 'normal'}
                                onValueChange={(v) => updateDesignState({ clutter: v })}
                            >
                                <SelectTrigger className="rounded-xl border-border/50 h-12 bg-background/50">
                                    <SelectValue placeholder="Select clutter" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="minimal">Ultra Minimalist</SelectItem>
                                    <SelectItem value="normal">Lived-in Comfort</SelectItem>
                                    <SelectItem value="cozy">Decorative & Rich</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>

                {/* Color Scheme and Budget */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="rounded-[1.5rem] border-border/50">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                                <Palette className="w-5 h-5 text-primary" />
                                Color Palette
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Select
                                value={designState.colorScheme || 'neutral'}
                                onValueChange={(v) => updateDesignState({ colorScheme: v })}
                            >
                                <SelectTrigger className="rounded-xl border-border/50 h-12 bg-background/50">
                                    <SelectValue placeholder="Select palette" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="neutral">Neutral & Earthy</SelectItem>
                                    <SelectItem value="monochrome">Modern Monochrome</SelectItem>
                                    <SelectItem value="vibrant">Vibrant & Bold</SelectItem>
                                    <SelectItem value="pastel">Soft Pastels</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[1.5rem] border-border/50">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Budget Range
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <Select
                                value={designState.budget?.toString()}
                                onValueChange={handleBudgetChange}
                            >
                                <SelectTrigger className="rounded-xl border-border/50 h-12 bg-background/50">
                                    <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {budgetRanges.map((range) => (
                                        <SelectItem key={range.value} value={range.value}>
                                            {range.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </div>

                {/* Room dimensions */}
                <Card className="rounded-[1.5rem] border-border/50">
                    <CardHeader className="pb-3 px-6 pt-6">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-3">
                            <Ruler className="w-5 h-5 text-primary" />
                            Dimensions (Optional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <Input
                            placeholder="e.g., 20ft x 15ft"
                            value={designState.dimensions || ''}
                            onChange={handleDimensionsChange}
                            className="rounded-xl border-border/50 h-12 bg-background/50 px-4"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-between mt-12 mb-20"
            >
                <Button variant="outline" size="lg" onClick={prevStep} className="gap-2 rounded-2xl px-8 h-12 border-primary/20 hover:bg-primary/5">
                    <ArrowLeft className="w-4 h-4" />
                    Previous Step
                </Button>
                <Button
                    size="lg"
                    className="gap-2 rounded-2xl bg-primary text-white hover:bg-primary/90 px-10 h-12 shadow-xl shadow-primary/20"
                    onClick={handleGenerate}
                >
                    <Wand2 className="w-5 h-5" />
                    Finalize & Render
                </Button>
            </motion.div>
        </div>
    );
}
