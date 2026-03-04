import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, addToCart, getCartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        delivery: false,
        address: '',
        city: '',
        zip: '',
        timeSlot: ''
    });

    const [availableSlots, setAvailableSlots] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // --- GÉNÉRATEUR DE CRÉNEAUX HORAIRES (Logique Complexe) ---
    useEffect(() => {
        const generateSlots = () => {
            const slots = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMin = now.getMinutes();
            const day = now.getDay();

            if (day === 2) return [];

            const startHour = 14;
            const endHour = 18;

            for (let h = startHour; h < endHour; h++) {
                for (let m = 0; m < 60; m += 15) {
                    // Création de l'heure du créneau
                    const slotTime = new Date();
                    slotTime.setHours(h, m, 0);

                    const bufferTime = new Date(now.getTime() + 15 * 60000);

                    if (slotTime > bufferTime) {
                        const timeString = `${h.toString().padStart(2, '0')}h${m.toString().padStart(2, '0')}`;
                        slots.push(timeString);
                    }
                }
            }
            return slots;
        };

        if (isCartOpen) {
            setAvailableSlots(generateSlots());
        }
    }, [isCartOpen]);

    const formatPrice = (p) => parseFloat(p).toFixed(2).replace('.', ',') + '€';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            customer: {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.delivery ? `${formData.address}, ${formData.zip} ${formData.city}` : "Retrait sur place"
            },
            items: cartItems,
            total: getCartTotal(),
            delivery: formData.delivery,
            pickupTime: formData.timeSlot,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setOrderSuccess(true);
                setTimeout(() => {
                    clearCart();
                    setOrderSuccess(false);
                    setIsCartOpen(false);
                    setFormData({ name: '', phone: '', email: '', delivery: false, address: '', city: '', zip: '', timeSlot: '' });
                }, 4000);
            } else {
                alert("Oups ! Une erreur est survenue. Veuillez nous appeler.");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion au serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#FAF9F6] bg-grain shadow-2xl z-50 overflow-y-auto flex flex-col font-body border-l-4 border-primary"
                    >
                        {/* HEADER */}
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="font-title text-3xl text-slate-800">Mon Panier</h2>
                            <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center font-bold text-xl">✕</button>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-grow p-6">

                            {/* ÉCRAN DE SUCCÈS */}
                            {orderSuccess ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl"></span>
                                    </div>
                                    <h3 className="font-title text-2xl text-green-600 mb-4">Commande Reçue !</h3>
                                    <p className="text-slate-600 mb-2">Merci <strong>{formData.name}</strong>.</p>
                                    <p className="text-slate-500 text-sm">Nous avons envoyé un mail à la gérante.</p>
                                    <p className="text-primary font-bold mt-4 animate-pulse">On vous rappelle très vite pour confirmer ! 📞</p>
                                </div>
                            ) : (
                                <>
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-20 opacity-50">
                                            <span className="text-6xl block mb-4">🍩</span>
                                            <p className="font-title text-xl">Votre panier est vide...</p>
                                            <p className="text-sm">Allez vite choisir une gourmandise !</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4 mb-8">
                                                {cartItems.map(item => (
                                                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                                        <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                                        <div className="flex-grow flex flex-col justify-between">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                                                                <span className="font-hand font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs text-slate-400">{formatPrice(item.price)} / unité</span>
                                                                <div className="flex items-center gap-3 bg-slate-50 rounded-full px-2 py-1 border border-slate-200">
                                                                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:text-red-500">-</button>
                                                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                                                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center font-bold text-slate-500 hover:text-green-500">+</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* FORMULAIRE DE COMMANDE */}
                                            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-md border border-slate-100">
                                                <h3 className="font-title text-xl mb-4 flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm">📝</span>
                                                    Vos Coordonnées
                                                </h3>

                                                <div className="space-y-3">
                                                    <input required type="text" name="name" placeholder="Votre Nom" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input required type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                                        <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                                    </div>
                                                </div>

                                                {/* TOGGLE LIVRAISON */}
                                                <div className="mt-6">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${formData.delivery ? 'bg-primary' : 'bg-slate-300'}`}>
                                                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${formData.delivery ? 'translate-x-6' : ''}`} />
                                                        </div>
                                                        <input type="checkbox" name="delivery" checked={formData.delivery} onChange={handleChange} className="hidden" />
                                                        <span className="font-bold text-slate-700">Je souhaite être livré</span>
                                                    </label>
                                                    {formData.delivery && <p className="text-xs text-orange-500 mt-1 font-bold ml-14">⚠️ Sous réserve de validation par la gérante</p>}
                                                </div>

                                                {/* CHAMPS ADRESSE (Si livraison) */}
                                                {formData.delivery && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3 overflow-hidden">
                                                        <input required type="text" name="address" placeholder="Numéro et Rue" value={formData.address} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input required type="text" name="zip" placeholder="Code Postal" value={formData.zip} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3" />
                                                            <input required type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3" />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* SÉLECTEUR CRÉNEAU */}
                                                <div className="mt-6">
                                                    <label className="block font-bold text-slate-700 mb-2">Heure de retrait / livraison souhaitée :</label>
                                                    <select required name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:border-primary cursor-pointer">
                                                        <option value="">-- Choisir un créneau --</option>
                                                        {availableSlots.length > 0 ? (
                                                            availableSlots.map(slot => (
                                                                <option key={slot} value={slot}>{slot}</option>
                                                            ))
                                                        ) : (
                                                            <option disabled>Aucun créneau disponible aujourd'hui (Fermé ou trop tard)</option>
                                                        )}
                                                    </select>
                                                    <p className="text-xs text-slate-400 mt-1 text-center">Ouvert de 14h à 18h (Sauf Mardi)</p>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* FOOTER (TOTAL & BOUTON) */}
                        {!orderSuccess && cartItems.length > 0 && (
                            <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] sticky bottom-0">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-slate-500 font-bold uppercase text-sm">Total à payer (sur place)</span>
                                    <span className="font-hand text-4xl font-bold text-slate-800">{formatPrice(getCartTotal())}</span>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || availableSlots.length === 0}
                                    className={`w-full py-4 rounded-2xl font-title text-xl text-white shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 ${availableSlots.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-orange-500 hover:shadow-primary/30'}`}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"/>
                                    ) : (
                                        <>Envoyer ma commande</>
                                    )}
                                </button>
                                {availableSlots.length === 0 && <p className="text-center text-red-500 text-xs font-bold mt-2">Désolé, nous sommes fermés pour aujourd'hui !</p>}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;