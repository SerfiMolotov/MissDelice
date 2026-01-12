import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from "react-fast-marquee";
import { motion } from 'framer-motion';

const MenuPreviewSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                const data = await response.json();
                const shuffled = shuffleArray(data);
                setProducts(shuffled.slice(0, 12));
                setLoading(false);
            } catch (error) {
                console.error("Erreur chargement aperçu:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return null;

    return (
        // CHANGEMENT : Fond crème très léger (#FAF9F6) pour faire ressortir les cartes blanches
        <section className="py-28 bg-[#FAF9F6] relative overflow-hidden font-body">

            {/* Titre */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="max-w-7xl mx-auto px-4 mb-20 text-center relative z-10"
            >
                <span className="text-primary font-title font-bold uppercase tracking-widest text-sm mb-2 block opacity-80">
                    — Coups de cœur —
                </span>
                <h2 className="font-title text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm">
                    Le Défilé des <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Gourmandises</span>
                </h2>
            </motion.div>

            {/* Carrousel */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="max-w-full relative py-8"
            >
                <Marquee
                    direction="right"
                    speed={35} // Vitesse un peu plus lente pour apprécier le design
                    gradient={true}
                    gradientWidth={120}
                    gradientColor="#FAF9F6" // IMPORTANT : Le dégradé matche la couleur de fond crème
                    className="overflow-y-visible py-10" // overflow-visible pour ne pas couper les ombres
                >
                    {products.map((item) => (
                        <div
                            key={item.id}
                            // DESIGN CARTE : Plus large, coins arrondis modernes, grosse ombre douce
                            className="w-96 mx-8 bg-white rounded-[2.5rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-5 border border-slate-50 hover:border-orange-100 hover:-translate-y-2 transition-all duration-500 group cursor-pointer relative"
                        >
                            {/* Image Container */}
                            <div className="h-72 w-full rounded-[2rem] overflow-hidden mb-6 relative shadow-inner">
                                <img
                                    src={item.image_url || "https://via.placeholder.com/300"}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-in-out"
                                />

                                {/* PRIX STICKER : Effet autocollant posé à la main */}
                                <div className="absolute bottom-4 right-4 bg-white text-slate-800 font-title font-black text-lg px-4 py-2 rounded-full border-4 border-[#FAF9F6] shadow-lg transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                                    {item.price} €
                                </div>
                            </div>

                            {/* Contenu Texte */}
                            <div className="px-2 pb-2 text-center">
                                <h3 className="font-title font-bold text-2xl text-slate-800 mb-3 group-hover:text-primary transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed px-4">
                                    {item.description}
                                </p>

                                {/* Petit lien discret "Voir" */}
                                <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-primary font-bold text-sm uppercase tracking-wider">
                                    Commander →
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </motion.div>

            {/* Bouton Action */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: 0.4 }}
                className="text-center mt-16 relative z-10"
            >
                <Link to="/menu" className="inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-primary px-10 py-4 rounded-full font-title font-bold text-xl shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300">
                    Explorer toute la carte
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
            </motion.div>

        </section>
    );
};

export default MenuPreviewSection;