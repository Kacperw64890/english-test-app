const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rejestracja tras
app.use('/auth', authRoutes);
app.use('/test', testRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
