import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
    const [hours, setHours] = useState([]);

    useEffect(() => {
        fetch('/api/hours')
            .then(res => {
                if (!res.ok) throw new Error("Erreur du serveur");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setHours(data);
                }
            })
            .catch(err => console.error("Erreur chargement horaires:", err));
    }, []);

    // 🧠 LA MAGIE : Regrouper les jours identiques automatiquement
    const getGroupedHours = () => {
        if (!hours || hours.length === 0) return [];
        const groups = [];
        let currentGroup = { ...hours[0], startDay: hours[0].day_name, endDay: hours[0].day_name };

        for (let i = 1; i < hours.length; i++) {
            const day = hours[i];
            // Si c'est le même statut (fermé ou même horaire), on étend le groupe
            if (day.is_closed === currentGroup.is_closed && day.hours_text === currentGroup.hours_text) {
                currentGroup.endDay = day.day_name;
            } else {
                // Sinon on ferme le groupe actuel et on en commence un nouveau
                groups.push(currentGroup);
                currentGroup = { ...day, startDay: day.day_name, endDay: day.day_name };
            }
        }
        groups.push(currentGroup);
        return groups;
    };

    const groupedHours = getGroupedHours();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-body relative overflow-hidden text-slate-800">

            {/* --- BACKGROUND --- */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 mix-blend-multiply"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
            <div className="fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-50/40 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-50/30 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 opacity-80">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#9C5B1E" opacity="0.1"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#9C5B1E" opacity="0.2"></path>
                </svg>
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">

                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-16">
                    <br/>
                    <h1 className="font-title text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 relative inline-block">
                        L'Histoire <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Miss Délice</span>
                        <svg className="absolute -bottom-4 left-0 w-full h-4 text-yellow-400" viewBox="0 0 200 9" fill="none"><path d="M2.00025 7.00001C35.9185 2.58428 97.4984 -3.11186 197.989 5.86884" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
                    </h1>
                </motion.div>

                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-24 max-w-xl mx-auto">
                    <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white p-8 rounded-2xl shadow-xl rotate-1 relative border border-white/20">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-300 shadow-sm border border-slate-400"></div>

                        <div className="text-center">
                            <h3 className="font-hand text-3xl text-white mb-6 tracking-wide drop-shadow-sm">
                                Nos Horaires
                            </h3>

                            {/* NOUVEAU DESIGN COMPACT */}
                            <div className="bg-black/10 rounded-xl p-4 md:p-6 border border-white/10 backdrop-blur-sm">
                                {groupedHours.length > 0 ? groupedHours.map((group, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0 last:pb-0 first:pt-0 gap-4">
                                        
                                        {/* Colonne de Gauche : Les jours */}
                                        <span className="text-blue-50 font-sans font-bold text-sm tracking-wider uppercase text-left">
                                            {group.startDay === group.endDay ? group.startDay : `${group.startDay} - ${group.endDay}`}
                                        </span>
                                        
                                        {/* Colonne de Droite : Les horaires */}
                                        {group.is_closed ? (
                                            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-red-500 text-white shadow-sm uppercase tracking-widest">
                                                FERMÉ
                                            </span>
                                        ) : (
                                            <span className="font-bold text-white text-right text-base md:text-lg">
                                                {group.hours_text}
                                            </span>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-blue-100 italic text-sm">Chargement...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- Le reste reste strictement identique --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div initial={{ opacity: 0, rotate: -2 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                        <div className="bg-white p-3 pb-16 shadow-lg rounded-sm border border-slate-100 relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-blue-200/60 backdrop-blur-[1px] rotate-1 shadow-sm z-20"></div>
                            <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1000&auto=format&fit=crop" alt="Atelier Cuisine" className="w-full h-80 object-cover filter sepia-[0.1]" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
                        <h2 className="font-title text-3xl md:text-4xl text-slate-800 leading-tight">Un petit peu sur nous :</h2>
                        <div className="space-y-4 text-lg text-slate-600 leading-relaxed font-medium">
                            <p>Tout a commencé par une envie simple : retrouver le goût authentique des goûters de notre enfance. <span className="bg-yellow-100 px-1 text-slate-800">Pas de surgelé, pas d'industriel.</span> Juste des œufs, de la farine, du lait et de la passion.</p>
                            <p>Aujourd'hui, <strong>Miss Délice</strong> vous accueille à Livron-sur-Drôme pour partager ces moments de douceur.</p>
                        </div>
                        <div className="font-hand text-4xl text-primary mt-6 text-right rotate-[-2deg]">Bon appétit !</div>
                    </motion.div>
                </div>

                <div className="mb-32 relative">
                    <div className="text-center mb-12">
                         <span className="text-slate-400 font-title font-bold uppercase tracking-widest text-sm">— Notre Philosophie —</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Fait Maison", icon: "🥣", text: "Chaque pâte est préparée le matin même.", color: "bg-white", border: "border-blue-100" },
                            { title: "Local & Frais", icon: "🥚", text: "Des ingrédients locaux pour un goût vrai.", color: "bg-white", border: "border-yellow-100" },
                            { title: "Sourire Compris", icon: "🧡", text: "La gourmandise se sert avec bonne humeur.", color: "bg-white", border: "border-pink-100" }
                        ].map((item, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`p-8 text-center rounded-2xl shadow-sm border-2 ${item.border} hover:shadow-md transition-all duration-300`}>
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="font-title text-xl text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-8 bg-blue-200/60 rotate-[-1deg] shadow-sm z-20 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-left space-y-6">
                                <div>
                                    <h2 className="font-title text-3xl md:text-4xl text-slate-800 mb-2">Passez nous voir !</h2>
                                    <p className="text-slate-500 font-medium">On vous attend à Livron pour discuter et déguster.</p>
                                </div>
                                <div className="space-y-4 text-slate-700">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">📍</span>
                                        <div>
                                            <p className="font-bold">6 Place Jean Jaurès</p>
                                            <p className="text-sm text-slate-500">26250 Livron-sur-Drôme</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">📞</span>
                                        <div>
                                            <p className="font-bold">06 59 15 25 09</p>
                                            <p className="text-sm text-slate-500">Une question ? Appelez-nous.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-white p-2 pb-10 shadow border border-slate-100 rounded-sm rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <iframe title="Carte Miss Délice" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.207971576962!2d4.839198276674888!3d44.77218127934388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b54f3019ac79f1%3A0xf134704ae3580c21!2sMiss%20D%C3%A9lice!5e1!3m2!1sfr!2sfr!4v1770299930707!5m2!1sfr!2sfr" className="w-full h-64 bg-slate-50" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 text-center">
                            <Link to="/menu" className="inline-block bg-slate-800 hover:bg-primary text-white font-title font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:-translate-y-1">
                                Voir la Carte ➜
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;