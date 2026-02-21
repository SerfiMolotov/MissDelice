import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On va chercher les données sur ton serveur
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/analytics');
                const data = await response.json();

                if (data.success) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Erreur chargement stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement des statistiques...</div>;

    const summary = stats?.summary || { users: 0, views: 0 };
    const chartData = stats?.chart || [];

    return (
        <div className="space-y-8 mb-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-pink-100 rounded-full text-pink-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Visiteurs Uniques (7j)</p>
                        <h3 className="text-2xl font-bold text-gray-800">{summary.users}</h3>
                    </div>
                </div>

                {/* Carte Vues */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pages Vues (7j)</p>
                        <h3 className="text-2xl font-bold text-gray-800">{summary.views}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pages / Visiteur</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {summary.users > 0 ? (summary.views / summary.users).toFixed(1) : '0'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- GRAPHIQUE --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Évolution du trafic</h3>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => `${str.slice(6,8)}/${str.slice(4,6)}`} // Formate 20231027 en 27/10
                                stroke="#9ca3af"
                                fontSize={12}
                            />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#ec4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                                name="Visiteurs"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;