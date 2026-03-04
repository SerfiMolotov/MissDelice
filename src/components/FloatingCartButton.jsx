import React from 'react';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
    const { setIsCartOpen, getCartCount } = useCart();
    const count = getCartCount();

    if (count === 0) return null;

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-30 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-primary transition-all duration-300 flex items-center justify-center group"
        >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                {count}
            </span>
        </button>
    );
};

export default FloatingCartButton;