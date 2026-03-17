import React from 'react';
import { motion } from 'framer-motion';
import waveBlue from "../../assets/images/layered-waves-haikei3.svg";

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-secondary/30 relative">
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-100 drop-shadow-2xl">
                <img src={waveBlue} alt="Vague décorative" className="w-full h-auto object-cover" />
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className="text-primary-dark font-title font-bold uppercase tracking-wider">Contactez-nous</span>
                    <h2 className="font-title text-4xl font-bold text-dark mt-2 mb-8">Une question ? Une commande ?</h2>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-lg border border-white/50 space-y-6 text-center relative overflow-hidden"
                >
                    {/* OVERLAY DE DÉSACTIVATION PROPRE ET CLAIR */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-6">
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-md w-full">
                            <h3 className="font-title text-2xl font-bold text-slate-800 mb-3">Bientôt disponible</h3>
                            <p className="text-slate-600 font-body mb-5 leading-relaxed">
                                Notre système de messagerie est actuellement en cours de finalisation et sera accessible très prochainement.
                            </p>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-slate-500 font-body text-sm uppercase tracking-wider font-bold mb-1">
                                    Nous joindre par téléphone
                                </p>
                                <a href="tel:0659152509" className="text-primary font-bold text-2xl hover:text-primary-dark transition-colors">
                                    06 59 15 25 09
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* FORMULAIRE EN ARRIÈRE-PLAN (Grisé et inactif) */}
                    <div className="opacity-40 pointer-events-none blur-[1px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Prénom</label>
                                <input disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent font-body" placeholder="Jean" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Nom</label>
                                <input disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent font-body" placeholder="Dupont" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Email</label>
                                <input disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent font-body" placeholder="jean@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Téléphone</label>
                                <input disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent font-body" placeholder="06 12 34 56 78" />
                            </div>
                        </div>
                        <div className="text-left mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Votre Message</label>
                            <textarea disabled rows="4" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent font-body resize-none" placeholder="Bonjour, je voudrais savoir si..."></textarea>
                        </div>
                        <div className="text-center pt-4">
                            <button disabled className="inline-flex items-center justify-center px-8 py-4 bg-slate-400 text-white font-title font-bold text-lg rounded-full">
                                Envoyer mon message
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;