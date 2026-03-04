import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar.jsx';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);

    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);

            const productsData = await productsRes.json();
            const categoriesData = await categoriesRes.json();

            setProducts(productsData);
            setCategories(categoriesData);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingProduct(null);
        // Reset des champs
        setName('');
        setDescription('');
        setPrice('');
        setCategoryId(''); // Rien sélectionné par défaut
        setIsOutOfStock(false);
        setIsNew(false);
        setIsFeatured(false);
        setImage(null);
        setPreviewImage(null);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        // Remplissage avec les infos existantes
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price);
        setCategoryId(product.category_id || '');

        setIsOutOfStock(product.is_out_of_stock === 1);
        setIsNew(product.is_new === 1);
        setIsFeatured(product.is_featured === 1);

        setImage(null);
        setPreviewImage(product.image_url);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category_id', categoryId);

        formData.append('is_out_of_stock', isOutOfStock);
        formData.append('is_new', isNew);
        formData.append('is_featured', isFeatured);

        if (image) formData.append('image', image);

        try {
            let url = '/api/products';
            let method = 'POST';

            if (editingProduct) {
                url = `/api/products/${editingProduct.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                setShowModal(false);
                fetchData(); // Tout recharger
            } else {
                alert("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce produit ?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body flex">
            <AdminSidebar />

            <div className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="font-title text-3xl md:text-4xl font-extrabold text-slate-800">
                            Mes <span className="text-primary">Produits</span>
                        </h1>
                        <p className="text-slate-500 mt-2">Gérez votre carte, les prix et les stocks.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <span>+</span> Nouveau Produit
                    </button>
                </div>

                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:shadow-md transition-all relative">

                                <div className="h-40 rounded-xl bg-slate-100 overflow-hidden relative">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Img</div>
                                    )}

                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {product.is_out_of_stock === 1 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                RUPTURE
                                            </span>
                                        )}
                                        {product.is_new === 1 && (
                                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                NOUVEAU
                                            </span>
                                        )}
                                        {product.is_featured === 1 && (
                                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                ★ PÉPITE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                                                {product.category_title || "Sans catégorie"}
                                            </span>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight">{product.name}</h3>
                                        </div>
                                        <span className="font-title font-bold text-primary text-lg">
                                            {product.price}€
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                                </div>

                                <div className="flex gap-2 border-t border-slate-50 pt-3 mt-auto">
                                    <button onClick={() => openEditModal(product)} className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors">
                                        Modifier
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative my-10">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>

                        <h2 className="font-title text-2xl font-bold text-slate-800 mb-6">
                            {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" required />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Prix</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full pl-4 pr-8 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
            €
        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Catégorie</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                >
                                    <option value="">-- Choisir une catégorie --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows="3" />
                            </div>

                            <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={isOutOfStock} onChange={(e) => setIsOutOfStock(e.target.checked)} className="w-5 h-5 accent-red-500" />
                                    <span className="text-sm font-bold text-slate-600">Rupture de stock</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="w-5 h-5 accent-blue-500" />
                                    <span className="text-sm font-bold text-slate-600">Nouveauté</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 accent-yellow-400" />
                                    <span className="text-sm font-bold text-slate-600">Pépite (Accueil)</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {editingProduct ? "Changer l'image (Optionnel)" : "Image"}
                                </label>

                                {previewImage && (
                                    <div className="mb-3 w-full h-48 rounded-xl overflow-hidden border-2 border-slate-100 relative bg-slate-50">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setPreviewImage(null); setImage(null); }} className="absolute top-2 right-2 bg-white/80 text-red-500 p-1 rounded-full hover:bg-white font-bold shadow-sm">✕</button>
                                    </div>
                                )}

                                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                                {editingProduct ? "Enregistrer les modifications" : "Ajouter le produit"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;