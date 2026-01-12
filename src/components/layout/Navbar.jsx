import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/LogoMC.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Effet de scroll pour changer l'apparence
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">

                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-0 group">
                    <img
                        src={logo}
                        alt="Logo Miss Délice"
                        className="h-36 w-28"
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

                {/* Desktop Menu */}
                <div className={`hidden md:flex items-center gap-8 font-title font-medium text-lg ${scrolled || !isHome ? 'text-dark' : 'text-white'}`}>
                    {['Accueil', 'La Carte', 'A Propos'].map((item, index) => {
                        const path = item === 'Accueil' ? '/' : item === 'La Carte' ? '/menu' : '/about';
                        return (
                            <Link key={index} to={path} className="relative group overflow-hidden">
                                <span className="relative z-10">{item}</span>
                                <span className={`absolute bottom-0 left-0 w-full h-3 -z-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${scrolled || !isHome ? 'bg-primary/20' : 'bg-white/30'}`}></span>
                            </Link>
                        );
                    })}

                    <Link to="/contact" className="ml-4 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:-translate-y-1 transition-all duration-300">
                        Commander 🍪
                    </Link>
                </div>

                {/* Mobile Button (Burger) */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled || !isHome ? 'text-dark' : 'text-white'} focus:outline-none`}>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl flex flex-col p-6 space-y-4 font-title text-center text-darker animate-fade-in-down">
                    <Link to="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">Accueil</Link>
                    <Link to="/menu" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">La Carte</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="py-2 hover:text-primary">A Propos</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="py-3 bg-accent text-white rounded-xl shadow-md">Commander</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;