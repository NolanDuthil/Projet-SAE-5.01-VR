const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Servir les fichiers statiques depuis le dossier 'loader'
app.use(express.static('loader'));

// Route pour gérer le téléchargement et la décompression du fichier
app.post('/sae501/loader', upload.single('file'), (req, res) => {
    console.log('Requête reçue pour le téléchargement du fichier');

    if (!req.file) {
        console.error('Aucun fichier téléchargé');
        return res.status(400).send('Aucun fichier téléchargé');
    }

    const filePath = req.file.path; // Chemin du fichier temporaire
    const extractPath = path.join(__dirname, 'viewer'); // Chemin de destination pour la décompression

    console.log(`Fichier téléchargé : ${filePath}`);
    console.log(`Chemin de décompression : ${extractPath}`);

    // Vérifiez si le dossier de destination existe, sinon créez-le
    if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath, { recursive: true });
        console.log(`Dossier créé : ${extractPath}`);
    }

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
app.listen(3000, () => {
    console.log('Serveur démarré sur le port http://localhost:3000');
});