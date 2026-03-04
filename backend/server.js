/* eslint-env node */
console.log("1. Démarrage du script server.js (Version Supabase/Vercel avec Multiparty)...");

const multiparty = require('multiparty');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 🔌 INITIALISATION SUPABASE
// ==========================================
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error("❌ ERREUR CRITIQUE : Variables SUPABASE manquantes dans l'environnement !");
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ==========================================
// 📊 GOOGLE ANALYTICS (Sécurisé anti-crash)
// ==========================================
let analyticsClient = null;
const PROPERTY_ID = '522372058';

try {
    const serviceAccountPath = path.join(__dirname, 'service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
        analyticsClient = new BetaAnalyticsDataClient({ keyFilename: serviceAccountPath });
        console.log("✅ Analytics configuré.");
    } else {
        console.log("⚠️ Fichier service-account.json absent. Analytics désactivé.");
    }
} catch (e) {
    console.log("⚠️ Erreur initialisation Analytics :", e.message);
}

// ==========================================
// 🚀 GESTION DES IMAGES (SPÉCIAL VERCEL avec MULTIPARTY)
// ==========================================
const uploadImageToSupabase = async (filePath, originalName, mimeType, folder) => {
    if (!filePath) return null;
    
    const fileName = `${folder}/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    console.log(`[STEP 1] Lecture asynchrone de : ${filePath}`);

    try {
        // 1. Lecture asynchrone (empêche Vercel de tuer le processus pour "timeout")
        const buffer = await fs.promises.readFile(filePath);
        console.log(`[STEP 2] Fichier lu (${buffer.length} octets). Conversion en Web Buffer...`);

        // 2. LA MAGIE POUR VERCEL : On force le format ArrayBuffer Web natif
        const arrayBuffer = new Uint8Array(buffer).buffer;
        console.log(`[STEP 3] Conversion réussie ! Envoi vers Supabase...`);

        // 3. Envoi sur le Cloud
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, arrayBuffer, {
                contentType: mimeType,
                upsert: false
            });

        if (error) {
            console.error("❌ [STEP 4] Supabase a refusé l'image :", error);
            throw error;
        }

        console.log(`[STEP 5] Upload 100% terminé ! Génération du lien public...`);
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        
        // Nettoyage propre
        await fs.promises.unlink(filePath).catch(() => {});
        
        return urlData.publicUrl;
    } catch (err) {
        // Si Vercel plante ici, on verra toute la pile d'erreur (stack trace)
        console.error("🔥 [CRASH FATAL] Erreur uploadImageToSupabase :", err.stack || err);
        throw err;
    }
};

const deleteImageFromSupabase = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('supabase.co')) return;
    const urlParts = imageUrl.split('/images/');
    if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('images').remove([filePath]);
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
    } else {
        res.status(401).json({ error: "Mot de passe incorrect" });
    }
});

// ==========================================
// 📂 CATÉGORIES
// ==========================================
app.get('/api/categories', async (req, res) => {
    const { data: categories, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (error) return res.status(500).json({ error: "Erreur serveur" });

    const formatedCategories = categories.map(cat => ({
        ...cat,
        image_url: cat.image_url && cat.image_url.startsWith('http') ? cat.image_url : (cat.image_url ? `/uploads/categories/${cat.image_url}` : null)
    }));
    res.json(formatedCategories);
});

app.post('/api/categories', async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            const title = fields.title ? fields.title[0] : null;
            const description = fields.description ? fields.description[0] : "";
            
            if (!title) return res.status(400).json({ error: "Le titre est obligatoire" });
            const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            let imageUrl = null;
            if (files.image && files.image.length > 0) {
                const f = files.image[0];
                imageUrl = await uploadImageToSupabase(f.path, f.originalFilename, f.headers['content-type'], 'categories');
            }

            const { data, error } = await supabase.from('categories').insert([{ title, slug, description, image_url: imageUrl }]).select().single();
            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error("🔥 ERREUR POST CATEGORIE:", error);
            res.status(500).json({ error: error.message });
        }
    });
});

app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            const title = fields.title ? fields.title[0] : null;
            const description = fields.description ? fields.description[0] : "";

            const { data: oldCategory } = await supabase.from('categories').select('*').eq('id', id).single();
            if (!oldCategory) return res.status(404).json({ error: "Catégorie non trouvée" });

            const newSlug = title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : oldCategory.slug;
            let updateData = { title, slug: newSlug, description };

            if (files.image && files.image.length > 0) {
                const f = files.image[0];
                await deleteImageFromSupabase(oldCategory.image_url);
                updateData.image_url = await uploadImageToSupabase(f.path, f.originalFilename, f.headers['content-type'], 'categories');
            }

            const { error } = await supabase.from('categories').update(updateData).eq('id', id);
            if (error) throw error;
            res.json({ message: "Catégorie mise à jour avec succès" });
        } catch (error) {
            console.error("🔥 ERREUR PUT CATEGORIE:", error);
            res.status(500).json({ error: error.message });
        }
    });
});

app.put('/api/categories/reorder', async (req, res) => {
    const { newOrder } = req.body;
    try {
        const promises = newOrder.map((id, index) => supabase.from('categories').update({ display_order: index }).eq('id', id));
        await Promise.all(promises);
        res.json({ message: "Ordre mis à jour !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { data: cat } = await supabase.from('categories').select('image_url').eq('id', req.params.id).single();
        if (cat && cat.image_url) await deleteImageFromSupabase(cat.image_url);
        const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Catégorie supprimée" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 🍩 PRODUITS
// ==========================================
app.get('/api/products', async (req, res) => {
    const { data: products, error } = await supabase.from('products').select(`*, categories (title)`).order('display_order', { ascending: true }).order('id', { ascending: false });
    if (error) return res.status(500).json({ error: "Erreur serveur" });

    const formatedProducts = products.map(prod => ({
        ...prod,
        category_title: prod.categories ? prod.categories.title : null,
        image_url: prod.image_url && prod.image_url.startsWith('http') ? prod.image_url : (prod.image_url ? `/uploads/products/${prod.image_url}` : null)
    }));
    formatedProducts.forEach(p => delete p.categories);
    res.json(formatedProducts);
});

app.post('/api/products', async (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            const name = fields.name ? fields.name[0] : null;
            const price = fields.price ? fields.price[0] : null;
            const description = fields.description ? fields.description[0] : "";
            const category_id = fields.category_id ? fields.category_id[0] : null;
            const is_out_of_stock = fields.is_out_of_stock ? fields.is_out_of_stock[0] : 'false';
            const is_new = fields.is_new ? fields.is_new[0] : 'false';
            const is_featured = fields.is_featured ? fields.is_featured[0] : 'false';

            if (!name || !price) return res.status(400).json({ error: "Nom et prix obligatoires" });

            let imageUrl = null;
            if (files.image && files.image.length > 0) {
                const f = files.image[0];
                imageUrl = await uploadImageToSupabase(f.path, f.originalFilename, f.headers['content-type'], 'products');
            }

            const { data, error } = await supabase.from('products').insert([{
                name, description, price, category_id, 
                is_out_of_stock: is_out_of_stock === 'true', is_new: is_new === 'true', is_featured: is_featured === 'true', 
                image_url: imageUrl
            }]).select().single();

            if (error) throw error;
            res.json({ id: data.id, message: "Produit créé !" });
        } catch (error) {
            console.error("🔥 ERREUR POST PRODUIT:", error);
            res.status(500).json({ error: error.message });
        }
    });
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            const name = fields.name ? fields.name[0] : null;
            const price = fields.price ? fields.price[0] : null;
            const description = fields.description ? fields.description[0] : "";
            const category_id = fields.category_id ? fields.category_id[0] : null;
            const is_out_of_stock = fields.is_out_of_stock ? fields.is_out_of_stock[0] : 'false';
            const is_new = fields.is_new ? fields.is_new[0] : 'false';
            const is_featured = fields.is_featured ? fields.is_featured[0] : 'false';

            const { data: oldProduct } = await supabase.from('products').select('*').eq('id', id).single();
            if (!oldProduct) return res.status(404).json({ error: "Produit introuvable" });

            let updateData = { name, description, price, category_id, is_out_of_stock: is_out_of_stock === 'true', is_new: is_new === 'true', is_featured: is_featured === 'true' };

            if (files.image && files.image.length > 0) {
                const f = files.image[0];
                await deleteImageFromSupabase(oldProduct.image_url);
                updateData.image_url = await uploadImageToSupabase(f.path, f.originalFilename, f.headers['content-type'], 'products');
            }

            const { error } = await supabase.from('products').update(updateData).eq('id', id);
            if (error) throw error;
            res.json({ message: "Produit mis à jour" });
        } catch (error) {
            console.error("🔥 ERREUR PUT PRODUIT:", error);
            res.status(500).json({ error: error.message });
        }
    });
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { data: prod } = await supabase.from('products').select('image_url').eq('id', req.params.id).single();
        if (prod && prod.image_url) await deleteImageFromSupabase(prod.image_url);
        const { error } = await supabase.from('products').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: "Produit supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// ⚙️ RÉGLAGES & SUPPLÉMENTS & HORAIRES
// ==========================================
app.get('/api/settings/saturday', async (req, res) => {
    try {
        const { data, error } = await supabase.from('settings').select('setting_value').eq('setting_key', 'saturday_open').single();
        res.json({ isOpen: data ? data.setting_value === 'true' : false });
    } catch (err) { res.json({ isOpen: false }); }
});
app.put('/api/settings/saturday', async (req, res) => {
    const { error } = await supabase.from('settings').update({ setting_value: req.body.isOpen ? 'true' : 'false' }).eq('setting_key', 'saturday_open');
    if (error) return res.status(500).json(error);
    res.json({ message: "Horaire mis à jour", isOpen: req.body.isOpen });
});

app.get('/api/categories/:id/supplements', async (req, res) => {
    const { data } = await supabase.from('supplements').select('*').eq('category_id', req.params.id);
    res.json(data || []);
});
app.post('/api/supplements', async (req, res) => {
    const { data, error } = await supabase.from('supplements').insert([req.body]).select().single();
    if (error) return res.status(500).json(error);
    res.json({ id: data.id, message: "Supplément ajouté" });
});
app.delete('/api/supplements/:id', async (req, res) => {
    await supabase.from('supplements').delete().eq('id', req.params.id);
    res.json({ message: "Supplément supprimé" });
});

app.get('/api/hours', async (req, res) => {
    const { data } = await supabase.from('opening_hours').select('*').order('day_order', { ascending: true });
    res.json(data || []);
});
app.put('/api/hours', async (req, res) => {
    try {
        await Promise.all(req.body.map(day => supabase.from('opening_hours').update({ is_closed: day.is_closed, hours_text: day.hours_text }).eq('id', day.id)));
        res.json({ success: true, message: "Horaires mis à jour !" });
    } catch (error) { res.status(500).json({ error: "Erreur horaires." }); }
});

// ==========================================
// 📊 ANALYTICS ROUTE
// ==========================================
app.get('/api/analytics', async (req, res) => {
    if (!analyticsClient) {
        return res.json({ success: false, error: "Analytics désactivé sur le serveur.", summary: { users: 0, views: 0 }, chart: [] });
    }
    try {
        const [response] = await analyticsClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
            dimensions: [{ name: 'date' }],
            orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }]
        });
        const chartData = response.rows ? response.rows.map(row => ({ date: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value), views: parseInt(row.metricValues[1].value) })) : [];
        res.json({ success: true, summary: { users: chartData.reduce((a, c) => a + c.users, 0), views: chartData.reduce((a, c) => a + c.views, 0) }, chart: chartData });
    } catch (error) {
        res.json({ success: false, error: error.message, summary: { users: 0, views: 0 }, chart: [] });
    }
});

// ==========================================
// 🚀 DÉMARRAGE DU SERVEUR & CONFIG VERCEL
// ==========================================
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Serveur local démarré sur http://localhost:${PORT}`);
    });
}

// Configuration Vercel Serverless
module.exports = app;
module.exports.config = {
    api: { bodyParser: false },
};