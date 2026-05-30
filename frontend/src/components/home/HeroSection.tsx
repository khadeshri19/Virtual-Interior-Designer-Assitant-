"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    Play,
    ArrowRight,
    Upload,
    Wand2,
    CheckCircle2,
    Compass,
    ShieldCheck,
    Zap
} from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#FAFAFB] pt-24">
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-700" />

                {/* Subtle Dot Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(#000 0.5px, transparent 0.5px)`,
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Content Column */}
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-border/40 text-primary mb-8"
                        >
                            <div className="flex -space-x-2 mr-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen AI Visualization</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-[900] leading-[0.9] mb-8 tracking-tighter text-[#1A1A1A]"
                        >
                            Design it.<br />
                            Visualize it.<br />
                            <span className="text-primary italic">Step inside it.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium"
                        >
                            Experience the future of interior design. Our photorealistic AI vision engine transforms your room
                            into stunning 3D concepts. Don't just look at a photo—<strong className="text-foreground">walk through your dream home.</strong>
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-black text-white hover:bg-primary gap-3 h-16 px-10 text-lg font-black uppercase tracking-widest rounded-2xl shadow-2xl transition-all active:scale-95"
                                asChild
                            >
                                <Link href="/design">
                                    <Upload className="w-5 h-5" />
                                    Start Designing
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-border/60 hover:bg-white hover:shadow-xl text-foreground gap-3 h-16 px-10 text-lg rounded-2xl font-bold bg-white/50 backdrop-blur"
                                asChild
                            >
                                <Link href="/gallery">
                                    <Compass className="w-5 h-5 text-primary" />
                                    Explore 360° Gallery
                                </Link>
                            </Button>
                        </motion.div>

                        {/* USP Features Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-16 max-w-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]/60">Photorealistic</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]/60">Instant Render</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]/60">360° Immersion</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Column */}
                    <div className="lg:col-span-5 relative mt-12 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[8px] border-white group">
                                <Image
                                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=100" // High quality production asset
                                    alt="Premium Design Preview"
                                    fill
                                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                                    priority
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Floating Overlay Detail */}
                                <div className="absolute top-8 left-8 flex flex-col gap-2">
                                    <Badge className="bg-white/90 backdrop-blur text-black font-black uppercase tracking-widest text-[9px] px-5 py-2 rounded-full border-0 shadow-2xl">
                                        Rendered in 8K
                                    </Badge>
                                </div>

                                <div className="absolute bottom-10 inset-x-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="glass p-6 rounded-[2rem] border border-white/20">
                                        <p className="text-white text-sm font-black uppercase tracking-widest mb-1">Active Concept</p>
                                        <p className="text-white/80 text-xs font-medium leading-relaxed">Modern Minimalist Suite with directional morning sun and oak texturing.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats / Info Cards */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -left-12 bg-white rounded-[2rem] p-6 shadow-2xl border border-border/20 z-20 hidden xl:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-primary fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-[900] tracking-tighter leading-none">1.2s</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vision Latency</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -right-10 bg-white rounded-[2rem] p-7 shadow-2xl border border-border/20 z-20 hidden xl:block"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center">
                                        <Compass className="w-9 h-9 text-primary animate-spin-slow" />
                                    </div>
                                    <div className="pr-4">
                                        <p className="text-xl font-black uppercase tracking-tighter leading-none">True 360°</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Immersive Engine</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Background Shapes */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60" />
                        <div className="absolute top-40 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl opacity-40" />
                    </div>
                </div>
            </div>
        </section>
    );
}
