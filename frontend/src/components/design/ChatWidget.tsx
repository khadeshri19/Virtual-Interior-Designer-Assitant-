"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Sparkles, SendHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store";
import { chatApi } from "@/lib/api";

export function ChatWidget() {
    const { isChatOpen, toggleChat } = useUIStore();
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
        { role: 'assistant', content: "Hello! I'm your Virtual Design Assistant. How can I help you refine your space today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            // Call actual backend API
            const response = await chatApi.sendMessage(userMessage);
            setMessages([...newMessages, {
                role: 'assistant' as const,
                content: response.message.content,
            }]);
        } catch (error) {
            console.error("Chat API error:", error);
            // Fallback to local response if backend is down
            setMessages([...newMessages, {
                role: 'assistant' as const,
                content: "I'm having trouble connecting right now. Try asking about color palettes, furniture arrangement, or lighting for your room!",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
            {/* Chat Bubble Button */}
            <div className="flex justify-end pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleChat}
                    className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300 ${isChatOpen ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}
                >
                    {isChatOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
                </motion.button>
            </div>

            {/* Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-primary/10 overflow-hidden flex flex-col pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-primary p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-lg">Design AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Active Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="text-white/40 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 bg-primary/5 scrollbar-thin scrollbar-thumb-primary/20"
                        >
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${m.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-primary/5'
                                        }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white text-gray-800 rounded-3xl rounded-tl-none border border-primary/5 p-4 shadow-sm">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white border-t border-primary/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your design tweak..."
                                    disabled={isLoading}
                                    className="w-full h-14 pl-6 pr-14 rounded-2xl bg-primary/5 border-0 focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-gray-400 disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !inputValue.trim()}
                                    className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <SendHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
