import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-secondary/30 relative">
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>

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

                <motion.form
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-lg border border-white/50 space-y-6 text-left"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Votre Nom</label>
                            <input type="text" id="name" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body" placeholder="Jean Dupont" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Votre Email</label>
                            <input type="email" id="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body" placeholder="jean@example.com" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Votre Message</label>
                        <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none font-body" placeholder="Bonjour, je voudrais savoir si..."></textarea>
                    </div>

                    <div className="text-center pt-4">
                        <button type="submit" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent to-accent-red text-white font-title font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            Envoyer mon message 🚀
                        </button>
                        <p className="text-xs text-slate-500 mt-4">Nous vous répondrons sous 24h (sauf le mardi !)</p>
                    </div>

                </motion.form>

            </div>
        </section>
    );
};

export default ContactSection;