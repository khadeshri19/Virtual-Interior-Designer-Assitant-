"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        description: "Perfect for trying out VD Assistant",
        price: "$0",
        period: "forever",
        icon: Sparkles,
        features: [
            "3 room redesigns per month",
            "6 design styles",
            "Standard resolution outputs",
            "Basic color palette suggestions",
            "Community support",
        ],
        cta: "Get Started",
        ctaVariant: "outline" as const,
        popular: false,
    },
    {
        name: "Pro",
        description: "For design enthusiasts and remodelers",
        price: "$19",
        period: "per month",
        icon: Zap,
        features: [
            "Unlimited room redesigns",
            "All 6+ design styles",
            "High resolution 4K outputs",
            "Advanced color palettes",
            "Furniture recommendations",
            "Priority AI processing",
            "Email support",
            "Save & compare designs",
        ],
        cta: "Start Free Trial",
        ctaVariant: "default" as const,
        popular: true,
    },
    {
        name: "Enterprise",
        description: "For interior design professionals",
        price: "$99",
        period: "per month",
        icon: Crown,
        features: [
            "Everything in Pro",
            "Custom brand styles",
            "API access",
            "Team collaboration",
            "White-label exports",
            "3D room previews",
            "Dedicated account manager",
            "Custom integrations",
        ],
        cta: "Contact Sales",
        ctaVariant: "outline" as const,
        popular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen pt-20 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Simple, transparent pricing
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        Choose Your <span className="text-gradient">Plan</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start free and upgrade as you grow. No hidden fees, cancel anytime.
                    </p>
                </motion.div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={plan.popular ? "md:-mt-6 md:mb-6" : ""}
                            >
                                <Card className={`h-full relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${plan.popular
                                    ? "border-primary border-2 shadow-2xl shadow-primary/20 bg-card/60 backdrop-blur-xl"
                                    : "border-border/50 bg-card/40 backdrop-blur-md"
                                    }`}>
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                                            Most Popular
                                        </div>
                                    )}

                                    <CardHeader className="pb-8 pt-10 px-8">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform ${plan.popular
                                            ? "bg-gradient-to-br from-primary to-accent"
                                            : "bg-muted/50 p-[1px]"
                                            }`}>
                                            {!plan.popular && (
                                                <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                                                    <Icon className="w-7 h-7 text-primary" />
                                                </div>
                                            )}
                                            {plan.popular && <Icon className="w-8 h-8 text-white" />}
                                        </div>
                                        <CardTitle className="text-3xl font-black tracking-tight">{plan.name}</CardTitle>
                                        <p className="text-sm font-medium text-muted-foreground mt-2">{plan.description}</p>
                                    </CardHeader>

                                    <CardContent className="px-8 pb-10">
                                        <div className="mb-8">
                                            <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                                            <span className="text-muted-foreground font-bold ml-1">{plan.period === 'forever' ? '' : '/'} {plan.period}</span>
                                        </div>

                                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

                                        <ul className="space-y-4 mb-10">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-muted-foreground/80">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Button
                                            className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${plan.popular
                                                ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/30"
                                                : "hover:bg-primary hover:text-white"
                                                }`}
                                            variant={plan.ctaVariant}
                                            asChild
                                        >
                                            <Link href="/design">
                                                {plan.cta}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FAQ or additional info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Questions? <a href="/contact" className="text-primary hover:underline">Contact our team</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
