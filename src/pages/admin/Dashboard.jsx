import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx'

const Dashboard = () => {
    const navigate = useNavigate();
    // On prépare des états pour les stats (on les connectera plus tard)
    const [stats, setStats] = useState({ products: 0, categories: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');

        // Ici, on fera un fetch pour récupérer les vrais chiffres plus tard
        // Pour l'instant, je mets des faux chiffres pour que tu voies le design
        setStats({ products: 12, categories: 4 });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 font-body flex">

            <AdminSidebar />

            <div className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10">

                <header className="mb-10">
                    <h1 className="font-title text-4xl font-extrabold text-slate-800">
                        Vue d'ensemble
                    </h1>
                    <p className="text-slate-500 mt-2">Bienvenue dans votre espace de gestion.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                            🍩
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase">Total Produits</p>
                            <p className="text-3xl font-extrabold text-slate-800">{stats.products}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
                            Cat
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase">Catégories</p>
                            <p className="text-3xl font-extrabold text-slate-800">{stats.categories}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between">
                        <p className="font-bold opacity-90">Besoin d'ajouter une nouveauté ?</p>
                        <button className="mt-4 bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm self-start hover:shadow-lg transition-all">
                            + Ajouter un produit
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;