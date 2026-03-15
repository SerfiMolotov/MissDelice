import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, addToCart, getCartTotal, clearCart, getCartCount } = useCart();

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

    // --- GÉNÉRATEUR DE CRÉNEAUX HORAIRES ---
    useEffect(() => {
        const generateSlots = () => {
            const slots = [];
            const now = new Date();
            const day = now.getDay();

            if (day === 2) return []; // Fermé le mardi

            const startHour = 14;
            const endHour = 18;

            for (let h = startHour; h < endHour; h++) {
                for (let m = 0; m < 60; m += 15) {
                    const slotTime = new Date();
                    slotTime.setHours(h, m, 0);

                    const bufferTime = new Date(now.getTime() + 15 * 60000); // 15 min de marge

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
            const response = await fetch('http://localhost:3000/api/orders', {
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
                    {/* OVERLAY FONCÉ (Fond flou qui couvre tout le site) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]"
                    />

                    {/* PANNEAU LATÉRAL DU PANIER */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-[100dvh] w-full md:w-[450px] lg:w-[500px] bg-white shadow-2xl z-[100] flex flex-col font-body"
                    >
                        {/* HEADER STICKY */}
                        <div className="flex-none p-6 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md z-10">
                            <h2 className="font-title text-2xl text-slate-800 flex items-center gap-3">
                                Mon Panier
                                {cartItems.length > 0 && (
                                    <span className="bg-primary text-white text-sm px-3 py-1 rounded-full font-bold">
                                        {getCartCount()}
                                    </span>
                                )}
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* CONTENU SCROLLABLE (Produits + Formulaire) */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                            {orderSuccess ? (
                                <div className="text-center py-20 animate-fade-in-up">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-5xl">🎉</span>
                                    </div>
                                    <h3 className="font-title text-3xl text-green-600 mb-4">Commande Validée !</h3>
                                    <p className="text-slate-600 mb-2 text-lg">Merci <strong>{formData.name}</strong>.</p>
                                    <p className="text-slate-500 mb-8">Votre commande a bien été transmise à notre équipe.</p>
                                    <div className="inline-block bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-primary font-bold animate-pulse">
                                        On vous rappelle très vite pour confirmer ! 📞
                                    </div>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <div className="text-center py-32 flex flex-col items-center">
                                    <span className="text-7xl mb-6 opacity-80">🍩</span>
                                    <h3 className="font-title text-2xl text-slate-700 mb-2">Votre panier est vide</h3>
                                    <p className="text-slate-500">Il est temps de se faire plaisir !</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-8 px-6 py-3 bg-white text-primary border-2 border-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Voir la carte
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* LISTE DES PRODUITS */}
                                    <div className="space-y-4">
                                        {cartItems.map((item, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                key={item.id}
                                                className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group"
                                            >
                                                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start pr-6">
                                                        <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="font-hand font-bold text-lg text-primary">{formatPrice(item.price * item.quantity)}</span>

                                                        {/* Contrôleur de quantité moderne */}
                                                        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                                                            <button type="button" onClick={() => removeFromCart(item.id)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded transition-all">-</button>
                                                            <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                            <button type="button" onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded transition-all">+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Bouton supprimer absolu */}
                                                <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* SÉPARATEUR */}
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                        <span className="text-slate-400 font-medium text-sm">Validation</span>
                                        <div className="h-px bg-slate-200 flex-1"></div>
                                    </div>

                                    {/* FORMULAIRE DE COMMANDE */}
                                    <form id="order-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Nom complet</label>
                                                <input required type="text" name="name" placeholder="Ex: Jean Dupont" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Téléphone</label>
                                                    <input required type="tel" name="phone" placeholder="06 12 34 56 78" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Email</label>
                                                    <input required type="email" name="email" placeholder="jean@mail.com" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* OPTION LIVRAISON DESIGN */}
                                        <div className="pt-4 border-t border-slate-100">
                                            <div
                                                onClick={() => setFormData(prev => ({ ...prev, delivery: !prev.delivery }))}
                                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${formData.delivery ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                            >
                                                <div>
                                                    <h4 className="font-bold text-slate-700">Je souhaite être livré</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">Sous réserve de validation par téléphone</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.delivery ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                    {formData.delivery && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* CHAMPS ADRESSE AVEC ANIMATION */}
                                        <AnimatePresence>
                                            {formData.delivery && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden pt-2"
                                                >
                                                    <div>
                                                        <input required type="text" name="address" placeholder="Adresse complète (Numéro et Rue)" value={formData.address} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input required type="text" name="zip" placeholder="Code Postal" value={formData.zip} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all" />
                                                        <input required type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} className="w-full bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="pt-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Heure souhaitée (De 14h à 18h)</label>
                                            <select required name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer appearance-none">
                                                <option value="" disabled>-- Choisir l'heure --</option>
                                                {availableSlots.length > 0 ? (
                                                    availableSlots.map(slot => (
                                                        <option key={slot} value={slot}>{slot}</option>
                                                    ))
                                                ) : (
                                                    <option disabled>Fermé ou trop tard pour aujourd'hui</option>
                                                )}
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* FOOTER STICKY (TOTAL & BOUTON) */}
                        {!orderSuccess && cartItems.length > 0 && (
                            <div className="flex-none p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                                <div className="flex justify-between items-end mb-4 px-2">
                                    <span className="text-slate-500 font-bold uppercase text-sm">Total à payer</span>
                                    <span className="font-title text-3xl font-bold text-slate-800">{formatPrice(getCartTotal())}</span>
                                    <span className="text-red-600">Le paiement se fait uniquement au comptoir !</span>
                                </div>
                                <button
                                    form="order-form"
                                    type="submit"
                                    disabled={isSubmitting || availableSlots.length === 0}
                                    className={`w-full py-4 rounded-xl font-title text-xl text-white shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2 ${availableSlots.length === 0 ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-primary/30'}`}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"/>
                                    ) : (
                                        <>Confirmer la commande</>
                                    )}
                                </button>
                                {availableSlots.length === 0 && <p className="text-center text-red-500 text-sm font-bold mt-3">Désolé, les commandes sont fermées pour aujourd'hui !</p>}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;