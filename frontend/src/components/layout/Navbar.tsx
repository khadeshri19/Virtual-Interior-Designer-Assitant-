"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Home,
    HelpCircle,
    Image,
    DollarSign,
    Palette,
    Menu,
    X,
    Sparkles
} from "lucide-react";

const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "How it Works", href: "/how-it-works", icon: HelpCircle },
    { label: "Gallery", href: "/gallery", icon: Image },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                        >
                            <Palette className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            AI Interior Designer
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <span className="relative z-10">{item.label}</span>
                                <motion.div
                                    className="absolute inset-0 bg-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    layoutId="navbar-hover"
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <ThemeToggle />
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity gap-2"
                            asChild
                        >
                            <Link href="/design">
                                <Sparkles className="w-4 h-4" />
                                Design New
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    {mounted ? (
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="flex flex-col h-full pt-8">
                                    <div className="flex-1 space-y-4">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-3 pt-6 border-t border-border">
                                        <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-xl mb-2">
                                            <span className="text-sm font-medium">Theme</span>
                                            <ThemeToggle />
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-primary to-accent gap-2"
                                            asChild
                                        >
                                            <Link href="/design">
                                                <Sparkles className="w-4 h-4" />
                                                Design New
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
