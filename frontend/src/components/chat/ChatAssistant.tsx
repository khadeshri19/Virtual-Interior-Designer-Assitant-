"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MessageCircle,
    X,
    Send,
    Sparkles,
    User,
    Loader2
} from "lucide-react";
import { chatApi } from "@/lib/api";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const suggestedQuestions = [
    "What colors work best for a modern living room?",
    "How can I make a small room feel larger?",
    "What furniture should I buy first?",
    "Best lighting tips for a bedroom?",
];

import { useUIStore } from "@/store";

export function ChatAssistant() {
    const [mounted, setMounted] = useState(false);
    const { isChatOpen, toggleChat } = useUIStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hi! I'm your VD Assistant. I can help you with interior design questions, color palette suggestions, furniture recommendations, and more. How can I help you today?",
                timestamp: new Date(),
            },
        ]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const messageText = input;
        setInput("");
        setIsLoading(true);

        try {
            const response = await chatApi.sendMessage(messageText);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message.content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat API error:", error);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting to the design server. Try asking about color palettes, furniture, or lighting!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (question: string) => {
        setInput(question);
    };

    if (!mounted) return null;

    return (
        <>
            {/* Chat toggle button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                onClick={toggleChat}
            >
                {isChatOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">VD Assistant</h3>
                                    <p className="text-xs text-muted-foreground">AI-powered design help</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea ref={scrollRef} className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <Avatar className="w-8 h-8 flex-shrink-0">
                                            <AvatarFallback
                                                className={
                                                    message.role === "assistant"
                                                        ? "bg-gradient-to-br from-primary to-accent text-white"
                                                        : "bg-muted"
                                                }
                                            >
                                                {message.role === "assistant" ? (
                                                    <Sparkles className="w-4 h-4" />
                                                ) : (
                                                    <User className="w-4 h-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted rounded-tl-sm"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                                                <Sparkles className="w-4 h-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Suggestions */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                                <div className="flex flex-wrap gap-1">
                                    {suggestedQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(q)}
                                            className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors truncate max-w-full"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-border">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about interior design..."
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="bg-gradient-to-r from-primary to-accent"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
