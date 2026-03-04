/* eslint-env node */
console.log("1. Démarrage du script server.js (Version Direct Upload Frontend)...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

dotenv.config();
const app = express();
app.use(cors());
// On dit à Express d'accepter uniquement du JSON classique
app.use(express.json()); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fonction pour supprimer l'image quand on supprime un produit (toujours utile)
const deleteImageFromSupabase = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('supabase.co')) return;
    const urlParts = imageUrl.split('/images/');
    if (urlParts.length > 1) {
        await supabase.storage.from('images').remove([urlParts[1]]);
    }
};

// ==========================================
// 🔐 AUTHENTIFICATION
// ==========================================
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const { data: user, error } = await supabase.from('users').select('*').eq('username', username).single();
    if (error || !user) return res.status(401).json({ error: "Utilisateur inconnu" });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Connexion réussie", token: token });
    } else res.status(401).json({ error: "Mot de passe incorrect" });
});

// ==========================================
// 📂 CATÉGORIES (Reçoit juste du JSON maintenant)
// ==========================================
app.get('/api/categories', async (req, res) => {
    const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (error) return res.status(500).json({ error: "Erreur serveur" });
    res.json(data);
});

app.post('/api/categories', async (req, res) => {
    try {
        const { title, description, image_url } = req.body; // image_url est envoyé par le frontend
        if (!title) return res.status(400).json({ error: "Le titre est obligatoire" });
        
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const { data, error } = await supabase.from('categories').insert([{ title, slug, description, image_url }]).select().single();
        if (error) throw error;
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const { title, description, image_url } = req.body;
        const { data: old } = await supabase.from('categories').select('*').eq('id', req.params.id).single();
        
        const newSlug = title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : old.slug;
        let updateData = { title, slug: newSlug, description };
        
        if (image_url) {
            await deleteImageFromSupabase(old.image_url);
            updateData.image_url = image_url;
        }

        const { error } = await supabase.from('categories').update(updateData).eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Catégorie mise à jour" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { data: cat } = await supabase.from('categories').select('image_url').eq('id', req.params.id).single();
        if (cat && cat.image_url) await deleteImageFromSupabase(cat.image_url);
        await supabase.from('categories').delete().eq('id', req.params.id);
        res.json({ message: "Catégorie supprimée" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 🍩 PRODUITS
// ==========================================
app.get('/api/products', async (req, res) => {
    const { data: products } = await supabase.from('products').select(`*, categories (title)`).order('display_order', { ascending: true }).order('id', { ascending: false });
    const formated = products.map(prod => ({ ...prod, category_title: prod.categories ? prod.categories.title : null }));
    formated.forEach(p => delete p.categories);
    res.json(formated);
});

app.post('/api/products', async (req, res) => {
    try {
        const { name, description, price, category_id, is_out_of_stock, is_new, is_featured, image_url } = req.body;
        const { data, error } = await supabase.from('products').insert([{
            name, description, price, category_id, is_out_of_stock, is_new, is_featured, image_url
        }]).select().single();
        if (error) throw error;
        res.json({ id: data.id, message: "Produit créé !" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, description, price, category_id, is_out_of_stock, is_new, is_featured, image_url } = req.body;
        const { data: old } = await supabase.from('products').select('*').eq('id', req.params.id).single();
        
        let updateData = { name, description, price, category_id, is_out_of_stock, is_new, is_featured };
        if (image_url) {
            await deleteImageFromSupabase(old.image_url);
            updateData.image_url = image_url;
        }

        const { error } = await supabase.from('products').update(updateData).eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Produit mis à jour" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { data: prod } = await supabase.from('products').select('image_url').eq('id', req.params.id).single();
        if (prod && prod.image_url) await deleteImageFromSupabase(prod.image_url);
        await supabase.from('products').delete().eq('id', req.params.id);
        res.json({ message: "Produit supprimé" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ⚙️ HORAIRES, REGLAGES & STATS (Inchangés)
// ==========================================
app.get('/api/settings/saturday', async (req, res) => { const { data } = await supabase.from('settings').select('setting_value').eq('setting_key', 'saturday_open').single(); res.json({ isOpen: data ? data.setting_value === 'true' : false }); });
app.put('/api/settings/saturday', async (req, res) => { await supabase.from('settings').update({ setting_value: req.body.isOpen ? 'true' : 'false' }).eq('setting_key', 'saturday_open'); res.json({ message: "Mis à jour" }); });
app.get('/api/categories/:id/supplements', async (req, res) => { const { data } = await supabase.from('supplements').select('*').eq('category_id', req.params.id); res.json(data || []); });
app.post('/api/supplements', async (req, res) => { const { data } = await supabase.from('supplements').insert([req.body]).select().single(); res.json({ id: data.id, message: "Ajouté" }); });
app.delete('/api/supplements/:id', async (req, res) => { await supabase.from('supplements').delete().eq('id', req.params.id); res.json({ message: "Supprimé" }); });
app.get('/api/hours', async (req, res) => { const { data } = await supabase.from('opening_hours').select('*').order('day_order', { ascending: true }); res.json(data || []); });
app.put('/api/hours', async (req, res) => { await Promise.all(req.body.map(day => supabase.from('opening_hours').update({ is_closed: day.is_closed, hours_text: day.hours_text }).eq('id', day.id))); res.json({ success: true }); });
app.get('/api/analytics', async (req, res) => { res.json({ success: false, error: "Désactivé temporairement pour debug", summary: { users: 0, views: 0 }, chart: [] }); });

module.exports = app;