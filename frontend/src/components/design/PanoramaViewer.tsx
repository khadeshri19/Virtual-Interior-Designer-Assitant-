"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Loader2, Minimize2, RotateCcw, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Import Panolens dynamically to avoid SSR issues
let PANOLENS: any;
if (typeof window !== "undefined") {
    // Panolens expects THREE to be on window for some of its internal logic
    (window as any).THREE = THREE;
    PANOLENS = require("panolens");
}

interface PanoramaViewerProps {
    url: string;
    onClose: () => void;
}

export function PanoramaViewer({ url, onClose }: PanoramaViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted || !containerRef.current || !url || !PANOLENS) {
            console.log("PanoramaViewer: Waiting for mount or PANOLENS", { isMounted, hasContainer: !!containerRef.current, url, status: PANOLENS ? 'Loaded' : 'Missing' });
            return;
        }

        setLoading(true);
        setImageError(false);

        let viewer: any = null;

        const initPanorama = (textureUrl: string, isFallback: boolean = false) => {
            try {
                if (viewer) {
                    viewer.dispose();
                }

                console.log(`PanoramaViewer: Initializing ${isFallback ? 'Fallback' : 'Main'} with:`, textureUrl);

                viewer = new PANOLENS.Viewer({
                    container: containerRef.current,
                    autoRotate: false,
                    autoRotateSpeed: 0.5,
                    controlBar: true,
                    momentum: true,
                    stickyCursor: true,
                    output: 'console'
                });
                viewerRef.current = viewer;

                const panorama = new PANOLENS.ImagePanorama(textureUrl);

                panorama.addEventListener('enter', () => {
                    console.log(`PanoramaViewer: ${isFallback ? 'Fallback' : 'Main'} success`);
                    setLoading(false);
                });

                panorama.addEventListener('progress', (event: any) => {
                    if (event.progress && event.progress.loaded && event.progress.total) {
                        const progress = (event.progress.loaded / event.progress.total) * 100;
                        console.log(`PanoramaViewer Load ${Math.round(progress)}%`);
                    }
                });

                panorama.addEventListener('error', (err: any) => {
                    console.error(`PanoramaViewer Error: ${isFallback ? 'Fallback' : 'Main'} fail`, err);
                    if (!isFallback) {
                        // Extract direct URL if it's currently a proxy URL
                        const directUrl = textureUrl.includes('?url=')
                            ? decodeURIComponent(textureUrl.split('?url=')[1])
                            : textureUrl;

                        // If directUrl is different, try it
                        if (directUrl !== textureUrl) {
                            console.log("PanoramaViewer: Retrying with direct source URL...");
                            initPanorama(directUrl, true);
                        } else {
                            setImageError(true);
                            setLoading(false);
                        }
                    } else {
                        setImageError(true);
                        setLoading(false);
                    }
                });

                // Add interactive markers
                const infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
                infospot.position.set(2000, -500, -2000);
                infospot.addHoverText("Premium Interior Detail");
                panorama.add(infospot);

                viewer.add(panorama);

            } catch (err) {
                console.error("PanoramaViewer internal error:", err);
                setImageError(true);
                setLoading(false);
            }
        };

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        let initialUrl = url;
        if (!url.startsWith('http')) {
            initialUrl = `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
        }

        initPanorama(initialUrl);

        return () => {
            if (viewer) {
                viewer.dispose();
            }
            if (viewerRef.current === viewer) {
                viewerRef.current = null;
            }
        };
    }, [url, isMounted]);

    const handleReset = () => {
        if (viewerRef.current) {
            viewerRef.current.setOrientation(new THREE.Vector3(0, 0, 0));
        }
    };

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pointer-events-auto flex flex-col gap-1"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <RotateCcw className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-2xl leading-none tracking-tight uppercase">
                                Virtual <span className="text-primary">Tour</span>
                            </h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                                Panolens.js Immersive Engine
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex gap-3 pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-xl border border-white/10 px-6"
                        onClick={handleReset}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full gap-2 px-6 shadow-2xl shadow-red-500/20"
                        onClick={onClose}
                    >
                        <Minimize2 className="w-4 h-4" />
                        Close
                    </Button>
                </div>
            </div>

            {/* Main Surface */}
            <div ref={containerRef} className="flex-1 w-full h-full relative" />

            {/* Overlays */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 border-b-4 border-primary rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary/50" />
                            </div>
                        </div>
                        <p className="text-white font-black mt-8 uppercase tracking-[0.3em] text-[10px] animate-pulse">
                            Initializing Virtual Environment...
                        </p>
                    </motion.div>
                )}

                {imageError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 p-6 backdrop-blur-2xl"
                    >
                        <div className="max-w-md text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-2xl shadow-red-500/10">
                                <span className="text-red-500 text-4xl font-black">!</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Load Error</h3>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                The panoramic vision could not be established. Please check your connection or try another design.
                            </p>
                            <Button
                                onClick={onClose}
                                className="w-full bg-primary hover:bg-primary/80 text-white font-black py-6 rounded-2xl tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
                            >
                                Return to Studio
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interaction Toast */}
            {!loading && !imageError && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-3xl pointer-events-none flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary" />
                    <p className="text-white text-xs font-black uppercase tracking-[0.2em]">
                        Immersive Design Active • Drag to Explore
                    </p>
                </div>
            )}
        </div>
    );
}

