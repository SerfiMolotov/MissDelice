/* eslint-env node */
console.log("1. Démarrage du script server.js (Version Supabase)...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gardé par sécurité si tu as encore de vieilles images en local
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("2. Modules importés. Connexion à Supabase...");

// Initialisation de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ==========================================
// 🚀 GESTION DES IMAGES (SPÉCIAL VERCEL & SUPABASE)
// ==========================================
// On utilise la mémoire RAM au lieu du disque dur, car Vercel n'a pas de disque dur persistant
const upload = multer({ storage: multer.memoryStorage() });

// Fonction utilitaire pour envoyer une image vers Supabase Storage
const uploadImageToSupabase = async (file, folder) => {
    if (!file) return null;
    
    // Création d'un nom de fichier unique (ex: products/16789...-churros.jpg)
    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // Upload dans le bucket nommé 'images'
    const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw new Error("Erreur d'upload image: " + error.message);

    // On récupère le lien public complet
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
    return urlData.publicUrl;
};

// Fonction utilitaire pour supprimer une image de Supabase Storage
const deleteImageFromSupabase = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('supabase.co')) return;
    
    // On extrait le chemin interne (après le /images/)
    const urlParts = imageUrl.split('/images/');
    if (urlParts.length > 1) {
        const path = urlParts[1];
        await supabase.storage.from('images').remove([path]);
    }
};


// ==========================================
// 🔐 AUTHENTIFICATION
// ==========================================
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !user) {
        return res.status(401).json({ error: "Utilisateur inconnu" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ message: "Connexion réussie", token: token });
    } else {
        res.status(401).json({ error: "Mot de passe incorrect" });
    }
});

// ==========================================
// 📂 CATÉGORIES
// ==========================================
app.get('/api/categories', async (req, res) => {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) return res.status(500).json({ error: "Erreur serveur" });

    // On reformate pour garder la compatibilité avec ton frontend actuel
    const formatedCategories = categories.map(cat => ({
        ...cat,
        image_url: cat.image_url && cat.image_url.startsWith('http')
            ? cat.image_url
            : (cat.image_url ? `/uploads/categories/${cat.image_url}` : null)
    }));

    res.json(formatedCategories);
});

