import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/LogoMC.png';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-12 pb-6 font-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={logo}
                                alt="Logo Miss Délice"
                                className="h-12 w-auto rounded-full border-2 border-white/20"
                            />
                            <span className="font-title text-2xl font-bold tracking-wide">Miss Délice</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Restauration sucrée sur place ou à emporter.
                            Venez déguster nos crêpes, churros et gaufres bubble faites avec amour ! 🍩
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-center">
                        <h3 className="font-title text-xl font-bold text-accent mb-4">Navigation</h3>
                        <ul className="space-y-2 text-center">
                            <li><Link to="/" className="text-slate-300 hover:text-primary transition-colors">Accueil</Link></li>
                            <li><Link to="/menu" className="text-slate-300 hover:text-primary transition-colors">La Carte</Link></li>
                            <li><Link to="/about" className="text-slate-300 hover:text-primary transition-colors">A Propos</Link></li>
                            <li><Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h3 className="font-title text-xl font-bold text-accent mb-4">Infos & Horaires</h3>

                        <ul className="space-y-3 text-slate-300 text-sm">
                            <li className="flex items-center md:justify-end gap-2">
                                <span>6 place Jean Jaurès, 26250 Livron-sur-Drôme</span>
                                <svg className="w-5 h-5 text-primary hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </li>

                            <li className="flex items-center md:justify-end gap-2">
                                <span>06 59 15 25 09</span>
                                <svg className="w-5 h-5 text-primary hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </li>

                            <li className="flex flex-col md:items-end gap-1 mt-2">
                                <span className="font-bold text-white">14H - 18H</span>
                                <span className="text-xs text-slate-400">Semaine et Week-end</span>
                                <span className="text-xs text-red-400 font-bold">Fermé le Mardi</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* --- LIGNE DE SÉPARATION --- */}
                <div className="border-t border-slate-800 pt-6 mt-6 text-center">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} Miss Délice. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;