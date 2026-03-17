import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/LogoMC.png';

const Footer = () => {
    // State pour les horaires
    const [hours, setHours] = useState([]);

    // Chargement des horaires depuis Supabase
    useEffect(() => {
        fetch('/api/hours')
            .then(res => {
                if (!res.ok) throw new Error("Erreur du serveur");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setHours(data);
            })
            .catch(err => console.error("Erreur chargement horaires:", err));
    }, []);

    // Regrouper les jours identiques
    const getGroupedHours = () => {
        if (!hours || hours.length === 0) return [];
        const groups = [];
        let currentGroup = { ...hours[0], startDay: hours[0].day_name, endDay: hours[0].day_name };

        for (let i = 1; i < hours.length; i++) {
            const day = hours[i];
            if (day.is_closed === currentGroup.is_closed && day.hours_text === currentGroup.hours_text) {
                currentGroup.endDay = day.day_name;
            } else {
                groups.push(currentGroup);
                currentGroup = { ...day, startDay: day.day_name, endDay: day.day_name };
            }
        }
        groups.push(currentGroup);
        return groups;
    };

    const groupedHours = getGroupedHours();

    return (
        <footer className="bg-slate-900 text-white pt-12 pb-6 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* COLONNE 1 : DESCRIPTION */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={logo}
                                alt="Logo Miss Délice"
                                className="h-12 w-auto"
                            />
                            <span className="font-title text-2xl font-bold tracking-wide">Miss Délice</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Restauration sucrée sur place ou à emporter.
                            Venez déguster nos crêpes, churros et gaufres bubble faites avec amour ! 🍩
                        </p>
                    </div>

                    {/* COLONNE 2 : NAVIGATION */}
                    <div className="flex flex-col items-center md:items-center">
                        <h3 className="font-title text-xl font-bold text-accent mb-4">Navigation</h3>
                        <ul className="space-y-2 text-center">
                            <li><Link to="/" className="text-slate-300 hover:text-primary transition-colors">Accueil</Link></li>
                            <li><Link to="/menu" className="text-slate-300 hover:text-primary transition-colors">La Carte</Link></li>
                            <li><Link to="/about" className="text-slate-300 hover:text-primary transition-colors">A Propos</Link></li>
                            <li><Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* COLONNE 3 : INFOS & HORAIRES DYNAMIQUES */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h3 className="font-title text-xl font-bold text-accent mb-4">Infos & Horaires</h3>

                        <ul className="space-y-3 text-slate-300 text-sm w-full md:w-auto flex flex-col items-center md:items-end">
                            <li className="flex items-center gap-2">
                                <span>6 place Jean Jaurès, 26250 Livron-sur-Drôme</span>
                                <svg className="w-5 h-5 text-primary hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </li>

                            <li className="flex items-center gap-2">
                                <a href="tel:0659152509" className="hover:text-primary transition-colors"> 06 59 15 25 09 </a>
                                <svg className="w-5 h-5 text-primary hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </li>

                            {/* BLOC HORAIRES DYNAMIQUE - DISPOSITION HORIZONTALE */}
                            <li className="w-full mt-4 pt-4 border-t border-white/10">
                                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                                    {groupedHours.length > 0 ? groupedHours.map((group, index) => (
                                        <div key={index} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5">
                                            <span className="text-slate-400 text-xs">
                                                {group.startDay === group.endDay ? group.startDay.substring(0,3) : `${group.startDay.substring(0,3)}-${group.endDay.substring(0,3)}`}.
                                            </span>
                                            {group.is_closed ? (
                                                <span className="text-red-400 font-bold uppercase text-[10px]">Fermé</span>
                                            ) : (
                                                <span className="font-bold text-white text-xs">{group.hours_text}</span>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="text-slate-500 italic text-sm">Chargement...</div>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm opacity-60">
                    <p>&copy; {new Date().getFullYear()} Miss Délice. Tous droits réservés.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link to="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales & CGV</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;