'use client';

import React, { useState } from 'react';
import { products } from '@/lib/data';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const product = products.find(p => p.id === productId);

    const [showToast, setShowToast] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addToCart, cartCount, openCart } = useCart();

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size first!');
            return;
        }
        addToCart(product, selectedSize);
        // Toast is redundant if drawer opens, but user liked visual feedback. 
        // We removed auto-open in context, wait actually I added auto-open. 
        // So drawer opens -> no need for Toast maybe? 
        // Let's keep Toast for "Added" confirmation as per user request "show like Myntra" (drawer usually opens OR toast shows)
        // Actually Context auto-opens now. Let's rely on drawer opening.
    };

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            <Toast
                message={`Added to Bag: ${product.name} (${selectedSize})`}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
            {/* Navbar Minimal */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter">U</div>
                        <span className="font-bold text-xl tracking-tight">UniqYou</span>
                    </Link>
                    <div className="flex gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={openCart}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col h-full md:sticky top-32">
                        <div className="mb-8">
                            <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">{product.category}</p>
                            <h1 className="text-5xl font-extrabold mb-4 leading-tight">{product.name}</h1>
                            <p className="text-3xl font-medium">{formatPrice(product.price)}</p>
                        </div>

                        <div className="prose prose-lg text-gray-500 mb-8">
                            <p>{product.description}</p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <h3 className="font-bold mb-3">Select Size</h3>
                            <div className="flex gap-3">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-full border flex items-center justify-center font-medium transition-all duration-200 ${selectedSize === size
                                            ? 'bg-black text-white border-black scale-110 shadow-md'
                                            : 'border-gray-200 hover:border-black text-gray-900'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                Add to Cart ({formatPrice(product.price)})
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-2 bg-white text-sm text-gray-500">OR</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/studio/${product.id}`)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] shadow-xl shadow-purple-200 flex items-center justify-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
                                Customize with AI
                            </button>
                            <p className="text-center text-xs text-gray-500">
                                Design your own unique version in the UniqYou Studio.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
