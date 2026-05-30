"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { designApi, type Design } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const resolveImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export function GalleryPreview() {
    const [recentDesigns, setRecentDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data = await designApi.getGallery(6);
                setRecentDesigns(data.filter(d => d.generatedImages && d.generatedImages.length > 0));
            } catch (error) {
                console.error("Failed to fetch recent designs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <Badge className="bg-primary/10 text-primary border-0 mb-4 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[9px]">
                            Curated Community Showcase
                        </Badge>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-[#1A1A1A]">
                            Real Designs by <span className="text-primary italic">Real Visionaries</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium">
                            Join thousands who have already transformed their living spaces.
                            These are production-grade renders generated in seconds.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/gallery"
                            className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-black/10"
                        >
                            Explore Full Vault
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-muted animate-pulse" />
                        ))
                    ) : (
                        recentDesigns.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="group cursor-pointer border-0 bg-transparent overflow-hidden rounded-[2.5rem] shadow-none hover-lift">
                                    <CardContent className="p-0 relative">
                                        <div className="aspect-[4/5] relative overflow-hidden rounded-[2.5rem] shadow-2xl">
                                            <img
                                                src={resolveImageUrl(item.generatedImages[0])}
                                                alt={item.style}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />

                                            {/* Static Badge */}
                                            <div className="absolute top-6 left-6">
                                                <Badge className="bg-white/90 backdrop-blur text-black font-black uppercase tracking-widest text-[8px] py-1 px-4 rounded-full border-0">
                                                    {item.style}
                                                </Badge>
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">{item.roomType}</h3>
                                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">AI Rendered • 8K</p>
                                                    </div>
                                                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                                                        <Compass className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </section>
    );
}
