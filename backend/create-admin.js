/* eslint-env node */
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const createAdmin = async () => {
    // 👇 Modifie ici si tu veux changer le login/pass
    const username = "admin";
    const password = "missdelice";

    // On crypte le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error("❌ Erreur (Le compte existe peut-être déjà) :", err.message);
        } else {
            console.log("✅ Admin créé avec succès !");
        }
        db.end();
    });
};

createAdmin();