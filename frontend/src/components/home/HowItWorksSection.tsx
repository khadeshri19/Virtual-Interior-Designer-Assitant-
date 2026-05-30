"use client";

import { motion } from "framer-motion";
import {
    Upload,
    Palette,
    Wand2,
    Download,
    ArrowRight
} from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Upload Your Room",
        description: "Take a photo of your empty room or upload an existing image. Natural daylight recommended for best results.",
        icon: Upload,
        color: "from-blue-500 to-cyan-500",
    },
    {
        number: "02",
        title: "Choose Your Style",
        description: "Select from 6+ design styles including Modern, Minimalist, Scandinavian, Industrial, Luxury, and Traditional.",
        icon: Palette,
        color: "from-purple-500 to-pink-500",
    },
    {
        number: "03",
        title: "AI Magic Happens",
        description: "Our AI analyzes your room and generates 3 stunning redesign variations while preserving your layout.",
        icon: Wand2,
        color: "from-orange-500 to-red-500",
    },
    {
        number: "04",
        title: "Download & Implement",
        description: "Get your redesigned images along with furniture recommendations and color palettes to bring your vision to life.",
        icon: Download,
        color: "from-green-500 to-emerald-500",
    },
];

export function HowItWorksSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Transform your space in just a few simple steps. Our AI handles the
                        complex design work so you don&apos;t have to.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="absolute top-[140px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative"
                                >
                                    {/* Arrow connector for desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute top-24 -right-4 hidden lg:block z-10">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <ArrowRight className="w-8 h-8 text-primary/40" />
                                            </motion.div>
                                        </div>
                                    )}

                                    <div className="text-center group p-6 rounded-3xl transition-all duration-500 hover:bg-muted/30">
                                        {/* Step number on background */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                            <span className="text-[140px] font-black leading-none">{step.number}</span>
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-24 h-24 mx-auto rounded-[2rem] bg-gradient-to-br ${step.color} p-[1px] mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <div className="w-full h-full rounded-[2rem] bg-background flex items-center justify-center">
                                                <Icon className="w-10 h-10 text-primary" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">{step.number}</span>
                                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                                            <p className="text-muted-foreground text-[15px] leading-relaxed font-medium">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
