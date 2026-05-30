"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Upload,
    Palette,
    Wand2,
    Download,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Upload Your Room Photo",
        description: "Take a photo of your empty room or upload an existing image. For best results, use natural daylight and capture the entire room in frame. We support JPG, PNG, WebP, and HEIC formats up to 10MB.",
        icon: Upload,
        color: "from-blue-500 to-cyan-500",
        tips: [
            "Use natural daylight for best results",
            "Capture the entire room in frame",
            "Avoid extreme angles",
            "Clear clutter for cleaner redesigns",
        ],
    },
    {
        number: "02",
        title: "Select Room Type & Style",
        description: "Choose the type of room you're redesigning and select from our collection of design styles. Each style has been carefully curated to provide authentic, cohesive aesthetics.",
        icon: Palette,
        color: "from-purple-500 to-pink-500",
        tips: [
            "8 room types available",
            "6+ design styles to choose from",
            "Set optional budget constraints",
            "Add room dimensions for better scaling",
        ],
    },
    {
        number: "03",
        title: "AI Generates Your Designs",
        description: "Our advanced AI analyzes your room's layout, lighting, and architecture, then generates 3 unique redesign variations in your chosen style while preserving the original structure.",
        icon: Wand2,
        color: "from-orange-500 to-red-500",
        tips: [
            "Powered by Stable Diffusion",
            "Preserves original architecture",
            "3 unique variations per request",
            "Processing takes about 30-60 seconds",
        ],
    },
    {
        number: "04",
        title: "Download & Implement",
        description: "Review your generated designs, download your favorites in high resolution, and get AI-powered furniture recommendations with links to purchase items that match your new design.",
        icon: Download,
        color: "from-green-500 to-emerald-500",
        tips: [
            "High-resolution downloads",
            "Color palette extraction",
            "Furniture recommendations",
            "Chat with AI for more suggestions",
        ],
    },
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen pt-20 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        How <span className="text-gradient">VD Assistant</span> Works
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Transform your space in just a few simple steps. Our AI handles the
                        complex design work so you don&apos;t have to.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Card className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                            {/* Visual side */}
                                            <div className={`lg:w-2/5 p-8 flex items-center justify-center bg-gradient-to-br ${step.color}`}>
                                                <div className="text-center">
                                                    <div className="text-6xl font-bold text-white/20 mb-4">
                                                        {step.number}
                                                    </div>
                                                    <div className="w-24 h-24 mx-auto rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                        <Icon className="w-12 h-12 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content side */}
                                            <div className="lg:w-3/5 p-8">
                                                <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                                                <p className="text-muted-foreground mb-6">{step.description}</p>

                                                <div className="space-y-2">
                                                    {step.tips.map((tip, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span>{tip}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                        <CardContent className="py-12">
                            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h3>
                            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                                Join thousands of homeowners who have already reimagined their living spaces with AI-powered design.
                            </p>
                            <Button
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-primary to-accent"
                                asChild
                            >
                                <Link href="/design">
                                    Start Designing Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
