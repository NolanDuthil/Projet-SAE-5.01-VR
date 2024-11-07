const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware pour les cookies
app.use(cookieParser());

// Middleware pour vérifier/attribuer un identifiant de session unique
app.use((req, res, next) => {
    if (!req.cookies.sessionId) {
        const sessionId = uuidv4();
        res.cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000 }); // Expire après 24 heures
        req.sessionId = sessionId;
    } else {
        req.sessionId = req.cookies.sessionId;
    }
    next();
});

// Configuration de multer pour le téléchargement de fichiers
const upload = multer({ dest: 'uploads/' });

// Servir les fichiers statiques depuis le dossier 'loader'
app.use(express.static('loader'));

// Route pour gérer le téléchargement et la décompression du fichier
app.post('/sae501/loader', upload.single('file'), (req, res) => {
    console.log('Requête reçue pour le téléchargement du fichier');

    const sessionId = req.sessionId; // Récupérer l'ID de session
    const filePath = req.file.path; // Chemin du fichier temporaire
    const userExtractPath = path.join(__dirname, 'viewer', `session_${sessionId}`); // Chemin spécifique à l'utilisateur pour la décompression

    console.log(`Fichier téléchargé : ${filePath}`);
    console.log(`Chemin de décompression : ${userExtractPath}`);

    // Assurez-vous que le répertoire de l'utilisateur existe
    if (!fs.existsSync(userExtractPath)) {
        fs.mkdirSync(userExtractPath, { recursive: true });
    }

    // Lire et décompresser le fichier
    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: userExtractPath }))
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

// Route pour servir les fichiers statiques depuis le dossier 'viewer'
app.use('/sae501/viewer', express.static('viewer'));

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://127.0.0.1:${port}`);
});
