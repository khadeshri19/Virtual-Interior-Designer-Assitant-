"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Share2,
    RefreshCw,
    Heart,
    MessageCircle,
    Check,
    Palette,
    ShoppingBag,
    Compass,
    ArrowRight,
    Star,
    Info,
    Loader2,
    AlertCircle,
    Sparkles,
    SplitSquareVertical,
    Maximize2,
    LayoutGrid,
    MapPin
} from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";
import { PanoramaViewer } from "./PanoramaViewer";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { useUIStore } from "@/store";
import { designApi } from "@/lib/api";

interface ResultsStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: DesignStep) => void;
    resetDesign: () => void;
}

// Fixed resolve function to be more bulletproof
const getApiUrl = () => {
    // Priority: Env var > current hostname:3001 > localhost:3001
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return `http://${hostname}:3001`;
    }
    return 'http://localhost:3001';
};

const resolveImageUrl = (imagePath: string | undefined, forceProxy: boolean = false): string => {
    if (!imagePath) return '';
    const API_URL = getApiUrl();

    // If it's already an absolute URL (like Pollinations)
    if (imagePath.startsWith('http')) {
        // Only use proxy if explicitly requested (e.g. for 360 texture CORS)
        if (forceProxy) {
            return `${API_URL}/api/proxy?url=${encodeURIComponent(imagePath)}`;
        }
        return imagePath;
    }

    // If it's a relative path from our backend
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
};

const getColorPalette = (style: string): string[] => {
    const basePalettes: Record<string, string[]> = {
        Modern: ["#F5E6D3", "#D2B48C", "#8B5E3C", "#C19A6B", "#FFFFFF"],
        Minimalist: ["#FFFFFF", "#FAF9F6", "#E8E4D9", "#D2CFC1", "#8B8276"],
        Scandinavian: ["#FCF9F2", "#E5D3B3", "#A68966", "#D9C5B2", "#FFFFFF"],
        Industrial: ["#D7C4A3", "#8B7D6B", "#5C5449", "#A69B8A", "#EDE6D9"],
        Luxury: ["#FDFBF7", "#C5A059", "#8B6F3C", "#A67B5B", "#FFFAF0"],
        Traditional: ["#F9F4EE", "#DBC1AC", "#967E67", "#705C53", "#FFFFFF"],
    };
    return basePalettes[style] || basePalettes.Modern;
};

