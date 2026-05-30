"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Upload,
    Image as ImageIcon,
    X,
    Sun,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import type { DesignState, DesignStep } from "@/app/design/page";

interface UploadStepProps {
    designState: DesignState;
    updateDesignState: (updates: Partial<DesignState>) => void;
    nextStep: () => void;
}

const tips = [
    "Use natural daylight for best results",
    "Capture the entire room in frame",
    "Avoid extreme angles - straight-on works best",
    "Clear clutter for cleaner redesigns",
];

export function UploadStep({ designState, updateDesignState, nextStep }: UploadStepProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            updateDesignState({
                uploadedImage: file,
                imagePreview: preview,
            });
        }
    }, [updateDesignState]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.heif']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const removeImage = () => {
        if (designState.imagePreview) {
            URL.revokeObjectURL(designState.imagePreview);
        }
        updateDesignState({
            uploadedImage: null,
            imagePreview: null,
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Upload Your <span className="text-gradient">Canvas</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Start by uploading a photo of your empty room. Natural daylight recommended.
                </p>
            </motion.div>

            {!designState.imagePreview ? (
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div
                            {...getRootProps()}
                            className={`relative min-h-[400px] flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 ${isDragActive
                                ? 'bg-primary/10 border-2 border-dashed border-primary'
                                : 'bg-muted/30 hover:bg-muted/50'
                                }`}
                        >
                            <input {...getInputProps()} />

                            <motion.div
                                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                                className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 ${isDragActive
                                    ? 'bg-primary/20'
                                    : 'bg-gradient-to-br from-primary/20 to-accent/20'
                                    }`}
                            >
                                <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary' : 'text-foreground'}`} />
                            </motion.div>

                            <h3 className="text-xl font-semibold mb-2">
                                {isDragActive ? 'Drop your image here' : 'Upload your room photo'}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                Drag and drop your room photo here, or click to browse.
                                Supports JPG, PNG, WebP, HEIC up to 10MB.
                            </p>

                            <Button type="button" variant="outline" className="gap-2 pointer-events-none">
                                <ImageIcon className="w-4 h-4" />
                                Browse Files
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden">
                            <img
                                src={designState.imagePreview}
                                alt="Uploaded room"
                                className="w-full h-full object-cover"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-3 right-3"
                                onClick={removeImage}
                            >
                                <X className="w-4 h-4" />
                            </Button>

                            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-white font-medium">Image uploaded</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                onClick={nextStep}
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">Tips for best results</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {tip}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
