"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const styles = [
    {
        name: "Modern",
        description: "Clean lines and contemporary aesthetics",
        colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
        keywords: ["Sleek", "Minimal", "Bold"],
    },
    {
        name: "Minimalist",
        description: "Less is more with refined simplicity",
        colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#212121"],
        keywords: ["Clean", "Simple", "Calm"],
    },
    {
        name: "Scandinavian",
        description: "Nordic warmth with natural elements",
        colors: ["#FFFFFF", "#F5F0E8", "#C9B99A", "#2F4F4F"],
        keywords: ["Cozy", "Natural", "Light"],
    },
    {
        name: "Industrial",
        description: "Raw materials and urban character",
        colors: ["#2C3E50", "#7F8C8D", "#BDC3C7", "#E67E22"],
        keywords: ["Edgy", "Raw", "Urban"],
    },
    {
        name: "Luxury",
        description: "Opulent finishes and rich textures",
        colors: ["#1C1C1C", "#B8860B", "#F5F5DC", "#FFD700"],
        keywords: ["Elegant", "Rich", "Premium"],
    },
    {
        name: "Traditional",
        description: "Timeless elegance with classic charm",
        colors: ["#8B4513", "#DEB887", "#F5F5DC", "#BC8F8F"],
        keywords: ["Classic", "Warm", "Timeless"],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export function StylesSection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Choose Your <span className="text-gradient">Style</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From modern minimalism to luxurious elegance, select the aesthetic
                        that matches your vision.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {styles.map((style) => (
                        <motion.div key={style.name} variants={itemVariants}>
                            <Card className="group cursor-pointer hover-lift border-0 bg-card overflow-hidden h-full">
                                <CardContent className="p-0">
                                    {/* Color preview */}
                                    <div className="h-32 relative overflow-hidden">
                                        <div className="absolute inset-0 flex">
                                            {style.colors.map((color, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-1 transition-transform duration-300 group-hover:scale-105"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-xl font-bold text-white drop-shadow-lg">
                                                {style.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <p className="text-muted-foreground mb-4">{style.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {style.keywords.map((keyword) => (
                                                <Badge
                                                    key={keyword}
                                                    variant="secondary"
                                                    className="bg-muted hover:bg-muted"
                                                >
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Color dots */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                            <span className="text-xs text-muted-foreground">Palette:</span>
                                            {style.colors.map((color, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
