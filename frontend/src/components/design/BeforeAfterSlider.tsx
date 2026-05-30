"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Eye } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = "Before",
    afterLabel = "After",
    className = "",
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
        },
        []
    );

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            handleMove(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging) return;
            handleMove(e.touches[0].clientX);
        };

        const handleEnd = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleEnd);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging, handleMove]);

    return (
        <div
            ref={containerRef}
            className={`relative select-none overflow-hidden rounded-[2rem] cursor-col-resize group ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* After Image (full width, behind) */}
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
                <img
                    src={afterImage}
                    alt="After — AI Redesigned"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />

                {/* Before Image (clipped) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src={beforeImage}
                        alt="Before — Original Room"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 z-20"
                    style={{ left: `${sliderPosition}%` }}
                >
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 -ml-[1px] w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]" />

                    {/* Handle */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`
                            w-14 h-14 rounded-full 
                            bg-white shadow-[0_4px_30px_rgba(0,0,0,0.3)] 
                            flex items-center justify-center
                            border-2 border-white/80
                            transition-shadow duration-300
                            ${isDragging ? 'shadow-[0_4px_40px_rgba(0,0,0,0.5)]' : ''}
                        `}>
                            <ArrowLeftRight className="w-6 h-6 text-gray-700" />
                        </div>
                    </motion.div>
                </div>

                {/* Labels */}
                <div className="absolute top-5 left-5 z-10">
                    <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                        {beforeLabel}
                    </div>
                </div>
                <div className="absolute top-5 right-5 z-10">
                    <div className="bg-primary/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full flex items-center gap-1.5">
                        <Eye className="w-3 h-3" />
                        {afterLabel}
                    </div>
                </div>

                {/* Instruction tooltip (disappears on interaction) */}
                <motion.div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isDragging ? 0 : 1 }}
                >
                    <div className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
                        <ArrowLeftRight className="w-4 h-4" />
                        Drag to compare
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
