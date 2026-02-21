import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';

import img1 from '../../assets/images/plate-with-gourmet-waffles-with-chocolate-banana-slices.jpg';
import img2 from '../../assets/images/churros.jpg';
import img3 from '../../assets/images/pancakes-with-chocolate-jam-berries-tasty-breakfast-flat-lay-top-view.jpg';
import img4 from '../../assets/images/homemade-sweet-fritter-with-sugar-rustic-table-generative-ai.jpg';

const slideImages = [img1, img2, img3, img4];

const HeroSection = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#FDFBF7]">

            <style>{`
                @keyframes kenBurns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15); }
                }
                .animate-ken-burns {
                    animation: kenBurns 15s ease-out infinite alternate;
                }
                /* FIX CSS POUR LES TRAITS NOIRS */
                .swiper-slide {
                    -webkit-transform: translate3d(0,0,0);
                    transform: translate3d(0,0,0);
                }
            `}</style>

            <Swiper
                modules={[Autoplay, EffectFade]}
                effect={'fade'}
                speed={2000}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="absolute inset-0 w-full h-full z-0"
            >
                {slideImages.map((imgSrc, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full overflow-hidden">
                            <div
                                className="w-full h-full bg-cover bg-center animate-ken-burns scale-105"
                                style={{ backgroundImage: `url(${imgSrc})` }}
                            ></div>

                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Contenu Texte */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pt-10">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <span className="inline-block px-5 py-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white font-body font-bold text-xs tracking-[0.2em] uppercase shadow-lg">
                        Livron-sur-Drôme
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-title text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 drop-shadow-2xl"
                >
                    Miss <span className="text-primary">Délice</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-white/95 text-lg md:text-2xl font-body max-w-2xl font-bold drop-shadow-md mb-10 leading-relaxed"
                >
                    Le rendez-vous des gourmands.<br/>
                    <span className="text-accent">Crêpes</span>, <span className="text-accent">Churros</span> & <span className="text-accent">Gaufres</span> faits maison.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/menu" className="px-8 py-4 bg-accent hover:bg-yellow-400 text-white rounded-full font-title font-bold text-lg shadow-[0_10px_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 hover:-translate-y-1">
                        Voir la Carte
                    </Link>
                    <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white text-white hover:text-darker border-2 border-white/30 hover:border-white rounded-full font-title font-bold text-lg backdrop-blur-sm transition-all hover:scale-105">
                        Nous trouver
                    </Link>
                </motion.div>
            </div>

            {/* --- LE FONDU --- */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/60 to-transparent z-20 pointer-events-none"></div>

        </div>
    );
};

export default HeroSection;