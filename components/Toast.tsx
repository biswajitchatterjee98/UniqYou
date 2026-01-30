'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastProps = {
    message: string;
    isVisible: boolean;
    onClose: () => void;
};

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl"
                >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-medium text-sm">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
