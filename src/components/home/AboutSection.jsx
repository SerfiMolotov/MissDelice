import React from 'react';
import { motion } from 'framer-motion';
import mascot from '../../assets/images/LogoMC.png';
import waveBlue from '../../assets/images/wave-haikei (1).svg';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const AboutSection = () => {
    return (
        <section id="about" className="relative py-24 w-full overflow-hidden bg-cream font-body">

            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-100 drop-shadow-2xl">
                <img src={waveBlue} alt="Vague décorative" className="w-full h-auto object-cover" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div>
                            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl font-black text-darker leading-tight">
                                La passion du goût,<br />
                                <span className="relative inline-block z-10">
                                    au cœur de Livron.
                                    <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow-300/60 -z-10 -rotate-1 rounded-sm transform scale-110"></span>
                                </span>
                            </h2>
                        </div>

                        <div className="text-dark/80 text-lg font-medium leading-relaxed space-y-4">
                            <p>
                                Bienvenue chez <span className="font-bold text-primary">Miss Délice</span> !
                                Ici, tout est fait maison et avec le coeur ! Installés Place Jean Jaurès, je prépare vos douceurs à la demande.
                            </p>
                            <p>
                                Que vous soyez team <span className="font-bold text-accent">Crêpe fondante</span> ou <span className="font-bold text-accent">Churros croustillant</span>,
                                vous trouverez votre bonheur.
                            </p>
                        </div>


                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border-2 border-slate-100 rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                                <span className="text-2xl bg-red-100 p-2 rounded-full">🥚</span>
                                <div className="text-left">
                                    <h4 className="font-title font-bold text-darker text-base">100% Frais</h4>
                                    <p className="text-xs text-slate-500 font-bold">Pâte du matin</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border-2 border-slate-100 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                                <span className="text-2xl bg-blue-100 p-2 rounded-full">🍴</span>
                                <div className="text-left">
                                    <h4 className="font-title font-bold text-darker text-base">Fait maison</h4>
                                    <p className="text-xs text-slate-500 font-bold"></p>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative mt-10 lg:mt-0"
                    >
                        <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out z-10">
                            <div className="h-[400px] w-full rounded-[2rem] overflow-hidden bg-slate-200 relative">
                                <iframe
                                    title="Localisation Miss Délice"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: "grayscale(0%)" }}
                                    loading="lazy"
                                    allowFullScreen
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.207971576962!2d4.839198276674888!3d44.77218127934388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b54f3019ac79f1%3A0xf134704ae3580c21!2sMiss%20D%C3%A9lice!5e1!3m2!1sfr!2sfr!4v1770299930707!5m2!1sfr!2sfr"
                                >
                                </iframe>
                            </div>
                        </div>

                        {/* La Mascotte */}
                        <div className="absolute -bottom-0 -right-16 w-40 md:w-56 z-20 pointer-events-none drop-shadow-2xl animate-float-slow">
                            <img src={mascot} alt="Laurie Miss Délice" className="w-28 h-auto object-contain transform -rotate-6" />
                        </div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;