'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { interpretCommand, CustomizationState } from '@/lib/ai-action';

// Icons
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const SparklesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
);

interface AIChatDesignProps {
    currentCustomization: CustomizationState;
    onUpdate: (newState: CustomizationState) => void;
}

export default function AIChatDesign({ currentCustomization, onUpdate }: AIChatDesignProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm UniqYou AI. Tell me how you'd like to style this piece." }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const input = formData.get('prompt') as string;

        if (!input.trim() || loading) return;

        // Reset form
        e.currentTarget.reset();

        // Optimistic UI updates could go here, but we'll wait for AI for accuracy
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setLoading(true);

        try {
            const newState = await interpretCommand(input, currentCustomization);
            onUpdate(newState);
            setMessages(prev => [...prev, { role: 'assistant', content: newState.description }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                    <SparklesIcon />
                </div>
                <h2 className="font-bold text-gray-800 tracking-tight">UniqYou Designer</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-black text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-none text-gray-400 text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 bg-white">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        name="prompt"
                        type="text"
                        placeholder="Describe your style (e.g. 'Red silk pattern')..."
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}
