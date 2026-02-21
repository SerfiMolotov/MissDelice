import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar.jsx';

const generateTimeSlots = () => {
    const slots = [''];
    for (let h = 6; h <= 23; h++) {
        const hour = h.toString().padStart(2, '0');
        slots.push(`${hour}h00`, `${hour}h30`);
    }
    return slots;
};
const timeSlots = generateTimeSlots();

const AdminHours = () => {
    const [hoursUI, setHoursUI] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const parseHoursText = (text) => {
        if (!text) return { mStart: '', mEnd: '', aStart: '', aEnd: '' };
        const parts = text.split('&').map(s => s.trim());
        const morning = parts[0] ? parts[0].split('-').map(s => s.trim()) : ['', ''];
        const afternoon = parts[1] ? parts[1].split('-').map(s => s.trim()) : ['', ''];
        return {
            mStart: morning[0] || '', mEnd: morning[1] || '',
            aStart: afternoon[0] || '', aEnd: afternoon[1] || ''
        };
    };

    const buildHoursText = (parsed) => {
        const morning = parsed.mStart && parsed.mEnd ? `${parsed.mStart} - ${parsed.mEnd}` : '';
        const afternoon = parsed.aStart && parsed.aEnd ? `${parsed.aStart} - ${parsed.aEnd}` : '';
        
        if (morning && afternoon) return `${morning} & ${afternoon}`;
        if (morning) return morning;
        if (afternoon) return afternoon;
        return '';
    };

    useEffect(() => {
        fetch('/api/hours')
            .then(res => {
                if (!res.ok) throw new Error("Erreur serveur");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const uiData = data.map(day => ({
                        ...day,
                        parsed: parseHoursText(day.hours_text)
                    }));
                    setHoursUI(uiData);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur:", err);
                setStatus({ message: "Erreur de chargement.", type: 'error' });
                setLoading(false);
            });
    }, []);

    const handleToggleClosed = (id) => {
        setHoursUI(hoursUI.map(day => day.id === id ? { ...day, is_closed: !day.is_closed } : day));
    };

    const handleTimeChange = (id, type, value) => {
        setHoursUI(hoursUI.map(day => {
            if (day.id === id) {
                const newParsed = { ...day.parsed, [type]: value };
                return { ...day, parsed: newParsed, hours_text: buildHoursText(newParsed) };
            }
            return day;
        }));
    };

    const handleSave = async () => {
        setStatus({ message: 'Sauvegarde...', type: 'info' });
        try {
            const payload = hoursUI.map(({ id, is_closed, hours_text }) => ({ id, is_closed, hours_text }));
            
            const response = await fetch('/api/hours', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setStatus({ message: 'Horaires enregistrés ! ✅', type: 'success' });
                setTimeout(() => setStatus({ message: '', type: '' }), 3000);
            } else {
                setStatus({ message: 'Erreur sauvegarde ❌', type: 'error' });
            }
        } catch (error) {
            setStatus({ message: 'Erreur réseau ❌', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body flex">
            <AdminSidebar />
            <div className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10">
                
                <div className="mb-10">
                    <h1 className="font-title text-3xl md:text-4xl font-extrabold text-slate-800">
                        Gestion des <span className="text-primary">Horaires</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Choisissez vos créneaux. (Laissez la 2ème ligne vide si journée continue).</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl">
                    
                    {status.message && (
                        <div className={`p-4 mb-6 rounded-xl font-bold border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {status.message}
                        </div>
                    )}

                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <div className="space-y-6">
                            {hoursUI.map((day) => (
                                <div key={day.id} className={`flex flex-col xl:flex-row xl:items-center gap-6 p-5 border rounded-2xl transition-all ${day.is_closed ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    
                                    <div className="flex items-center justify-between xl:w-48 shrink-0">
                                        <div className="font-title font-bold text-xl text-slate-800">{day.day_name}</div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={day.is_closed} onChange={() => handleToggleClosed(day.id)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 relative"></div>
                                            <span className={`font-bold text-xs uppercase ${day.is_closed ? 'text-red-500' : 'text-slate-400'}`}>Fermé</span>
                                        </label>
                                    </div>

                                    {!day.is_closed && (
                                        <div className="flex flex-col md:flex-row gap-4 xl:gap-8 flex-grow">
                                            
                                            <div className="flex items-center gap-2">
                                                <select 
                                                    value={day.parsed.mStart} 
                                                    onChange={(e) => handleTimeChange(day.id, 'mStart', e.target.value)}
                                                    className="p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary text-sm font-bold text-slate-700 w-24"
                                                >
                                                    {timeSlots.map(t => <option key={`mS-${t}`} value={t}>{t || '--:--'}</option>)}
                                                </select>
                                                <span className="text-slate-400">à</span>
                                                <select 
                                                    value={day.parsed.mEnd} 
                                                    onChange={(e) => handleTimeChange(day.id, 'mEnd', e.target.value)}
                                                    className="p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary text-sm font-bold text-slate-700 w-24"
                                                >
                                                    {timeSlots.map(t => <option key={`mE-${t}`} value={t}>{t || '--:--'}</option>)}
                                                </select>
                                            </div>

                                            <span className="hidden md:block text-slate-300 font-bold">&</span>

                                            <div className="flex items-center gap-2">
                                                <select 
                                                    value={day.parsed.aStart} 
                                                    onChange={(e) => handleTimeChange(day.id, 'aStart', e.target.value)}
                                                    className="p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary text-sm font-bold text-slate-700 w-24"
                                                >
                                                    {timeSlots.map(t => <option key={`aS-${t}`} value={t}>{t || '--:--'}</option>)}
                                                </select>
                                                <span className="text-slate-400">à</span>
                                                <select 
                                                    value={day.parsed.aEnd} 
                                                    onChange={(e) => handleTimeChange(day.id, 'aEnd', e.target.value)}
                                                    className="p-2 border rounded-lg bg-slate-50 outline-none focus:border-primary text-sm font-bold text-slate-700 w-24"
                                                >
                                                    {timeSlots.map(t => <option key={`aE-${t}`} value={t}>{t || '--:--'}</option>)}
                                                </select>
                                            </div>
                                            
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={handleSave} className="mt-8 w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-title font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all float-right">
                        Sauvegarder
                    </button>
                    <div className="clear-both"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminHours;