/* eslint-env node */
console.log("1. Démarrage du script server.js...");

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

console.log("2. Modules importés avec succès.");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("3. Tentative de connexion à la base de données...");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERREUR MySQL :', err.message);
    } else {
        console.log('✅ SUCCÈS : Connecté à MySQL !');
        connection.release();
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.url.includes('categories')) {
            cb(null, 'uploads/categories/');
        }
        else {
            cb(null, 'uploads/products/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Utilisateur inconnu" });
        }

        const user = results[0];

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
});

app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY display_order ASC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        const categories = results.map(cat => ({
            ...cat,
            image_url: cat.image_url && cat.image_url.startsWith('http')
                ? cat.image_url
                : (cat.image_url ? `/uploads/categories/${cat.image_url}` : null)
        }));
        res.json(categories);
    });
});

app.post('/api/categories', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const imageFilename = req.file ? req.file.filename : null;

    if (!title) {
        return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    const slug = title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    const descToSave = description || "";

    const sql = "INSERT INTO categories (title, slug, description, image_url) VALUES (?, ?, ?, ?)";

    db.query(sql, [title, slug, descToSave, imageFilename], (err, result) => {
        if (err) {
            console.error("Erreur insertion:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, title, slug, description: descToSave, image_url: imageFilename });
    });
});

app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;

    const sqlSelect = "SELECT image_url FROM categories WHERE id = ?";

    db.query(sqlSelect, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Catégorie non trouvée" });

        const imageFilename = results[0].image_url;

        if (imageFilename) {
            const filePath = path.join(__dirname, 'uploads/categories', imageFilename);

            fs.unlink(filePath, (err) => {
                if (err) console.error("Erreur suppression image (peut-être déjà absente):", err);
                else console.log("🗑️ Image supprimée du serveur :", imageFilename);
            });
        }

        const sqlDelete = "DELETE FROM categories WHERE id = ?";
        db.query(sqlDelete, [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Catégorie et image supprimées" });
        });
    });
});

app.put('/api/categories/reorder', (req, res) => {
    const { newOrder } = req.body;

    if (!newOrder || !Array.isArray(newOrder)) {
        return res.status(400).json({ error: "Format invalide" });
    }

    const promises = newOrder.map((id, index) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE categories SET display_order = ? WHERE id = ?";
            db.query(sql, [index, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(promises)
        .then(() => res.json({ message: "Ordre mis à jour !" }))
        .catch((err) => res.status(500).json({ error: err.message }));
});


app.put('/api/categories/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const newImageFilename = req.file ? req.file.filename : null;

    const sqlSelect = "SELECT * FROM categories WHERE id = ?";

    db.query(sqlSelect, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Catégorie non trouvée" });

        const oldCategory = results[0];
        let sqlUpdate;
        let params;

        const newSlug = title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : oldCategory.slug;

        if (newImageFilename) {
            if (oldCategory.image_url) {
                const oldPath = path.join(__dirname, 'uploads/categories', oldCategory.image_url);
                fs.unlink(oldPath, (err) => {
                    if (err) console.log("Ancienne image non trouvée ou erreur suppression:", err.message);
                });
            }

            sqlUpdate = "UPDATE categories SET title = ?, slug = ?, description = ?, image_url = ? WHERE id = ?";
            params = [title, newSlug, description, newImageFilename, id];
        }
        else {
            sqlUpdate = "UPDATE categories SET title = ?, slug = ?, description = ? WHERE id = ?";
            params = [title, newSlug, description, id];
        }

        db.query(sqlUpdate, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Catégorie mise à jour avec succès" });
        });
    });
});

