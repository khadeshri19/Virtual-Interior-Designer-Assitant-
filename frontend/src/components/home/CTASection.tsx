"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-hero" />

            {/* Animated orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl"
                />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Start Designing for Free</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                        Ready to Transform
                        <br />
                        <span className="text-gradient">Your Space?</span>
                    </h2>

                    <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
                        Join thousands of homeowners who have already reimagined their living spaces
                        with AI-powered design. No design experience needed.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-white hover:bg-white/90 text-gray-900 gap-2 h-14 px-8 text-lg font-semibold shadow-xl"
                            asChild
                        >
                            <Link href="/design">
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white gap-2 h-14 px-8 text-lg"
                            asChild
                        >
                            <Link href="/gallery">
                                Explore Gallery
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
                    >
                        {[
                            { value: "10K+", label: "Designs Created" },
                            { value: "6+", label: "Design Styles" },
                            { value: "100%", label: "Free to Start" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-white/60">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
