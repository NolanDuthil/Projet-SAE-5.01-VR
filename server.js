const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const app = express();
const port = 3000; // Utilisez le port 8080 ou un port spécifié par une variable d'environnement

// Configuration de multer pour le téléchargement de fichiers
const upload = multer({ dest: 'uploads/' });

// Servir les fichiers statiques depuis le dossier 'loader'
app.use(express.static('loader'));

// Route pour gérer le téléchargement et la décompression du fichier
app.post('/sae501/loader', upload.single('file'), (req, res) => {
    console.log('Requête reçue pour le téléchargement du fichier');

    const filePath = req.file.path; // Chemin du fichier temporaire
    const extractPath = path.join(__dirname, 'viewer'); // Chemin de destination pour la décompression

    console.log(`Fichier téléchargé : ${filePath}`);
    console.log(`Chemin de décompression : ${extractPath}`);

    // Lire et décompresser le fichier
    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => {
            fs.unlinkSync(filePath); // Supprime le fichier zip après extraction
            console.log('Décompression terminée');
            res.send('Fichier décompressé avec succès');
        })
        .on('error', (err) => {
            console.error('Erreur lors de la décompression', err);
            res.status(500).send('Erreur lors de la décompression');
        });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur https://mmi22-20.mmi-limoges.fr/sae501`);
});