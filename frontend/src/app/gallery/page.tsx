"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Heart,
    Eye,
    Search,
    Filter,
    Grid3X3,
    LayoutGrid,
    Loader2,
    Trash2,
    X,
    Download,
    Share2,
    ArrowLeft,
    Compass,
    Sparkles,
    Maximize2
} from "lucide-react";
import { designApi, type Design } from "@/lib/api";
import { PanoramaViewer } from "@/components/design/PanoramaViewer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const styles = ["All", "Modern", "Minimalist", "Scandinavian", "Industrial", "Luxury", "Traditional"];
const roomTypes = ["All", "Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Home Office", "Kids Room"];

// Helper to resolve image URLs (handles relative paths from backend)
const resolveImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return ''; // No placeholder as per USP

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function GalleryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("All");
    const [selectedRoomType, setSelectedRoomType] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "large">("grid");
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
    const [is360Active, setIs360Active] = useState(false);
    const [panoramaUrl, setPanoramaUrl] = useState("");
    const [showOriginal, setShowOriginal] = useState(false);

    const open360 = (url: string) => {
        setPanoramaUrl(url);
        setIs360Active(true);
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                // Fetch high-quality designs only
                const data = await designApi.getGallery(40);
                // Filter out designs without generated images as per USP
                setDesigns(data.filter(d => d.generatedImages && d.generatedImages.length > 0));
            } catch (error) {
                console.error("Failed to fetch gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredItems = designs.filter((item) => {
        const matchesSearch = item.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.style.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStyle = selectedStyle === "All" || item.style === selectedStyle;
        const matchesRoom = selectedRoomType === "All" || item.roomType === selectedRoomType;
        return matchesSearch && matchesStyle && matchesRoom;
    });

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this design?")) return;

        try {
            await designApi.delete(id);
            setDesigns((prev) => prev.filter((d) => d.id !== id));
            if (selectedDesign?.id === id) {
                setSelectedDesign(null);
            }
        } catch (error) {
            console.error("Failed to delete design:", error);
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-[#FCFCFD]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-primary/30 text-primary px-4 py-1 rounded-full bg-primary/5 uppercase tracking-widest text-[10px] font-black">
                        AI Design Showcase
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-[#1A1A1A]">
                        Inspiration <span className="text-primary italic">Vault</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Step into a world of photorealistic AI transformations.
                        Every render represents a unique architectural vision.
                    </p>
                </motion.div>

                {/* Filter Bar - Premium Feel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-2 sm:p-4 bg-white/80 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] shadow-2xl mb-12 flex flex-col md:flex-row gap-4 sticky top-28 z-40"
                >
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        <Input
                            placeholder="Search by style, room, or vibes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-14 h-16 bg-transparent border-0 rounded-[2rem] focus-ring text-lg font-medium placeholder:text-muted-foreground/50 ring-transparent focus:ring-0"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pr-2">
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                            <SelectTrigger className="w-[140px] h-14 bg-muted/30 border-0 rounded-2xl font-bold uppercase tracking-wider text-[11px] shadow-sm">
                                <SelectValue placeholder="Style" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/40 p-2">
                                {styles.map((style) => (
                                    <SelectItem key={style} value={style} className="rounded-xl font-bold uppercase text-[10px] py-3">{style}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                            <SelectTrigger className="w-[160px] h-14 bg-muted/30 border-0 rounded-2xl font-bold uppercase tracking-wider text-[11px] shadow-sm">
                                <SelectValue placeholder="Room Type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/40 p-2">
                                {roomTypes.map((room) => (
                                    <SelectItem key={room} value={room} className="rounded-xl font-bold uppercase text-[10px] py-3">{room}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex bg-muted/40 rounded-2xl overflow-hidden p-1.5 ml-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={`rounded-xl px-4 h-11 ${viewMode === "grid" ? "bg-white text-primary shadow-md" : "text-muted-foreground opacity-60"}`}
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("large")}
                                className={`rounded-xl px-4 h-11 ${viewMode === "large" ? "bg-white text-primary shadow-md" : "text-muted-foreground opacity-60"}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Loading Grid Skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-[2.5rem] bg-muted animate-pulse border border-border/30" />
                        ))}
                    </div>
                )}

                {/* Pure Gallery Grid */}
                {!loading && (
                    <div className={`grid gap-10 ${viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        }`}>
                        {filteredItems.map((item, index) => {
                            const imageUrl = resolveImageUrl(item.generatedImages[0]);
                            if (!imageUrl) return null;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.6 }}
                                    className="group"
                                >
                                    <div
                                        className={`relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:-translate-y-4 cursor-pointer bg-muted ${viewMode === "large" ? "aspect-[16/10]" : "aspect-[3/4]"}`}
                                        onClick={() => {
                                            setSelectedDesign(item);
                                            setShowOriginal(false);
                                        }}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`${item.style} ${item.roomType}`}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Premium Overlay System */}
                                        <div className="absolute inset-x-4 bottom-4 glass-dark rounded-[2rem] p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Concept Render</p>
                                                    <h3 className="text-white font-black text-lg leading-tight uppercase tracking-tight">{item.style} {item.roomType}</h3>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-primary transition-colors">
                                                    <Maximize2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                                <div className="flex gap-2">
                                                    <Badge className="bg-white/10 hover:bg-white/20 text-white/80 text-[8px] font-black uppercase tracking-tighter rounded-full border-0">{item.status}</Badge>
                                                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest self-center">Production Grade</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        className="h-10 w-10 rounded-full bg-primary text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            open360(imageUrl);
                                                        }}
                                                    >
                                                        <Compass className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Badge (Always Visible) */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <Badge className="bg-white shadow-2xl text-black font-black uppercase tracking-widest text-[8px] py-1.5 px-4 rounded-full border-0">
                                                {item.roomType}
                                            </Badge>
                                        </div>

                                        {/* Delete Button (Hidden for non-owners in prod, but available for dev) */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-6 right-6 w-10 h-10 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform"
                                            onClick={(e) => handleDelete(e, item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
                        <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">The vault is quiet</h3>
                        <p className="text-muted-foreground font-medium mb-10">
                            No photorealistic designs match your current filters.
                        </p>
                        <Button className="rounded-2xl h-14 bg-primary text-white px-10 font-bold" onClick={() => { setSelectedStyle("All"); setSelectedRoomType("All"); }}>
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Premium Detail Overlay */}
            <AnimatePresence>
                {selectedDesign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8"
                        onClick={() => setSelectedDesign(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-[#111111] rounded-[3rem] overflow-hidden max-w-6xl w-full h-[85vh] flex flex-col shadow-[0_0_100px_rgba(var(--primary-rgb),0.1)] border border-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                <div className="grid lg:grid-cols-12 h-full">
                                    <div className="lg:col-span-8 relative bg-black group">
                                        <img
                                            src={resolveImageUrl(showOriginal ? selectedDesign.originalImage : selectedDesign.generatedImages[0])}
                                            alt={showOriginal ? "Original Space" : "AI Generated Vision"}
                                            className="w-full h-full object-contain transition-opacity duration-300"
                                        />

                                        {/* View Toggle */}
                                        <div className="absolute top-8 left-8 flex gap-3 z-20">
                                            <Badge
                                                onClick={() => setShowOriginal(false)}
                                                className={`cursor-pointer px-5 py-2.5 text-[10px] font-black tracking-widest uppercase border transition-all ${!showOriginal ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-black/40 border-white/10 text-white/60 backdrop-blur-md hover:bg-black/60'}`}
                                            >
                                                AI Vision
                                            </Badge>
                                            <Badge
                                                onClick={() => setShowOriginal(true)}
                                                className={`cursor-pointer px-5 py-2.5 text-[10px] font-black tracking-widest uppercase border transition-all ${showOriginal ? 'bg-white border-white text-black shadow-lg scale-105' : 'bg-black/40 border-white/10 text-white/60 backdrop-blur-md hover:bg-black/60'}`}
                                            >
                                                Original
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-8 left-8 flex gap-4">
                                            <Button
                                                className="bg-white text-black hover:bg-primary hover:text-white h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-xs flex gap-3 shadow-2xl"
                                                onClick={() => open360(resolveImageUrl(selectedDesign.generatedImages[0]))}
                                            >
                                                <Compass className="w-6 h-6" />
                                                Enter 360 Vision
                                            </Button>
                                            <Button className="bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 h-14 px-8 rounded-2xl border border-white/10 font-black uppercase tracking-widest text-xs flex gap-3">
                                                <Download className="w-6 h-6" />
                                                Source File
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 p-12 flex flex-col justify-between border-l border-white/5">
                                        <div>
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-black uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full">Vision Completed</Badge>
                                                    <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">{selectedDesign.style}<br />{selectedDesign.roomType}</h2>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-white/40 hover:text-white h-14 w-14 rounded-full bg-white/5" onClick={() => setSelectedDesign(null)}>
                                                    <X className="w-8 h-8" />
                                                </Button>
                                            </div>

                                            <div className="space-y-8 mt-12">
                                                <div>
                                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3 text-primary" />
                                                        Design Philosophy
                                                    </p>
                                                    <p className="text-white/60 leading-relaxed font-medium">
                                                        This {selectedDesign.style} transformation of the {selectedDesign.roomType} utilizes high-fidelity
                                                        generation nodes. Original structural constraints were respected while introducing cinematic lighting
                                                        and material depth.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                        <p className="text-white/20 text-[9px] font-black uppercase mb-1">Room Complexity</p>
                                                        <p className="text-white font-bold tracking-tight">Standard</p>
                                                    </div>
                                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                        <p className="text-white/20 text-[9px] font-black uppercase mb-1">Resolution</p>
                                                        <p className="text-white font-bold tracking-tight">8K UHD</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-white/5">
                                            <Button className="w-full h-16 bg-white text-black hover:bg-primary hover:text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-2xl transition-all">
                                                Re-Stage this Room <Wand2 className="ml-3 w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Panoramic 360 Viewer */}
            {is360Active && (
                <PanoramaViewer
                    url={panoramaUrl}
                    onClose={() => setIs360Active(false)}
                />
            )}
        </div>
    );
}

function Wand2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" />
            <path d="m14 7 3 3" />
            <path d="M5 6v4" />
            <path d="M19 14v4" />
            <path d="M10 2v2" />
            <path d="M7 8H3" />
            <path d="M21 16h-4" />
            <path d="M11 4h2" />
        </svg>
    )
}
