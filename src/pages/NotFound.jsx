import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6 font-body text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
            >
                <span className="text-8xl">🍩</span>
                <h1 className="font-title text-9xl font-black text-primary/20 mt-4 relative">
                    404
                    <span className="absolute inset-0 flex items-center justify-center text-4xl text-darker uppercase tracking-widest font-black">
                        Oups !
                    </span>
                </h1>
                
                <h2 className="font-title text-2xl font-bold text-darker mt-8 mb-4">
                    Cette page a été dévorée...
                </h2>
                <p className="text-slate-500 mb-10">
                    Il semblerait que l'adresse que vous cherchez n'existe plus ou a été déplacée. 
                    Pas de panique, le sucre n'est pas loin !
                </p>

                <Link 
                    to="/" 
                    className="inline-block bg-primary hover:bg-primary-dark text-white font-title font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-all hover:-translate-y-1"
                >
                    Retour à l'accueil
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;