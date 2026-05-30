"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sofa,
    Bed,
    ChefHat,
    UtensilsCrossed,
    Bath,
    Laptop,
    Baby,
    TreePalm
} from "lucide-react";

const roomTypes = [
    {
        name: "Living Room",
        icon: Sofa,
        gradient: "from-blue-500/20 to-purple-500/20",
        description: "Cozy gathering spaces"
    },
    {
        name: "Bedroom",
        icon: Bed,
        gradient: "from-indigo-500/20 to-pink-500/20",
        description: "Peaceful retreats"
    },
    {
        name: "Kitchen",
        icon: ChefHat,
        gradient: "from-orange-500/20 to-red-500/20",
        description: "Culinary havens"
    },
    {
        name: "Dining Room",
        icon: UtensilsCrossed,
        gradient: "from-amber-500/20 to-orange-500/20",
        description: "Elegant dining spaces"
    },
    {
        name: "Bathroom",
        icon: Bath,
        gradient: "from-cyan-500/20 to-blue-500/20",
        description: "Spa-like sanctuaries"
    },
    {
        name: "Home Office",
        icon: Laptop,
        gradient: "from-emerald-500/20 to-teal-500/20",
        description: "Productive workspaces"
    },
    {
        name: "Kids Room",
        icon: Baby,
        gradient: "from-pink-500/20 to-rose-500/20",
        description: "Playful environments"
    },
    {
        name: "Outdoor Patio",
        icon: TreePalm,
        gradient: "from-green-500/20 to-lime-500/20",
        description: "Outdoor relaxation"
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function RoomTypesSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Design Any <span className="text-gradient">Room Type</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From living rooms to outdoor patios, our AI adapts to redesign any space
                        in your home with professional-quality results.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                >
                    {roomTypes.map((room) => {
                        const Icon = room.icon;
                        return (
                            <motion.div key={room.name} variants={itemVariants}>
                                <Card className="group cursor-pointer hover-lift border border-border/50 bg-card/40 backdrop-blur-md hover:bg-card/80 transition-all duration-500 overflow-hidden relative">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${room.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <CardContent className="p-8 text-center relative z-10">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${room.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-foreground mb-2 text-lg tracking-tight">{room.name}</h3>
                                        <p className="text-sm text-muted-foreground font-medium">{room.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
