import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import waveBlue from "../../assets/images/layered-waves-haikei3.svg";

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const ContactSection = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: null,
        cooldown: 0
    });

    useEffect(() => {
        const checkCooldown = () => {
            const lastSent = localStorage.getItem('contact_last_sent');
            if (lastSent) {
                const now = Date.now();
                const diff = Math.floor((now - parseInt(lastSent)) / 1000);
                const remaining = 180 - diff;

                if (remaining > 0) {
                    setStatus(s => ({ ...s, cooldown: remaining }));
                } else {
                    localStorage.removeItem('contact_last_sent');
                    setStatus(s => ({ ...s, cooldown: 0 }));
                }
            }
        };

        checkCooldown();
        const timer = setInterval(checkCooldown, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status.cooldown > 0) return;
        
        setStatus({ ...status, submitting: true, error: null });

        const submissionData = new FormData();
        submissionData.append("access_key", "TA_CLE_WEB3FORMS_ICI");
        submissionData.append("subject", `Nouveau message de ${formData.firstName} ${formData.lastName}`);
        submissionData.append("from_name", "Miss Délice");
        submissionData.append("firstName", formData.firstName);
        submissionData.append("lastName", formData.lastName);
        submissionData.append("email", formData.email);
        submissionData.append("phone", formData.phone);
        submissionData.append("message", formData.message);
        
        if (e.target.botcheck.checked) return;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: submissionData
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('contact_last_sent', Date.now().toString());
                setStatus({ submitting: false, success: true, error: null, cooldown: 180 });
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
                setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
            } else {
                throw new Error("Erreur lors de l'envoi.");
            }
        } catch (err) {
            setStatus({ ...status, submitting: false, error: "Impossible d'envoyer. Réessayez plus tard." });
        }
    };

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

                <motion.form
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-lg border border-white/50 space-y-6 text-left"
                >
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                    {status.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl text-center font-bold">
                            Message envoyé ! Merci. 🍩
                        </div>
                    )}

                    {status.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center font-bold">
                            {status.error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Prénom</label>
                            <input
                                type="text"
                                id="firstName"
                                required
                                disabled={status.cooldown > 0}
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body disabled:opacity-50"
                                placeholder="Jean"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Nom</label>
                            <input
                                type="text"
                                id="lastName"
                                required
                                disabled={status.cooldown > 0}
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body disabled:opacity-50"
                                placeholder="Dupont"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                disabled={status.cooldown > 0}
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body disabled:opacity-50"
                                placeholder="jean@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Téléphone</label>
                            <input
                                type="tel"
                                id="phone"
                                required
                                disabled={status.cooldown > 0}
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-body disabled:opacity-50"
                                placeholder="06 12 34 56 78"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2 ml-1">Votre Message</label>
                        <textarea
                            id="message"
                            rows="4"
                            required
                            disabled={status.cooldown > 0}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none font-body disabled:opacity-50"
                            placeholder="Bonjour, je voudrais savoir si..."
                        ></textarea>
                    </div>

                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={status.submitting || status.cooldown > 0}
                            className={`inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent to-accent-red text-white font-title font-bold text-lg rounded-full shadow-lg transition-all duration-300 ${ (status.submitting || status.cooldown > 0) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}`}
                        >
                            {status.submitting ? "Envoi..." : status.cooldown > 0 ? `Attendez ${status.cooldown}s` : "Envoyer mon message"}
                        </button>
                    </div>
                    <p className="text-xs font-title tracking-wider">Ou par téléphone au <a href="tel:0659152509" className="text-primary-dark">06-59-15-25-09</a></p>
                </motion.form>
            </div>
        </section>
    );
};

export default ContactSection;