app.post('/api/categories', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Le titre est obligatoire" });

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    try {
        const imageUrl = await uploadImageToSupabase(req.file, 'categories');

        const { data, error } = await supabase.from('categories').insert([{
            title, 
            slug, 
            description: description || "", 
            image_url: imageUrl
        }]).select().single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: cat } = await supabase.from('categories').select('image_url').eq('id', id).single();
        if (cat && cat.image_url) {
            await deleteImageFromSupabase(cat.image_url);
        }

        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Catégorie supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/reorder', async (req, res) => {
    const { newOrder } = req.body;
    if (!newOrder || !Array.isArray(newOrder)) return res.status(400).json({ error: "Format invalide" });

    try {
        const promises = newOrder.map((id, index) => 
            supabase.from('categories').update({ display_order: index }).eq('id', id)
        );
        await Promise.all(promises);
        res.json({ message: "Ordre mis à jour !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const { data: oldCategory } = await supabase.from('categories').select('*').eq('id', id).single();
        if (!oldCategory) return res.status(404).json({ error: "Catégorie non trouvée" });

        const newSlug = title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : oldCategory.slug;
        let updateData = { title, slug: newSlug, description };

        if (req.file) {
            await deleteImageFromSupabase(oldCategory.image_url);
            updateData.image_url = await uploadImageToSupabase(req.file, 'categories');
        }

        const { error } = await supabase.from('categories').update(updateData).eq('id', id);
        if (error) throw error;
        res.json({ message: "Catégorie mise à jour avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 🍩 PRODUITS
// ==========================================
app.get('/api/products', async (req, res) => {
    // Equivalent du LEFT JOIN en Supabase
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (title)
        `)
        .order('display_order', { ascending: true })
        .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: "Erreur serveur" });

    // On reformate pour le frontend
    const formatedProducts = products.map(prod => ({
        ...prod,
        category_title: prod.categories ? prod.categories.title : null,
        image_url: prod.image_url && prod.image_url.startsWith('http')
            ? prod.image_url
            : (prod.image_url ? `/uploads/products/${prod.image_url}` : null)
    }));
    
    // Nettoyage de l'objet imbriqué créé par Supabase
    formatedProducts.forEach(p => delete p.categories);

    res.json(formatedProducts);
});

app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, description, price, category_id, is_out_of_stock, is_new, is_featured } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Nom et prix obligatoires" });

    try {
        const imageUrl = await uploadImageToSupabase(req.file, 'products');

        const { data, error } = await supabase.from('products').insert([{
            name, 
            description, 
            price, 
            category_id, 
            is_out_of_stock: is_out_of_stock === 'true', 
            is_new: is_new === 'true', 
            is_featured: is_featured === 'true', 
            image_url: imageUrl
        }]).select().single();

        if (error) throw error;
        res.json({ id: data.id, message: "Produit créé !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, is_out_of_stock, is_new, is_featured } = req.body;

    try {
        const { data: oldProduct } = await supabase.from('products').select('*').eq('id', id).single();
        if (!oldProduct) return res.status(404).json({ error: "Produit introuvable" });

        let updateData = {
            name, 
            description, 
            price, 
            category_id,
            is_out_of_stock: is_out_of_stock === 'true',
            is_new: is_new === 'true',
            is_featured: is_featured === 'true'
        };

        if (req.file) {
            await deleteImageFromSupabase(oldProduct.image_url);
            updateData.image_url = await uploadImageToSupabase(req.file, 'products');
        }

        const { error } = await supabase.from('products').update(updateData).eq('id', id);
        if (error) throw error;
        res.json({ message: "Produit mis à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { data: prod } = await supabase.from('products').select('image_url').eq('id', req.params.id).single();
        if (prod && prod.image_url) {
            await deleteImageFromSupabase(prod.image_url);
        }

        const { error } = await supabase.from('products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Produit supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ⚙️ RÉGLAGES
// ==========================================
app.get('/api/settings/saturday', async (req, res) => {
    try {
        const { data, error } = await supabase.from('settings').select('setting_value').eq('setting_key', 'saturday_open').single();
        if (error || !data) return res.json({ isOpen: false });
        res.json({ isOpen: data.setting_value === 'true' });
    } catch (err) {
        res.json({ isOpen: false });
    }
});

app.put('/api/settings/saturday', async (req, res) => {
    const { isOpen } = req.body;
    const { error } = await supabase
        .from('settings')
        .update({ setting_value: isOpen ? 'true' : 'false' })
        .eq('setting_key', 'saturday_open');
        
    if (error) return res.status(500).json(error);
    res.json({ message: "Horaire samedi mis à jour", isOpen });
});

// ==========================================
// ✨ SUPPLÉMENTS
// ==========================================
app.get('/api/categories/:id/supplements', async (req, res) => {
    const { data, error } = await supabase.from('supplements').select('*').eq('category_id', req.params.id);
    if (error) return res.status(500).json(error);
    res.json(data);
});

app.post('/api/supplements', async (req, res) => {
    const { category_id, name, price, icon } = req.body;
    const { data, error } = await supabase.from('supplements').insert([{ category_id, name, price, icon }]).select().single();
    if (error) return res.status(500).json(error);
    res.json({ id: data.id, message: "Supplément ajouté" });
});

app.delete('/api/supplements/:id', async (req, res) => {
    const { error } = await supabase.from('supplements').delete().eq('id', req.params.id);
    if (error) return res.status(500).json(error);
    res.json({ message: "Supplément supprimé" });
});

// ==========================================
// 📊 ANALYTICS
// ==========================================
const analyticsClient = new BetaAnalyticsDataClient({
    keyFilename: './service-account.json',
});
const PROPERTY_ID = '522372058';

app.get('/api/analytics', async (req, res) => {
    try {
        const [response] = await analyticsClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
            dimensions: [{ name: 'date' }],
            orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }]
        });

        const chartData = response.rows ? response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value),
            views: parseInt(row.metricValues[1].value),
        })) : [];

        const totalUsers = chartData.reduce((acc, curr) => acc + curr.users, 0);
        const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);

        res.json({ success: true, summary: { users: totalUsers, views: totalViews }, chart: chartData });
    } catch (error) {
        res.json({ success: false, error: error.message, summary: { users: 0, views: 0 }, chart: [] });
    }
});

// ==========================================
// 🕒 HORAIRES
// ==========================================
app.get('/api/hours', async (req, res) => {
    try {
        const { data, error } = await supabase.from('opening_hours').select('*').order('day_order', { ascending: true });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la lecture des horaires." });
    }
});

app.put('/api/hours', async (req, res) => {
    const hoursData = req.body;
    try {
        const promises = hoursData.map(day => 
            supabase.from('opening_hours').update({ is_closed: day.is_closed, hours_text: day.hours_text }).eq('id', day.id)
        );
        await Promise.all(promises);
        res.json({ success: true, message: "Horaires mis à jour !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la sauvegarde des horaires." });
    }
});

// ==========================================
// 🚀 DÉMARRAGE DU SERVEUR
// ==========================================

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Serveur local démarré sur http://localhost:${PORT}`);
    });
}

// 2. Export de l'application pour Vercel (Mode Serverless)
module.exports = app;

module.exports.config = {
    api: {
        bodyParser: false,
    },
};