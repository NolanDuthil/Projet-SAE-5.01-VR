const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuration de Multer pour stocker les fichiers dans le dossier "public/uploaded_images"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploaded_images/'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Utiliser le nom original du fichier
    }
});

const upload = multer({ storage: storage });

// Rendre les fichiers dans "public" accessibles
app.use(express.static(path.join(__dirname, 'public')));

// Route pour afficher la page principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route pour gérer l'upload de fichier
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier sélectionné.');
    }
    res.send('Fichier uploadé avec succès : ' + req.file.originalname);
});

// Route pour récupérer la liste des fichiers dans le dossier uploaded_images
app.get('/uploaded_files', (req, res) => {
    const directoryPath = path.join(__dirname, 'public/uploaded_images');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erreur lors de la lecture du dossier.');
        }
        res.json(files); // Renvoyer la liste des fichiers au format JSON
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});