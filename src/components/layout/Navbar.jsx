import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/LogoMC.png';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { setIsCartOpen } = useCart();
    
    // State pour les horaires
    const [hours, setHours] = useState([]);

    // Effet de scroll pour changer l'apparence
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    const isHome = location.pathname === '/';

    const handleOrderClick = () => {
        setIsCartOpen(true);
        setIsOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src={logo}
                        alt="Logo Miss Délice"
                        className="h-18 w-12"
                    />
                    <div className="flex flex-col">
                        <span className={`font-title text-2xl font-bold leading-none ${scrolled || !isHome ? 'text-darker' : 'text-white'}`}>
                            Miss Délice
                        </span>
                        <span className={`text-xs font-body font-bold tracking-widest uppercase ${scrolled || !isHome ? 'text-primary' : 'text-white/80'}`}>
                            Gourmandise
                        </span>
                    </div>
                </Link>

                {/* DESKTOP MENU */}
                <div className={`hidden md:flex items-center gap-8 font-title font-medium text-lg ${scrolled || !isHome ? 'text-dark' : 'text-white'}`}>
                    {/* Liens standards */}
                    {['Accueil', 'La Carte', 'A Propos'].map((item, index) => {
                        const path = item === 'Accueil' ? '/' : item === 'La Carte' ? '/menu' : '/about';
                        return (
                            <Link key={index} to={path} className="relative group overflow-hidden py-2">
                                <span className="relative z-10">{item}</span>
                                <span className={`absolute bottom-0 left-0 w-full h-1 -z-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${scrolled || !isHome ? 'bg-primary/20' : 'bg-white/30'}`}></span>
                            </Link>
                        );
                    })}

                    {/* DROPDOWN HORAIRES */}
                    <div className="relative group py-2">
                        <span className="cursor-pointer relative z-10 flex items-center gap-1">
                            Horaires
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                        <span className={`absolute bottom-0 left-0 w-full h-1 -z-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${scrolled || !isHome ? 'bg-primary/20' : 'bg-white/30'}`}></span>
                        
                        {/* Boîte du Menu Déroulant */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-4 font-body text-base cursor-default text-slate-800">
                            <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest border-b border-slate-100 pb-2 mb-3 text-center">Ouverture</h4>
                            
                            {groupedHours.length > 0 ? groupedHours.map((group, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 last:pb-0 first:pt-0">
                                    <span className="text-slate-600 text-sm font-semibold">
                                        {group.startDay === group.endDay ? group.startDay.substring(0,3) : `${group.startDay.substring(0,3)} - ${group.endDay.substring(0,3)}`}.
                                    </span>
                                    {group.is_closed ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-600 uppercase">Fermé</span>
                                    ) : (
                                        <span className="font-bold text-primary text-sm">{group.hours_text}</span>
                                    )}
                                </div>
                            )) : (
                                <p className="text-slate-400 italic text-sm text-center">Chargement...</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleOrderClick}
                        className="ml-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        Commander
                    </button>
                </div>

                {/* BOUTON BURGER MOBILE */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled || !isHome ? 'text-dark' : 'text-white'} focus:outline-none`}>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full max-h-[85vh] overflow-y-auto bg-white border-t border-slate-100 shadow-xl flex flex-col p-6 space-y-4 font-title text-center text-darker animate-fade-in-down">
                    <Link to="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">Accueil</Link>
                    <Link to="/menu" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">La Carte</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">A Propos</Link>
                    
                    {/* BLOC HORAIRES MOBILE */}
                    <div className="py-4 my-2 border-y border-slate-100 bg-slate-50 rounded-xl px-4 font-body">
                        <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-3">Nos Horaires</h4>
                        {groupedHours.length > 0 ? groupedHours.map((group, index) => (
                            <div key={index} className="flex justify-between items-center py-1.5">
                                <span className="text-slate-600 text-sm font-semibold">
                                    {group.startDay === group.endDay ? group.startDay : `${group.startDay} - ${group.endDay}`}
                                </span>
                                {group.is_closed ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-600 uppercase">Fermé</span>
                                ) : (
                                    <span className="font-bold text-primary text-sm">{group.hours_text}</span>
                                )}
                            </div>
                        )) : (
                            <p className="text-slate-400 italic text-sm">Chargement...</p>
                        )}
                    </div>

                    <button
                        onClick={handleOrderClick}
                        className="py-3 mt-2 bg-accent text-white rounded-xl shadow-md w-full font-bold"
                    >
                        Commander
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;