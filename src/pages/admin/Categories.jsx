import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar.jsx';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ category, handleDelete, handleEdit, handleManageSupplements }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow cursor-default select-none relative"
        >
            {/* Poignée Drag & Drop */}
            <div {...attributes} {...listeners} className="text-slate-300 hover:text-primary cursor-grab active:cursor-grabbing px-2" title="Déplacer">
                ⠿
            </div>

            {/* Image */}
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                {category.image_url ? (
                    <img src={category.image_url} alt={category.title} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Img</div>
                )}
            </div>

            <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-lg text-slate-800 truncate">{category.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{category.description}</p>
            </div>

            <div className="flex flex-col gap-1">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleManageSupplements(category)}
                    className="p-2 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Gérer les suppléments"
                >
                    Supléments
                </button>

                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleEdit(category)}
                    className="p-2 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                >
                    Modifier
                </button>

                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL ---
const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // États Modale Catégorie (Création/Edition)
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // --- NOUVEAUX ÉTATS POUR LES SUPPLÉMENTS ---
    const [showSupplementsModal, setShowSupplementsModal] = useState(false);
    const [selectedCategoryForSupp, setSelectedCategoryForSupp] = useState(null);
    const [supplementsList, setSupplementsList] = useState([]);
    // Formulaire d'ajout rapide de supplément
    const [newSuppName, setNewSuppName] = useState('');
    const [newSuppPrice, setNewSuppPrice] = useState('');
    const [newSuppIcon, setNewSuppIcon] = useState('🍫');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- LOGIQUE MODALE CATÉGORIE ---
    const openEditModal = (category) => {
        setEditingCategory(category);
        setNewTitle(category.title);
        setNewDescription(category.description || '');
        setNewImage(null);
        setPreviewImage(category.image_url);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setNewTitle('');
        setNewDescription('');
        setNewImage(null);
        setPreviewImage(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('description', newDescription);
        if (newImage) formData.append('image', newImage);

        try {
            let url = '/api/categories';
            let method = 'POST';
            if (editingCategory) {
                url = `/api/categories/${editingCategory.id}`;
                method = 'PUT';
            }
            const response = await fetch(url, { method: method, body: formData });
            if (response.ok) {
                setShowModal(false);
                fetchCategories();
            } else {
                alert("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- LOGIQUE GESTION SUPPLÉMENTS ---

    const openSupplementsModal = async (category) => {
        setSelectedCategoryForSupp(category);
        setNewSuppName('');
        setNewSuppPrice('');
        setNewSuppIcon('🍫');

        // Fetch des suppléments existants
        try {
            const res = await fetch(`/api/categories/${category.id}/supplements`);
            const data = await res.json();
            setSupplementsList(data);
            setShowSupplementsModal(true);
        } catch (error) {
            console.error("Erreur chargement suppléments", error);
        }
    };

    // 2. Ajouter un supplément
    const handleAddSupplement = async (e) => {
        e.preventDefault();
        if (!selectedCategoryForSupp) return;

        try {
            const res = await fetch('/api/supplements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_id: selectedCategoryForSupp.id,
                    name: newSuppName,
                    price: parseFloat(newSuppPrice),
                    icon: newSuppIcon
                })
            });

            if (res.ok) {
                // Recharger la liste
                const updatedRes = await fetch(`/api/categories/${selectedCategoryForSupp.id}/supplements`);
                const updatedData = await updatedRes.json();
                setSupplementsList(updatedData);
                // Reset form
                setNewSuppName('');
                setNewSuppPrice('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 3. Supprimer un supplément
    const handleDeleteSupplement = async (suppId) => {
        if(!window.confirm("Supprimer ce supplément ?")) return;
        try {
            await fetch(`/api/supplements/${suppId}`, { method: 'DELETE' });
            // Mise à jour locale pour éviter un fetch
            setSupplementsList(prev => prev.filter(s => s.id !== suppId));
        } catch (error) {
            console.error(error);
        }
    };


    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                const idsOnly = newOrder.map(item => item.id);
                fetch('/api/categories/reorder', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newOrder: idsOnly })
                }).catch(err => console.error(err));
                return newOrder;
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette catégorie ? (Les suppléments liés seront aussi supprimés)")) return;
        try {
            await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body flex">
            <AdminSidebar />

            <div className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="font-title text-3xl md:text-4xl font-extrabold text-slate-800">
                            Mes <span className="text-primary">Catégories</span>
                        </h1>
                        <p className="text-slate-500 mt-2">Glissez pour trier.</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <span>+</span> Nouvelle Catégorie
                    </button>
                </div>

                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={categories.map(c => c.id)} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((cat) => (
                                    <SortableItem
                                        key={cat.id}
                                        category={cat}
                                        handleDelete={handleDelete}
                                        handleEdit={openEditModal}
                                        handleManageSupplements={openSupplementsModal}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* --- MODALE CRÉATION/EDITION CATÉGORIE --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>

                        <h2 className="font-title text-2xl font-bold text-slate-800 mb-6">
                            {editingCategory ? `Modifier "${editingCategory.title}"` : "Ajouter une catégorie"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Titre</label>
                                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {editingCategory ? "Changer l'image (Optionnel)" : "Image"}
                                </label>
                                {previewImage && (
                                    <div className="mb-3 w-full h-48 rounded-xl overflow-hidden border-2 border-slate-100 relative bg-slate-50">
                                        <img src={previewImage} alt="Prévisualisation" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setPreviewImage(null); setNewImage(null); }} className="absolute top-2 right-2 bg-white/80 text-red-500 p-1 rounded-full hover:bg-white font-bold shadow-sm">✕</button>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                                {editingCategory ? "Enregistrer les modifications" : "Créer la catégorie"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- NOUVELLE MODALE : GESTION DES SUPPLÉMENTS --- */}
            {showSupplementsModal && selectedCategoryForSupp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative flex flex-col max-h-[90vh]">
                        <button onClick={() => setShowSupplementsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>

                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="font-title text-2xl font-bold text-slate-800">
                                Suppléments pour <span className="text-primary">{selectedCategoryForSupp.title}</span>
                            </h2>
                            <p className="text-sm text-slate-500">Ajoutez ici les options (ex: Chantilly, Nutella...)</p>
                        </div>

                        {/* LISTE DES SUPPLÉMENTS EXISTANTS */}
                        <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-2">
                            {supplementsList.length === 0 ? (
                                <p className="text-center text-slate-400 py-4 italic">Aucun supplément pour le moment.</p>
                            ) : (
                                supplementsList.map(supp => (
                                    <div key={supp.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{supp.icon}</span>
                                            <div>
                                                <p className="font-bold text-slate-700">{supp.name}</p>
                                                <p className="text-xs text-primary font-bold">{parseFloat(supp.price).toFixed(2)} €</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteSupplement(supp.id)}
                                            className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                                            title="Supprimer"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* FORMULAIRE D'AJOUT */}
                        <form onSubmit={handleAddSupplement} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Ajouter un nouveau</h3>
                            <div className="grid grid-cols-4 gap-3 mb-3">
                                <div className="col-span-1">
                                    <input
                                        type="text"
                                        placeholder="Emoji"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-center"
                                        value={newSuppIcon}
                                        onChange={e => setNewSuppIcon(e.target.value)}
                                        maxLength="2"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <input
                                        type="text"
                                        placeholder="Nom (ex: Nutella)"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                        value={newSuppName}
                                        onChange={e => setNewSuppName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Prix (ex: 0.50)"
                                    className="w-1/2 px-3 py-2 rounded-lg border border-slate-200"
                                    value={newSuppPrice}
                                    onChange={e => setNewSuppPrice(e.target.value)}
                                    required
                                />
                                <button type="submit" className="w-1/2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors">
                                    Ajouter +
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;