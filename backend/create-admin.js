/* eslint-env node */
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Connexion avec les variables Docker
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const createAdmin = async () => {
    const username = "admin";
    const password = "missdelice"; // Ton mot de passe

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Mot de passe chiffré généré.");

        // 1. On supprime l'ancien admin s'il existe
        db.query('DELETE FROM users WHERE username = ?', [username], (err) => {
            
            // 2. On insère le nouveau (VERSION SIMPLE SANS ROLE)
            const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
            
            db.query(sql, [username, hashedPassword], (err, result) => {
                if (err) {
                    console.error("❌ Erreur :", err.message);
                } else {
                    console.log("✅ Admin créé avec succès !");
                    console.log(`👤 User: ${username}`);
                    console.log(`🔑 Pass: ${password}`);
                }
                db.end();
            });
        });
    } catch (error) {
        console.error("Erreur script:", error);
    }
};

createAdmin();