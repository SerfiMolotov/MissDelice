import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCÈS ! 🎉
                // 1. On stocke le fameux "Tampon" (Token) dans la mémoire du navigateur
                localStorage.setItem('token', data.token);

                // 2. On redirige vers le tableau de bord
                navigate('/admin/dashboard');
            } else {
                // ERREUR (Mauvais mot de passe)
                setError(data.error || 'Erreur de connexion');
            }
        } catch (err) {
            setError("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-body">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
                <div className="max-w-7xl mx-auto mb-6 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary font-bold font-title bg-white/60 backdrop-blur-md px-5 py-2 rounded-full shadow-sm hover:shadow-md border border-white/50 hover:border-primary/20 transition-all duration-300 group">
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                </div>
                <div className="text-center mb-8">
                    <h1 className="font-title text-3xl font-extrabold text-primary">Espace Gérant</h1>
                    <p className="text-slate-500 mt-2">Connectez-vous pour modifier la carte</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Identifiant</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="UserName"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-title font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;