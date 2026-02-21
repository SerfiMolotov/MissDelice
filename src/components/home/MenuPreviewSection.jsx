import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import waveBlue from '../../assets/images/wave-haikei.svg';

import 'swiper/css';
import 'swiper/css/pagination';

const MenuPreviewSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();

                const featured = data.filter(p => p.is_featured === 1);
                let others = data.filter(p => p.is_featured !== 1);
                others = others.sort(() => 0.5 - Math.random());

                let allItems = [...featured, ...others];

                while (allItems.length < 10 && allItems.length > 0) {
                    allItems = [...allItems, ...allItems];
                }

                setProducts(allItems.slice(0, 10));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return null;

    return (
        <section className="relative py-20 bg-[#FDFBF7] font-body overflow-hidden">
            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none opacity-100 drop-shadow-2xl">
                <img src={waveBlue} alt="Vague décorative" className="w-full h-auto object-cover transform" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-20">
                <div className="text-center mb-16">
                    <span className="text-accent font-title font-bold tracking-widest uppercase text-sm">
                        — La Sélection —
                    </span>
                    <h2 className="font-title text-4xl md:text-5xl font-black text-darker mt-2">
                        Nos <span className="text-primary">Coups de Cœur</span>
                    </h2>
                </div>
                
                <div className="relative">
                    <button
                        ref={prevRef}
                        className="hidden md:flex absolute top-1/2 -left-4 md:-left-12 z-30 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 items-center justify-center text-slate-700 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Précédent"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <button
                        ref={nextRef}
                        className="hidden md:flex absolute top-1/2 -right-4 md:-right-12 z-30 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 items-center justify-center text-slate-700 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Suivant"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        speed={600}
                        grabCursor={true}
                        touchRatio={1.5}
                        resistanceRatio={0.6}
                        slidesPerView={1.15}
                        centeredSlides={true}
                        spaceBetween={20}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        breakpoints={{
                            640: { 
                                slidesPerView: 2, 
                                spaceBetween: 20,
                                centeredSlides: false
                            },
                            1024: { 
                                slidesPerView: 3, 
                                spaceBetween: 30,
                                centeredSlides: false
                            },
                        }}
                        className="!pb-16 !pt-4 !px-4"
                    >
                        {products.map((item, index) => (
                            <SwiperSlide key={`${item.id}-${index}`} className="h-auto">
                                <div className="group relative bg-white rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-slate-100 h-full flex flex-col overflow-hidden">
                                    {item.is_featured === 1 && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider transform -rotate-2 group-hover:rotate-0 transition-transform">
                                                Coup de ❤️
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-64 w-full overflow-hidden relative bg-slate-50">
                                        <img
                                            src={item.image_url || "https://via.placeholder.com/400x300"}
                                            alt={item.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                        />

                                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-darker font-title font-black text-xl px-4 py-2 rounded-2xl shadow-lg border border-slate-100 z-10">
                                            {Math.floor(item.price)},<span className="text-sm">{(item.price % 1).toFixed(2).substring(2)}€</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col items-center text-center">
                                        <h3 className="font-title font-bold text-2xl text-darker mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto w-full">
                                            <Link to="/menu" className="flex items-center justify-center w-full py-4 bg-slate-50 text-slate-700 rounded-xl font-title font-bold hover:bg-darker hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md gap-2">
                                                Commander
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="text-center mt-12">
                    <Link to="/menu" className="inline-block px-10 py-4 border-2 border-slate-200 text-darker rounded-full font-title font-bold text-lg hover:border-darker hover:bg-darker hover:text-white transition-all duration-300 shadow-sm hover:-translate-y-1">
                        Explorer toute la Carte
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default MenuPreviewSection;