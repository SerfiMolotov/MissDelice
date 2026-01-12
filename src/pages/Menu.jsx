import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 12 }
    }
};

const Menu = () => {
    const { addToCart, setIsCartOpen } = useCart();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    fetch('http://localhost:3000/api/categories'),
                    fetch('http://localhost:3000/api/products')
                ]);

                const catsData = await catsRes.json();
                const prodsData = await prodsRes.json();
                setCategories(catsData);
                setProducts(prodsData);
                setLoading(false);
            } catch (error) {
                console.error("Erreur chargement menu:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getCategoryItems = (categoryId) => {
        return products.filter(product => product.category_id === categoryId);
    };

    // AJOUT : Fonction Prix
    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2).replace('.', ',') + ' €';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-title text-primary text-2xl animate-pulse">
                Chargement des gourmandises... 🍩
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-8 font-body relative overflow-hidden">

            <img
                src="https://cdn-icons-png.flaticon.com/512/590/590772.png"
                alt="Fraise"
                className="absolute top-10 left-[-50px] w-32 md:w-48 opacity-20 pointer-events-none anim-float"
                style={{ zIndex: 0 }}
            />

            <img
                src="https://cdn-icons-png.flaticon.com/512/2553/2553691.png"
                alt="Donut"
                className="absolute bottom-20 right-[-40px] w-40 md:w-56 opacity-20 pointer-events-none anim-float"
                style={{ animationDelay: '2s', zIndex: 0 }} // Léger décalage pour le naturel
            />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[50px] mix-blend-multiply anim-blob" />
                <div className="absolute top-[30%] right-[-15%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[80px] mix-blend-multiply anim-blob" style={{ animationDelay: '5s' }} />
                <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[80px] mix-blend-multiply anim-blob" style={{ animationDelay: '8s' }} />

                <div className="absolute top-[15%] left-[10%] w-6 h-6 rounded-full bg-yellow-400/40 blur-sm anim-confetti" />
                <div className="absolute top-[40%] right-[20%] w-8 h-8 rounded-lg bg-primary/30 blur-sm anim-confetti" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-[20%] left-[30%] w-6 h-6 bg-accent/30 rounded-full blur-sm anim-confetti" style={{ animationDelay: '2.5s' }} />
            </div>


            <div className="max-w-7xl mx-auto mb-6 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary font-bold font-title bg-white/60 backdrop-blur-md px-5 py-2 rounded-full shadow-sm hover:shadow-md border border-white/50 hover:border-primary/20 transition-all duration-300 group">
                    <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    Retour à l'accueil
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-16 mt-10 relative z-10"
            >
                <h1 className="font-title text-5xl md:text-7xl text-primary-dark font-extrabold mb-4 drop-shadow-sm leading-tight">
                    La Carte <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">Gourmande</span> 🍭
                </h1>
                <p className="text-slate-600 text-xl max-w-2xl mx-auto font-medium">
                    Plongez dans un océan de saveurs sucrées et salées.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">

                {!selectedCategory ? (
                    /* GRILLE CATÉGORIES (INCHANGÉE) */
                    <motion.div
                        key="categories-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10 pb-20"
                    >
                        {categories.map((category) => (
                            <motion.div
                                key={category.id}
                                variants={cardVariants}
                                onClick={() => { setSelectedCategory(category); scrollToTop(); }}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-3 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-white h-full flex flex-col">

                                    <div className="h-60 w-full overflow-hidden rounded-[2rem] relative mb-4">
                                        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
                                        <motion.img
                                            layoutId={`image-${category.id}`}
                                            src={category.image_url}
                                            alt={category.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary-dark font-title font-bold px-3 py-1 rounded-full text-xs shadow-md z-20">
                                            {getCategoryItems(category.id).length} choix
                                        </div>
                                    </div>

                                    <div className="px-4 pb-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-2xl font-title font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                                                {category.title}
                                            </h2>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                                {category.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Découvrir</span>
                                            <span className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                ) : (
                    /* LISTE PRODUITS */
                    <motion.div
                        key="products-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-5xl mx-auto relative z-10"
                    >
                        <button
                            onClick={() => {setSelectedCategory(null); scrollToTop()}}
                            className="mb-8 flex items-center gap-2 text-slate-600 hover:text-primary font-bold transition-colors bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md group border border-white"
                        >
                           <span className="bg-slate-100 p-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                           </span>
                            Retour aux catégories
                        </button>

                        <div className="relative w-full h-72 md:h-96 rounded-[3rem] overflow-hidden shadow-2xl mb-12 group">
                            <motion.img
                                layoutId={`image-${selectedCategory.id}`}
                                src={selectedCategory.image_url}
                                alt={selectedCategory.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                                    className="text-5xl md:text-7xl font-title font-extrabold text-white mb-4 drop-shadow-xl"
                                >
                                    {selectedCategory.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                                    className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl"
                                >
                                    {selectedCategory.description}
                                </motion.p>
                            </div>
                        </div>

                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {getCategoryItems(selectedCategory.id).map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={cardVariants}
                                    // AJOUT LOGIQUE RUPTURE (Désactive le scale si épuisé)
                                    whileHover={item.is_out_of_stock ? {} : { scale: 1.02 }}
                                    // AJOUT STYLE RUPTURE (Grayscale + Opacité)
                                    className={`
                                        bg-white/90 backdrop-blur-md rounded-[2rem] p-4 shadow-lg hover:shadow-2xl hover:shadow-accent/10 transition-all 
                                        flex gap-5 items-center border border-white group cursor-default relative overflow-hidden
                                        ${item.is_out_of_stock ? 'opacity-80 grayscale' : ''}
                                    `}
                                >
                                    {/* IMAGE AVEC BADGES */}
                                    <div className="w-32 h-32 flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-md relative group-hover:rotate-2 transition-transform duration-300">
                                        <img
                                            src={item.image_url || "https://via.placeholder.com/150"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* AJOUT : Overlay Rupture */}
                                        {item.is_out_of_stock === 1 && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                <span className="text-red-600 font-black border-2 border-red-600 px-2 py-1 -rotate-12 uppercase text-[10px] tracking-wider">
                                                    Épuisé
                                                </span>
                                            </div>
                                        )}

                                        {/* AJOUT : Badges Nouveauté / Pépite */}
                                        <div className="absolute top-1 left-1 flex flex-col gap-1 z-20">
                                            {item.is_new === 1 && !item.is_out_of_stock && (
                                                <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                                                    NEW
                                                </span>
                                            )}
                                            {item.is_featured === 1 && !item.is_out_of_stock && (
                                                <span className="bg-yellow-400 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                                                    ★
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CONTENU TEXTE */}
                                    <div className="flex-grow pr-2 h-full flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex flex-col items-start mb-2">
                                                <h3 className={`font-title font-bold text-xl text-slate-800 leading-tight transition-colors ${item.is_out_of_stock ? '' : 'group-hover:text-primary'}`}>
                                                    {item.name}
                                                </h3>
                                                {/* AJOUT : PRIX FORMATÉ */}
                                                <span className={`mt-2 inline-block font-title font-bold px-4 py-1 rounded-full text-sm shadow-sm transition-transform ${item.is_out_of_stock ? 'bg-slate-200 text-slate-400 line-through' : 'bg-accent text-white group-hover:-translate-y-1'}`}>
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-snug font-medium line-clamp-2">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* AJOUT : Bouton Infos */}
                                        <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
                                            <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-primary transition-colors">
                                                <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-serif italic">i</span>
                                                Infos
                                            </button>
                                        </div>
                                        {/* Si pas en rupture, on affiche le bouton Ajouter */}
                                        {!item.is_out_of_stock && (
                                            <button
                                                onClick={() => {
                                                    addToCart(item);      // 1. Ajoute au panier
                                                    setIsCartOpen(true);  // 2. Ouvre le tiroir pour montrer l'ajout
                                                }}
                                                className="h-10 px-5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-primary hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
                                            >
                                                <span>Ajouter</span>
                                                <span className="bg-white/20 w-5 h-5 flex items-center justify-center rounded-full text-xs">+</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Menu;