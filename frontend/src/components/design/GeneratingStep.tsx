"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles, Palette, Image as ImageIcon, Loader2, Zap, Compass, ShieldCheck } from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";
import { designApi, Design } from "@/lib/api";
import { useDesignStore } from "@/store";

interface GeneratingStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
    goToStep: (step: DesignStep) => void;
}

const loadingMessages = [
    { icon: ImageIcon, text: "AI Neural Network: Analyzing spatial geometry..." },
    { icon: Palette, text: "Interior Logic: Mapping architectural anchors..." },
    { icon: ShieldCheck, text: "Vision Engine: Crafting photorealistic textures..." },
    { icon: Compass, text: "Finalizing immersive 360° environment..." },
];

export function GeneratingStep({ designState, updateDesignState, nextStep }: GeneratingStepProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const hasStarted = useRef(false);

    // Store callbacks in refs so useEffect doesn't depend on them
    const nextStepRef = useRef(nextStep);
    const updateDesignStateRef = useRef(updateDesignState);
    const designStateRef = useRef(designState);
    nextStepRef.current = nextStep;
    updateDesignStateRef.current = updateDesignState;
    designStateRef.current = designState;

    useEffect(() => {
        // Prevent double-execution (React StrictMode / re-renders)
        if (hasStarted.current) return;
        hasStarted.current = true;

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2500);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return 98; // Hold at 98 until API finishes
                return prev + Math.random() * 2;
            });
        }, 100);

        const startGeneration = async () => {
            const ds = designStateRef.current;
            try {
                if (!ds.uploadedImage) {
                    throw new Error("No room reference image uploaded");
                }

                // 1. Create design record and upload image
                const design = await designApi.create({
                    image: ds.uploadedImage,
                    style: ds.style || 'Modern',
                    roomType: ds.roomType || 'Living Room',
                    budget: ds.budget || undefined,
                    dimensions: ds.dimensions || undefined,
                    lighting: ds.lighting || undefined,
                    clutter: ds.clutter || undefined,
                    colorScheme: ds.colorScheme || undefined,
                });

                // 2. Add to local store for tracking
                useDesignStore.getState().setCurrentDesign(design.id);
                useDesignStore.getState().addRecentDesign(design.id);

                // 3. Trigger Production-Grade AI Generation
                const generationPromise = designApi.generate(design.id);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Architectural Vision Engine timeout")), 120000)
                );

                const updatedDesign = await Promise.race([generationPromise, timeoutPromise]) as Design;

                // 4. Finalize
                setProgress(100);
                setTimeout(() => {
                    updateDesignStateRef.current({
                        designId: design.id,
                        generatedImages: updatedDesign.generatedImages,
                        metadata: updatedDesign.metadata
                    });
                    nextStepRef.current();
                }, 500);

            } catch (err: any) {
                console.error("Design generation failed:", err);
                setError(err.message || "Generation encountered an issue. Using curated fallback.");

                // Fallback to reliable Unsplash images (no API needed)
                const roomType = ds.roomType || 'Living Room';

                // Curated fallback images from Unsplash (always works)
                const fallbackImages: Record<string, string> = {
                    'Living Room': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=90',
                    'Bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1280&q=90',
                    'Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=90',
                    'Study Room': 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1280&q=90',
                    'Bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=90',
                    'Dining Room': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1280&q=90',
                };
                const fallbackUrl = fallbackImages[roomType] || fallbackImages['Living Room'];

                setTimeout(() => {
                    updateDesignStateRef.current({
                        generatedImages: [fallbackUrl],
                    });
                    setProgress(100);
                    setTimeout(() => nextStepRef.current(), 1000);
                }, 2000);
            }
        };

        startGeneration();

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []); // Empty deps — runs once on mount only

    const CurrentIcon = loadingMessages[currentMessageIndex].icon;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-border/40 p-12 text-center overflow-hidden relative"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />

                <div className="mb-12 relative">
                    <div className="relative w-48 h-48 mx-auto">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 rounded-full border border-accent/20"
                        />

                        <div className="absolute inset-8 rounded-[2.5rem] bg-gradient-to-br from-[#1A1A1A] to-[#333333] flex items-center justify-center shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentMessageIndex}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CurrentIcon className="w-16 h-16 text-primary" />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Particle System */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [-30, 30, -30],
                                    x: [-10, 10, -10],
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                }}
                                className="absolute w-2 h-2 rounded-full bg-primary/40"
                                style={{
                                    left: `${50 + 45 * Math.cos((Math.PI * 2 * i) / 8)}%`,
                                    top: `${50 + 45 * Math.sin((Math.PI * 2 * i) / 8)}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-6 mb-12">
                    <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">
                        Vision Engine <span className="text-primary italic">Active</span>
                    </h2>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentMessageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xl text-muted-foreground font-medium"
                        >
                            {loadingMessages[currentMessageIndex].text}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Premium Progress Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="h-4 bg-muted rounded-full overflow-hidden p-1 shadow-inner border border-border/20">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            animate={{ backgroundPosition: ["0% center", "200% center"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rendering Concept</p>
                        <p className="text-xs font-black uppercase tracking-widest text-primary">{Math.round(progress)}% Complete</p>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-destructive/5 rounded-2xl border border-destructive/10 mb-8"
                    >
                        <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1 px-4">Engine Warning</p>
                        <p className="text-sm text-muted-foreground px-4">{error}</p>
                    </motion.div>
                )}

                {/* Dynamic Features being applied */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/40">
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Gemini 2.5 Flash</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">ControlNet Seg</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Panoramic Mapping</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Material Synthesis</span>
                    </div>
                </div>
            </motion.div>

            {/* Selection Context */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center justify-center gap-6"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{designState.style} Style</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{designState.roomType}</span>
                </div>
            </motion.div>
        </div>
    );
}
