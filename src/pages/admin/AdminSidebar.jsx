import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;
    const linkClass = (path) => `
        flex items-center gap-3 px-6 py-4 transition-all duration-300 border-r-4
        ${isActive(path)
        ? 'bg-primary/10 border-primary text-primary font-bold'
        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
    `;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md text-2xl border border-slate-100"
            >
                {isOpen ? '✕' : '≡'}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div className={`
                w-64 bg-white h-screen fixed left-0 top-0 shadow-xl z-50 flex flex-col font-body transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}>
                <div className="p-8 text-center border-b border-slate-100 mt-10 md:mt-0">
                    <h2 className="font-title text-2xl font-extrabold text-slate-800">
                        Miss <span className="text-primary">Admin</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Espace Gérant</p>
                </div>

                <nav className="flex-1 mt-6">
                    <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')} onClick={() => setIsOpen(false)}>
                        <span>📊</span> Tableau de bord
                    </Link>

                    <Link to="/admin/categories" className={linkClass('/admin/categories')} onClick={() => setIsOpen(false)}>
                        <span>Cat</span> Catégories
                    </Link>

                    <Link to="/admin/products" className={linkClass('/admin/products')} onClick={() => setIsOpen(false)}>
                        <span>🍩</span> Produits
                    </Link>
                    
                    <Link to="/admin/hours" className={linkClass('/admin/hours')} onClick={() => setIsOpen(false)}>
                        <span>⏰</span> Horaires
                    </Link>
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-sm"
                    >
                        <span>🚪</span> Déconnexion
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;