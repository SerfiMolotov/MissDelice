import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar.jsx';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ category, handleDelete, handleEdit }) => {
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
                    onClick={() => handleEdit(category)}
                    className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                >
                    ✏️
                </button>

                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};


// --- COMPOSANT PRINCIPAL ---
const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // États Formulaire
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newImage, setNewImage] = useState(null);

    const [previewImage, setPreviewImage] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
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
            let url = 'http://localhost:3000/api/categories';
            let method = 'POST';

            // Si on est en mode édition, on change l'URL et la méthode
            if (editingCategory) {
                url = `http://localhost:3000/api/categories/${editingCategory.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            if (response.ok) {
                setShowModal(false);
                fetchCategories(); // Rafraîchir la liste
            } else {
                alert("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ... (handleDragEnd et handleDelete restent identiques) ...
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Sauvegarde l'ordre (appel API simplifié)
                const idsOnly = newOrder.map(item => item.id);
                fetch('http://localhost:3000/api/categories/reorder', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newOrder: idsOnly })
                }).catch(err => console.error(err));

                return newOrder;
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette catégorie ?")) return;
        try {
            await fetch(`http://localhost:3000/api/categories/${id}`, { method: 'DELETE' });
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
                        <p className="text-slate-500 mt-2">Glissez pour trier, cliquez sur le crayon pour modifier.</p>
                    </div>
                    <button
                        onClick={openCreateModal} // On appelle bien la fonction de création
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
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* --- MODALE --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold">✕</button>

                        {/* Titre dynamique : "Modifier" ou "Ajouter" */}
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
                            {/* 👇 REMPLACE TOUT CE BLOC IMAGE 👇 */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {editingCategory ? "Changer l'image (Optionnel)" : "Image"}
                                </label>

                                {/* ZONE DE PRÉVISUALISATION AJOUTÉE */}
                                {previewImage && (
                                    <div className="mb-3 w-full h-48 rounded-xl overflow-hidden border-2 border-slate-100 relative bg-slate-50">
                                        <img
                                            src={previewImage}
                                            alt="Prévisualisation"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setNewImage(null);
                                            }}
                                            className="absolute top-2 right-2 bg-white/80 text-red-500 p-1 rounded-full hover:bg-white font-bold shadow-sm"
                                            title="Supprimer l'image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange} /* 👈 IMPORTANT : On appelle la fonction ici */
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl mt-4 transition-colors">
                                {editingCategory ? "Enregistrer les modifications" : "Créer la catégorie"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;