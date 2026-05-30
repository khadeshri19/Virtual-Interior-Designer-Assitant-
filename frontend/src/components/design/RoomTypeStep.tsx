"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sofa,
    Bed,
    ChefHat,
    UtensilsCrossed,
    Bath,
    BookOpen,
    ArrowLeft,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";

interface RoomTypeStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const roomTypes = [
    { name: "Living Room", icon: Sofa, color: "from-blue-500 to-purple-500" },
    { name: "Bedroom", icon: Bed, color: "from-indigo-500 to-pink-500" },
    { name: "Kitchen", icon: ChefHat, color: "from-orange-500 to-red-500" },
    { name: "Study Room", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
    { name: "Bathroom", icon: Bath, color: "from-cyan-500 to-blue-500" },
    { name: "Dining Room", icon: UtensilsCrossed, color: "from-amber-500 to-orange-500" },
];

export function RoomTypeStep({ designState, updateDesignState, nextStep, prevStep }: RoomTypeStepProps) {
    const selectRoomType = (roomType: string) => {
        updateDesignState({ roomType });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Define Your <span className="text-gradient">Space</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    What type of room are we redesigning? This helps our AI understand the context.
                </p>
            </motion.div>

            {/* Room preview thumbnail */}
            {designState.imagePreview && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div className="mx-auto w-48 h-32 rounded-xl overflow-hidden border-2 border-border shadow-lg">
                        <img
                            src={designState.imagePreview}
                            alt="Your room"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {roomTypes.map((room, index) => {
                    const Icon = room.icon;
                    const isSelected = designState.roomType === room.name;

                    return (
                        <motion.div
                            key={room.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`group cursor-pointer transition-all duration-500 rounded-[2rem] overflow-hidden border-border/50 ${isSelected
                                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 bg-primary/10'
                                    : 'hover:shadow-xl hover:bg-muted/50'
                                    }`}
                                onClick={() => selectRoomType(room.name)}
                            >
                                <CardContent className="p-8 text-center relative flex flex-col items-center">
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-4 right-4"
                                        >
                                            <div className="bg-primary rounded-full p-1 shadow-lg">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${room.color} p-[1px] mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <div className="w-full h-full rounded-[2rem] bg-background flex items-center justify-center">
                                            <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                    </div>
                                    <h3 className={`font-bold text-sm tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>{room.name}</h3>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between mt-10"
            >
                <Button variant="outline" size="lg" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={nextStep}
                    disabled={!designState.roomType}
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </motion.div>
        </div>
    );
}
