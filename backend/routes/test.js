const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

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

// Endpoint: Zapisz wynik testu
router.post('/save-result', verifyToken, (req, res) => {
    const { score } = req.body;

    console.log('Użytkownik z tokenu:', req.user);
    console.log('Przesłany wynik:', score);

    if (score === undefined) {
        console.error('Brak wyniku w żądaniu');
        return res.status(400).json({ error: 'Brak wyniku do zapisania' });
    }

    const sql = 'INSERT INTO test_results (user_id, score, date) VALUES (?, ?, NOW())';
    db.query(sql, [req.user.id, score], (err) => {
        if (err) {
            console.error('Błąd bazy danych (zapis wyniku):', err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }
        console.log('Wynik został zapisany do bazy:', { user_id: req.user.id, score });
        res.status(201).json({ message: 'Wynik zapisany pomyślnie' });
    });
});

// Endpoint: Pobierz wyniki użytkownika
router.get('/results', verifyToken, (req, res) => {
    console.log('Użytkownik z tokenu:', req.user);

    const sql = 'SELECT score, date FROM test_results WHERE user_id = ? ORDER BY date DESC';
    db.query(sql, [req.user.id], (err, results) => {
        if (err) {
            console.error('Błąd bazy danych (pobieranie wyników):', err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }
        console.log('Wyniki użytkownika zostały pobrane:', results);
        res.status(200).json({ results });
    });
});

module.exports = router;
