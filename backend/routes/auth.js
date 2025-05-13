const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware do weryfikacji tokenu
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Brak tokenu' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Błąd weryfikacji tokenu:', err.message);
            return res.status(403).json({ error: 'Nieprawidłowy token' });
        }
        req.user = user;
        next();
    });
};

// Rejestracja
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Brak nazwy użytkownika lub hasła' });
    }

    try {
        const checkUserSql = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUserSql, [username], async (err, results) => {
            if (err) {
                console.error('Błąd bazy danych (rejestracja):', err.message);
                return res.status(500).json({ error: 'Błąd bazy danych' });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: 'Użytkownik już istnieje' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(sql, [username, hashedPassword], (err) => {
                if (err) {
                    console.error('Błąd bazy danych (wstawianie użytkownika):', err.message);
                    return res.status(500).json({ error: 'Błąd bazy danych' });
                }
                res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });
            });
        });
    } catch (error) {
        console.error('Błąd serwera (rejestracja):', error.message);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// Logowanie
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Brak nazwy użytkownika lub hasła' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Błąd bazy danych (logowanie):', err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Nieprawidłowe hasło' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, username: user.username });
    });
});

module.exports = router;
