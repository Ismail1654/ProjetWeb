const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Sert les fichiers (HTML, CSS, JS, images...)
app.use(express.static(path.join(__dirname)));

// Route par défaut (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
