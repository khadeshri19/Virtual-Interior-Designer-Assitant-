"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Palette,
    ArrowLeft,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Sparkles,
    Github,
    Chrome
} from "lucide-react";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate signup
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/design";
        }, 1500);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative bg-background overflow-hidden">
            {/* Back to Home - Absolute */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-50 flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-all hover:gap-3 lg:text-muted-foreground lg:hover:text-primary"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            {/* Left Side: Branding & Visuals */}
            {/* Left Side: Branding & Visuals */}
            <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary opacity-90" />
                <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center mix-blend-overlay opacity-30" />

                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] animate-pulse delay-700" />

                <div className="relative z-10 flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                        <Palette className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                        VD Assistant
                    </span>
                </div>

                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Your journey <br />
                            <span className="text-white/60">to a perfect home</span> <br />
                            starts here.
                        </h1>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                        Join 10,000+ happy users today.
                    </p>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="text-center lg:text-left flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
                        <p className="text-muted-foreground">
                            Join thousands of users reinventing their spaces.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="name" placeholder="John Doe" className="pl-10 h-11" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-11" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 h-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                </motion.div>
                            ) : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Login
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
