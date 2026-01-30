'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-black">Shopping Bag ({cart.length})</h2>
                            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">Your bag is empty</p>
                                        <p className="text-gray-500 text-sm">Start adding items to build your style.</p>
                                    </div>
                                    <button onClick={closeCart} className="text-pink-600 font-bold hover:underline">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-sm text-black">{item.product.name}</h4>
                                                    <p className="text-gray-700 text-xs mt-1">{item.product.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id, item.size)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-medium bg-gray-200 text-black px-2 py-1 rounded">Size: {item.size}</span>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center bg-gray-100 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, -1)}
                                                            className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-xs font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, 1)}
                                                            className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm text-black">{formatPrice(item.product.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold text-black">
                                    <span>Total</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                                    Checkout
                                </button>
                                <p className="text-center text-xs text-gray-500 font-medium">
                                    Free shipping on all orders
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
