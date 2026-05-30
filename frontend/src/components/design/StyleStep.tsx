"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";

interface StyleStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const styles = [
    {
        name: "Modern",
        description: "Clean lines, bold accents",
        colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
        keywords: ["Sleek", "Contemporary"],
    },
    {
        name: "Minimalist",
        description: "Less is more, refined simplicity",
        colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#212121"],
        keywords: ["Clean", "Simple"],
    },
    {
        name: "Scandinavian",
        description: "Nordic warmth, natural elements",
        colors: ["#FFFFFF", "#F5F0E8", "#C9B99A", "#2F4F4F"],
        keywords: ["Cozy", "Natural"],
    },
    {
        name: "Industrial",
        description: "Raw materials, urban character",
        colors: ["#2C3E50", "#7F8C8D", "#BDC3C7", "#E67E22"],
        keywords: ["Edgy", "Urban"],
    },
    {
        name: "Luxury",
        description: "Opulent finishes, rich textures",
        colors: ["#1C1C1C", "#B8860B", "#F5F5DC", "#FFD700"],
        keywords: ["Elegant", "Premium"],
    },
    {
        name: "Traditional",
        description: "Timeless elegance, classic charm",
        colors: ["#8B4513", "#DEB887", "#F5F5DC", "#BC8F8F"],
        keywords: ["Classic", "Warm"],
    },
];

export function StyleStep({ designState, updateDesignState, nextStep, prevStep }: StyleStepProps) {
    const selectStyle = (style: string) => {
        updateDesignState({ style });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Choose Your <span className="text-gradient">Style</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Select the aesthetic that matches your vision for the{' '}
                    <span className="font-medium text-foreground">{designState.roomType}</span>.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {styles.map((style, index) => {
                    const isSelected = designState.style === style.name;

                    return (
                        <motion.div
                            key={style.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.08 }}
                        >
                            <Card
                                className={`group cursor-pointer transition-all duration-500 overflow-hidden h-full rounded-[2rem] border-border/50 ${isSelected
                                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 bg-primary/5'
                                    : 'hover:shadow-xl hover:bg-muted/50'
                                    }`}
                                onClick={() => selectStyle(style.name)}
                            >
                                <CardContent className="p-0">
                                    {/* Color preview */}
                                    <div className="h-32 relative overflow-hidden">
                                        <div className="absolute inset-0 flex">
                                            {style.colors.map((color, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-1 transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: color, transitionDelay: `${idx * 50}ms` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center"
                                            >
                                                <div className="bg-white rounded-full p-2 shadow-2xl">
                                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className={`text-xl font-bold mb-2 tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>{style.name}</h3>
                                        <p className="text-sm font-medium text-muted-foreground mb-4 line-clamp-2">{style.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {style.keywords.map((keyword) => (
                                                <Badge
                                                    key={keyword}
                                                    variant="secondary"
                                                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-background/50 backdrop-blur-sm"
                                                >
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between mt-10"
            >
                <Button variant="outline" size="lg" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={nextStep}
                    disabled={!designState.style}
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </motion.div>
        </div>
    );
}
