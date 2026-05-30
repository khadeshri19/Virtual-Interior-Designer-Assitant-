"use client";
// Refined login page with hydration fix


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
    Eye,
    EyeOff,
    Sparkles,
    Github,
    Chrome
} from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
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
            <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
                <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center mix-blend-overlay opacity-30" />

                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] animate-pulse delay-700" />

                <div className="relative z-10 flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                        <Palette className="w-6 h-6 text-primary" />
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
                            Design your <br />
                            <span className="text-white/60">dream home</span> <br />
                            with AI.
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-6"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white/20 bg-muted/20 backdrop-blur-md overflow-hidden shadow-2xl">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-bold text-white leading-none">10,000+ Designers</p>
                            <p className="text-sm font-medium text-white/60">Already creating magic</p>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                        © 2026 VD Assistant • Premium AI Design Studio
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="text-center lg:text-left flex flex-col gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your design studio.
                        </p>
                        <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary/80 font-medium">
                            ✨ Demo: You can use any email & password to sign in.
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="gap-2 h-11 shadow-sm">
                            <Chrome className="w-4 h-4" />
                            Google
                        </Button>
                        <Button variant="outline" className="gap-2 h-11 shadow-sm">
                            <Github className="w-4 h-4" />
                            GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 h-11 shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10 h-11 shadow-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
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
                            ) : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                            Create Account
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none lg:hidden" />
            <div className="absolute top-1/4 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none lg:hidden" />
        </div>
    );
}