export function ResultsStep({ designState, resetDesign }: ResultsStepProps) {
    const [selectedVarIndex, setSelectedVarIndex] = useState(0);
    const [likedImages, setLikedImages] = useState<number[]>([]);
    const [is360Active, setIs360Active] = useState(false);
    const [activePanoramaUrl, setActivePanoramaUrl] = useState("");
    const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
    const [imageErrorStates, setImageErrorStates] = useState<Record<number, boolean>>({});
    const [viewMode, setViewMode] = useState<'comparison' | 'fullview'>('comparison');
    const [floorPlan, setFloorPlan] = useState<{ floorPlan: string; dimensions: string; furniturePlacement: string[] } | null>(null);
    const [floorPlanLoading, setFloorPlanLoading] = useState(false);
    const [showFloorPlan, setShowFloorPlan] = useState(false);
    const { toggleChat } = useUIStore();

    const colorPalette = getColorPalette(designState.style || 'Modern');

    const handleGetFloorPlan = async () => {
        if (floorPlan) {
            setShowFloorPlan(!showFloorPlan);
            return;
        }
        if (!designState.designId) return;
        setFloorPlanLoading(true);
        try {
            const result = await designApi.getFloorPlan(designState.designId);
            setFloorPlan(result);
            setShowFloorPlan(true);
        } catch (err) {
            console.error('Floor plan generation failed:', err);
        } finally {
            setFloorPlanLoading(false);
        }
    };

    useEffect(() => {
        // Log state for debugging invisible images
        console.log("ResultsStep: Design State:", designState);
        console.log("ResultsStep: API URL:", getApiUrl());
    }, [designState]);

    const toggleLike = (index: number) => {
        setLikedImages((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const open360 = (url: string) => {
        const proxiedUrl = resolveImageUrl(url, true);
        setActivePanoramaUrl(proxiedUrl);
        setIs360Active(true);
    };

    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank"; // Fallback for download
        link.download = `VD-Assistant-${designState.style}-${designState.roomType}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (designState.generatedImages.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-24">
                <div className="mb-8 animate-bounce">
                    <RefreshCw className="h-16 w-16 text-primary mx-auto opacity-20" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Processing Your Vision</h2>
                <p className="text-muted-foreground mb-8">Refining architectural details and cinematic lighting...</p>
                <Button onClick={resetDesign} variant="outline" className="rounded-full px-8">Back to Concept</Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex justify-center mb-6">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        AI Vision Render Complete
                    </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                    Your {designState.roomType} in <span className="text-primary">{designState.style}</span> Style
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your AI-generated design concept. Experience it in an immersive 360° view or download for your project.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Primary Render View */}
                <div className="lg:col-span-8">
                    {/* View Mode Toggle */}
                    <div className="flex items-center justify-end gap-2 mb-4">
                        <Button
                            variant={viewMode === 'comparison' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-2 rounded-xl text-xs font-bold"
                            onClick={() => setViewMode('comparison')}
                        >
                            <SplitSquareVertical className="w-3.5 h-3.5" />
                            Before / After
                        </Button>
                        <Button
                            variant={viewMode === 'fullview' ? 'default' : 'outline'}
                            size="sm"
                            className="gap-2 rounded-xl text-xs font-bold"
                            onClick={() => setViewMode('fullview')}
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                            Full View
                        </Button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Before/After Comparison View */}
                        {viewMode === 'comparison' && designState.imagePreview ? (
                            <Card className="overflow-hidden rounded-[3rem] border-2 border-primary/20 ring-4 ring-primary/5 shadow-2xl">
                                <CardContent className="p-0">
                                    <BeforeAfterSlider
                                        beforeImage={designState.imagePreview}
                                        afterImage={resolveImageUrl(designState.generatedImages[0])}
                                        beforeLabel="Original Room"
                                        afterLabel="AI Redesigned"
                                        className="rounded-[3rem]"
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            /* Full View (original behavior) */
                            <Card className="group overflow-hidden rounded-[3rem] border-2 border-primary/20 ring-4 ring-primary/5 shadow-2xl relative">
                                <CardContent className="p-0 relative aspect-[4/3] md:aspect-[16/10] bg-muted/50">
                                    {imageLoadingStates[0] !== false && !imageErrorStates[0] && (
                                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-muted/20">
                                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                        </div>
                                    )}

                                    <img
                                        src={resolveImageUrl(designState.generatedImages[0])}
                                        alt="Your AI Design"
                                        className={`w-full h-full object-cover transition-all duration-700 ${imageLoadingStates[0] === false ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImageLoadingStates(prev => ({ ...prev, [0]: false }))}
                                    />

                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                        <div className="flex gap-4">
                                            <Button size="lg" className="rounded-2xl bg-white text-primary hover:bg-primary hover:text-white" onClick={() => open360(designState.generatedImages[0])}>
                                                <Compass className="mr-2 h-5 w-5" /> Immersive 360°
                                            </Button>
                                            <Button size="lg" className="rounded-2xl bg-white text-primary hover:bg-primary hover:text-white" onClick={() => handleDownload(resolveImageUrl(designState.generatedImages[0]))}>
                                                <Download className="mr-2 h-5 w-5" /> Download HD
                                            </Button>
                                        </div>
                                        <Button size="icon" className={`h-14 w-14 rounded-2xl ${likedImages.includes(0) ? 'bg-pink-500 text-white' : 'bg-white/20 backdrop-blur-md text-white'}`} onClick={() => toggleLike(0)}>
                                            <Heart className={`h-6 w-6 ${likedImages.includes(0) ? 'fill-current' : ''}`} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="rounded-[2.5rem] border-border/50 bg-white/50 backdrop-blur shadow-xl border-2 p-8">
                        <div className="mb-8">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Architectural Summary</p>
                            <h4 className="font-black text-3xl leading-tight">Master Design Concept</h4>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                                <Palette className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Style Archetype</p>
                                    <p className="font-bold">{designState.style}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                                <Compass className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Room Context</p>
                                    <p className="font-bold">{designState.roomType}</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-bold group shadow-xl shadow-black/10" onClick={() => handleDownload(resolveImageUrl(designState.generatedImages[0]))}>
                            Get Design Package <Download className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                        </Button>
                    </Card>

                    {/* Quick CTA */}
                    <Card className="rounded-[2rem] bg-primary text-white p-8 shadow-2xl shadow-primary/30 border-0 overflow-hidden relative group">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Consult Architect
                        </h4>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed">Ready to build this? Chat with our virtual architectural consultant for material specs.</p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold h-12 shadow-inner" onClick={toggleChat}>
                            Start Consultation
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Design Story Panel - Full Width */}
            <div className="mt-10 mb-10">
                <Card className="rounded-[2.5rem] border-primary/10 bg-primary/5 shadow-inner overflow-hidden border-2">
                    <CardContent className="p-12">
                        <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                            <Info className="h-8 w-8 text-primary" />
                            Design Story: The {designState.style} Concept
                        </h3>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                {designState.metadata?.aiStory ? (
                                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {designState.metadata.aiStory}
                                    </div>
                                ) : (
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        This concept for your <strong>{designState.roomType}</strong> merges high-end <strong>{designState.style}</strong> principles with functional luxury.
                                        By prioritizing <strong>{designState.lighting || 'natural'}</strong> lighting and a <strong>{designState.clutter || 'minimal'}</strong> aesthetic, we've created a space that feels both expansive and intimate.
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="secondary" className="bg-white/50 text-sm px-4 py-2">{designState.lighting || 'Natural'} Lighting</Badge>
                                    <Badge variant="secondary" className="bg-white/50 text-sm px-4 py-2">{designState.clutter || 'Minimal'} Decor</Badge>
                                    <Badge variant="secondary" className="bg-white/50 text-sm px-4 py-2">{designState.colorScheme || 'Neutral'} Palette</Badge>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 group">
                                    <div className="h-16 w-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary font-bold text-xl transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">01</div>
                                    <div>
                                        <p className="font-bold text-lg">Spatial Optimization</p>
                                        <p className="text-sm text-muted-foreground">Furniture scaled to {designState.dimensions || 'standard proportions'} for maximum flow.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="h-16 w-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary font-bold text-xl transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white">02</div>
                                    <div>
                                        <p className="font-bold text-lg">Atmospheric Depth</p>
                                        <p className="text-sm text-muted-foreground">Shadow mapping optimized for {designState.lighting || 'morning'} sun angles.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ADVANCEMENT: Shop the Look & AI Insights */}
            {designState.metadata?.roomAnalysis && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 mb-20"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-3xl font-black flex items-center gap-4">
                            <ShoppingBag className="h-8 w-8 text-primary" />
                            Shop the Look
                        </h3>
                        <Badge className="bg-green-500/10 text-green-600 border-green-200">AI Sourced</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {designState.metadata.roomAnalysis.detectedFurniture?.map((item: string, idx: number) => (
                            <Card key={idx} className="rounded-[2rem] border-border/50 bg-white shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                                <CardContent className="p-6 text-center">
                                    <div className="h-20 w-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                                        <ShoppingBag className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="font-black text-sm mb-1 line-clamp-1">{item}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-4">{designState.style} Essential</p>
                                    
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="w-full rounded-xl text-[10px] font-black uppercase tracking-tighter h-8 group-hover:bg-primary group-hover:text-white transition-colors"
                                        onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(designState.style + ' ' + item)}`, '_blank')}
                                    >
                                        Find Match <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Architectural Insights */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <Card className="rounded-[2rem] border-dashed border-2 border-primary/20 bg-primary/5 p-8">
                            <h5 className="font-black text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                <Check className="h-3 w-3" />
                                Architectural Features
                            </h5>
                            <ul className="space-y-2">
                                {designState.metadata.roomAnalysis.architecturalFeatures?.map((feature: string, i: number) => (
                                    <li key={i} className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        
                        <Card className="rounded-[2rem] border-dashed border-2 border-orange-200 bg-orange-50/30 p-8">
                            <h5 className="font-black text-xs uppercase tracking-widest text-orange-600 mb-4 flex items-center gap-2">
                                <AlertCircle className="h-3 w-3" />
                                Design Challenges
                            </h5>
                            <ul className="space-y-2">
                                {designState.metadata.roomAnalysis.challenges?.map((challenge: string, i: number) => (
                                    <li key={i} className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                        {challenge}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="rounded-[2rem] border-dashed border-2 border-blue-200 bg-blue-50/30 p-8">
                            <h5 className="font-black text-xs uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                Expert Recommendation
                            </h5>
                            <p className="text-sm font-bold text-muted-foreground italic leading-relaxed">
                                "{designState.metadata.roomAnalysis.suggestion}"
                            </p>
                        </Card>
                    </div>
                </motion.div>
            )}

            {/* Floor Plan Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 mb-10"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black flex items-center gap-4">
                        <LayoutGrid className="h-8 w-8 text-primary" />
                        Floor Plan
                    </h3>
                    <Button
                        onClick={handleGetFloorPlan}
                        disabled={floorPlanLoading}
                        className="gap-2 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                    >
                        {floorPlanLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : showFloorPlan ? (
                            'Hide Floor Plan'
                        ) : (
                            <>
                                <LayoutGrid className="h-4 w-4" />
                                View Floor Plan
                            </>
                        )}
                    </Button>
                </div>

                <AnimatePresence>
                    {showFloorPlan && floorPlan && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* ASCII Floor Plan */}
                                <Card className="rounded-[2rem] border-2 border-primary/20 bg-[#1a1a2e] p-8 shadow-xl overflow-hidden">
                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                        <LayoutGrid className="h-3 w-3" />
                                        Room Layout
                                    </h5>
                                    <p className="text-xs text-white/50 mb-4">Estimated dimensions: <span className="text-primary font-bold">{floorPlan.dimensions}</span></p>
                                    <pre className="text-green-400 font-mono text-sm leading-relaxed whitespace-pre overflow-x-auto p-4 bg-black/30 rounded-xl border border-green-500/20">
                                        {floorPlan.floorPlan}
                                    </pre>
                                    <div className="flex gap-4 mt-4 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                        <span>W = Window</span>
                                        <span>D = Door</span>
                                        <span>[ ] = Furniture</span>
                                    </div>
                                </Card>

                                {/* Furniture Placement List */}
                                <Card className="rounded-[2rem] border-2 border-primary/10 bg-white p-8 shadow-xl">
                                    <h5 className="font-black text-xs uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        Furniture Placement Guide
                                    </h5>
                                    <div className="space-y-4">
                                        {floorPlan.furniturePlacement.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-black text-primary">{idx + 1}</span>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground leading-relaxed">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Actions */}
            <div className="mt-20 border-t border-border/50 pt-10 text-center">
                <Button variant="ghost" className="rounded-full px-12 h-16 text-lg font-bold hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary" onClick={resetDesign}>
                    <RefreshCw className="mr-3 h-5 w-5" />
                    Discard & Start New Project
                </Button>
            </div>

            {/* 360 Viewer Modal */}
            {is360Active && (
                <PanoramaViewer
                    url={activePanoramaUrl}
                    onClose={() => setIs360Active(false)}
                />
            )}
        </div>
    );
}
