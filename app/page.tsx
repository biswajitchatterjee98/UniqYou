'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/lib/data';
import Link from 'next/link';
import Toast from '@/components/Toast';

import { useCart } from "@/context/CartContext";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ show: false, message: '' });
  const { cartCount, openCart } = useCart();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter">U</div>
              <span className="font-bold text-xl tracking-tight">UniqYou</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#collections" className="hover:text-black transition-colors">Collections</a>
            <a href="#" className="hover:text-black transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={openCart}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">Hello, Designer</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {
          showLoginModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-6">Welcome Back</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL</label>
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="designer@uniqyou.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-transform active:scale-95">
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="w-full text-gray-400 text-sm hover:text-black mt-2"
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* Hero Section */}
      < section className="pt-32 pb-20 px-6 max-w-7xl mx-auto" >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Design fashion that is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">uniquely yours.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
              Experience the future of e-commerce. Distinct styles, textures, and fabrics generated in real-time by AI.
            </p>
            <div className="flex gap-4">
              <a href="#collections" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all transform hover:scale-105">
                Start Shopping
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

            {/* Static Hero Image */}
            <div className="bg-white p-2 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fashion" className="object-cover w-full h-full" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-serif italic text-lg">New Collection 2026</p>
                    </div>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">→</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section >

      {/* Gallery Section */}
      < section id="collections" className="py-20 bg-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Curated Collections</h2>
            <p className="text-gray-500">Select a piece to customize.</p>
          </div>

          {['Women', 'Men', 'Kids', 'Accessories'].map((category) => (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                {category}
                <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">New Arrivals</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {products.filter(p => p.category === category).map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg group-hover:underline">{product.name}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
                      </div>
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-black text-white py-20 mt-20 relative z-10" >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-2xl mb-4">UniqYou</h3>
            <p className="text-gray-400">The future of personalized fashion.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setToast({ show: true, message: 'New Arrivals coming soon!' })} className="hover:text-white transition-colors">New Arrivals</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Best Sellers updated weekly!' })} className="hover:text-white transition-colors">Best Sellers</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Accessories catalog downloading...' })} className="hover:text-white transition-colors">Accessories</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setToast({ show: true, message: 'FAQ section is under maintenance.' })} className="hover:text-white transition-colors">FAQ</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Shipping stays free, always.' })} className="hover:text-white transition-colors">Shipping</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Returns are hassle-free!' })} className="hover:text-white transition-colors">Returns</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setToast({ show: true, message: 'Opening Instagram...' })} className="hover:text-white transition-colors">Instagram</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Follow us on Twitter!' })} className="hover:text-white transition-colors">Twitter</button></li>
              <li><button onClick={() => setToast({ show: true, message: 'Trending on TikTok!' })} className="hover:text-white transition-colors">TikTok</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-gray-500 text-sm">
          © 2026 UniqYou Inc. All rights reserved.
        </div>
      </footer >

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </main >
  );
}
