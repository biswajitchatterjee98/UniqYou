'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';

type CartItem = {
    product: Product;
    size: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product, size: string) => void;
    cartCount: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, delta: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const addToCart = (product: Product, size: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id && item.size === size);
            if (existing) {
                return prev.map(item =>
                    (item.product.id === product.id && item.size === size)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, size, quantity: 1 }];
        });
        setIsCartOpen(true); // Auto-open cart
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
    };

    const updateQuantity = (productId: string, size: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId && item.size === size) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty < 1 ? 1 : newQty };
            }
            return item;
        }));
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}


export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
