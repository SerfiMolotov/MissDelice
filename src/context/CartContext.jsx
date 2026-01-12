import React, { createContext, useState, useEffect, useContext } from 'react';

// Création du Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // On charge le panier depuis le stockage local (si il existe)
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('missdelice_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // À chaque changement du panier, on sauvegarde dans le navigateur
    useEffect(() => {
        localStorage.setItem('missdelice_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Ajouter un produit
    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Est-ce que le produit est déjà dans le panier ?
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // Si oui, on augmente la quantité (+1)
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Sinon, on l'ajoute avec quantité 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        // Optionnel : Ouvrir le panier automatiquement quand on ajoute
        // setIsCartOpen(true);
    };

    // Retirer un produit (ou diminuer quantité)
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productId);

            if (existingItem.quantity === 1) {
                // Si quantité 1, on le supprime
                return prevItems.filter(item => item.id !== productId);
            } else {
                // Sinon on décrémente
                return prevItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
        });
    };

    // Vider le panier (après commande réussie)
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('missdelice_cart');
    };

    // Calcul du Total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    };

    // Calcul du nombre d'articles (pour la bulle rouge sur l'icône)
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personnalisé pour utiliser le panier facilement partout
export const useCart = () => useContext(CartContext);

