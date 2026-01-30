'use client';

import React, { useState } from 'react';
import { products } from '@/lib/data';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Product3DViewer from '@/components/Product3DViewer';
import AIChatDesign from '@/components/AIChatDesign';
import { CustomizationState } from '@/lib/ai-action';
import Toast from '@/components/Toast';

export default function StudioPage() {
    const params = useParams();
    const productId = params.id as string;
    const product = products.find(p => p.id === productId);

    // Default to white so the image shows original colors initially
    const [customization, setCustomization] = useState<CustomizationState>({
        color: '#ffffff',
        texture: 'fabric',
        description: 'Original Style',
    });

    const [showToast, setShowToast] = useState(false);

    if (!product) {
        return <div className="p-10">Product not found</div>;
    }

    // Formatting INR
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
    };

    const handleOrder = () => {
        setShowToast(true);
    };

    return (
        <main className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden text-gray-900">
            <Toast
                message="Custom design added to cart!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
            {/* Studio Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/product/${productId}`} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        ←
                    </Link>
                    <div>
                        <h1 className="font-bold text-sm leading-tight">UniqYou Studio</h1>
                        <p className="text-xs text-gray-500">Customizing: {product.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleOrder}
                    className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                    Order Custom Design ({formatPrice(product.price + 500)})
                </button>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* 3D Canvas Area */}
                <div className="flex-1 relative bg-gray-100 p-4">
                    <div className="absolute inset-4 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Pass the product image AND baseColor to the viewer */}
                        <Product3DViewer
                            customization={customization}
                            image={product.image}
                            baseColor={product.baseColor}
                        />

                        {/* Floating Legend */}
                        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur text-white p-4 rounded-xl text-xs font-mono">
                            <p>MATERIAL: {customization.texture.toUpperCase()}</p>
                            <p>HEX: {customization.color}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-10">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold mb-2">AI Designer</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Describe your vision. E.g., <span className="italic">&quot;Navy blue silk with a subtle sheen&quot;</span> or <span className="italic">&quot;Metallic gold leather texture&quot;</span>.
                        </p>
                    </div>

                    <div className="flex-1 min-h-0 bg-gray-50 p-4">
                        <AIChatDesign
                            currentCustomization={customization}
                            onUpdate={setCustomization}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