app.get('/api/products', (req, res) => {
    const sql = `
        SELECT p.*, c.title as category_title 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.display_order ASC, p.id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });

        const products = results.map(prod => ({
            ...prod,
            image_url: prod.image_url
                ? `/uploads/products/${prod.image_url}`
                : null
        }));
        res.json(products);
    });
});

app.post('/api/products', upload.single('image'), (req, res) => {

    const { name, description, price, category_id, is_out_of_stock, is_new, is_featured } = req.body;
    const imageFilename = req.file ? req.file.filename : null;

    if (!name || !price) {
        return res.status(400).json({ error: "Nom et prix obligatoires" });
    }

    const sql = `
        INSERT INTO products 
        (name, description, price, category_id, is_out_of_stock, is_new, is_featured, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stockVal = is_out_of_stock === 'true' ? 1 : 0;
    const newVal = is_new === 'true' ? 1 : 0;
    const featVal = is_featured === 'true' ? 1 : 0;

    db.query(sql, [name, description, price, category_id, stockVal, newVal, featVal, imageFilename], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId, message: "Produit créé !" });
    });
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, is_out_of_stock, is_new, is_featured } = req.body;
    const newImageFilename = req.file ? req.file.filename : null;

    const sqlSelect = "SELECT * FROM products WHERE id = ?";
    db.query(sqlSelect, [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: "Produit introuvable" });

        const oldProduct = results[0];
        let sqlUpdate;
        let params;

        const stockVal = is_out_of_stock === 'true' ? 1 : 0;
        const newVal = is_new === 'true' ? 1 : 0;
        const featVal = is_featured === 'true' ? 1 : 0;

        if (newImageFilename) {
            if (oldProduct.image_url) {
                const oldPath = path.join(__dirname, 'uploads/products', oldProduct.image_url);
                fs.unlink(oldPath, (e) => { if(e) console.log(e); });
            }
            sqlUpdate = `UPDATE products SET name=?, description=?, price=?, category_id=?, is_out_of_stock=?, is_new=?, is_featured=?, image_url=? WHERE id=?`;
            params = [name, description, price, category_id, stockVal, newVal, featVal, newImageFilename, id];
        } else {
            sqlUpdate = `UPDATE products SET name=?, description=?, price=?, category_id=?, is_out_of_stock=?, is_new=?, is_featured=? WHERE id=?`;
            params = [name, description, price, category_id, stockVal, newVal, featVal, id];
        }

        db.query(sqlUpdate, params, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produit mis à jour" });
        });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    db.query("SELECT image_url FROM products WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0 && results[0].image_url) {
            const filePath = path.join(__dirname, 'uploads/products', results[0].image_url);
            fs.unlink(filePath, () => {});
        }

        db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produit supprimé" });
        });
    });
});

// ROUTES POUR LES RÉGLAGES

app.get('/api/settings/saturday', (req, res) => {
    const sql = "SELECT setting_value FROM settings WHERE setting_key = 'saturday_open'";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            const isOpen = result[0].setting_value === 'true';
            return res.json({ isOpen });
        }
        return res.json({ isOpen: false });
    });
});

app.put('/api/settings/saturday', (req, res) => {
    const { isOpen } = req.body;
    const valueStr = isOpen ? 'true' : 'false';

    const sql = "UPDATE settings SET setting_value = ? WHERE setting_key = 'saturday_open'";
    db.query(sql, [valueStr], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Horaire samedi mis à jour", isOpen });
    });
});

app.get('/api/categories/:id/supplements', (req, res) => {
    const sql = "SELECT * FROM supplements WHERE category_id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/supplements', (req, res) => {
    const { category_id, name, price, icon } = req.body;
    const sql = "INSERT INTO supplements (category_id, name, price, icon) VALUES (?, ?, ?, ?)";
    db.query(sql, [category_id, name, price, icon], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, message: "Supplément ajouté" });
    });
});

app.delete('/api/supplements/:id', (req, res) => {
    const sql = "DELETE FROM supplements WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Supplément supprimé" });
    });
});


const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const analyticsClient = new BetaAnalyticsDataClient({
    keyFilename: './service-account.json',
});

const PROPERTY_ID = '522372058';

app.get('/api/analytics', async (req, res) => {
    try {
        console.log("🔍 Récupération des stats Analytics...");

        const [response] = await analyticsClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
            dimensions: [
                { name: 'date' },
            ],
            orderBys: [
                { dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }
            ]
        });

        const chartData = response.rows ? response.rows.map(row => ({
            date: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value),
            views: parseInt(row.metricValues[1].value),
        })) : [];

        const totalUsers = chartData.reduce((acc, curr) => acc + curr.users, 0);
        const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);

        console.log("✅ Stats récupérées avec succès !");

        res.json({
            success: true,
            summary: {
                users: totalUsers,
                views: totalViews,
            },
            chart: chartData
        });

    } catch (error) {
        console.error("❌ Erreur Analytics:", error.message);
        res.json({
            success: false,
            error: error.message,
            summary: { users: 0, views: 0 },
            chart: []
        });
    }
});

// --- GESTION DES HORAIRES ---
app.get('/api/hours', async (req, res) => {
    try {
        // AJOUT DE .promise() ICI 👇
        const [rows] = await db.promise().query('SELECT * FROM opening_hours ORDER BY day_order ASC');
        res.json(rows);
    } catch (error) {
        console.error("ERREUR SQL CRITIQUE dans /api/hours :", error.message);
        res.status(500).json({ error: "Erreur serveur lors de la lecture des horaires." });
    }
});

app.put('/api/hours', async (req, res) => {
    const hoursData = req.body;
    try {
        for (const day of hoursData) {
            await db.promise().query(
                'UPDATE opening_hours SET is_closed = ?, hours_text = ? WHERE id = ?',
                [day.is_closed, day.hours_text, day.id]
            );
        }
        res.json({ success: true, message: "Horaires mis à jour !" });
    } catch (error) {
        console.error("ERREUR SQL CRITIQUE (PUT /api/hours) :", error.message);
        res.status(500).json({ error: "Erreur lors de la sauvegarde des horaires." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 SUCCÈS : Serveur démarré sur http://localhost:${PORT}`);
});