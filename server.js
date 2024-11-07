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

    if (!req.file) {
        console.error('Aucun fichier téléchargé');
        return res.status(400).send('Aucun fichier téléchargé');
    }

    const sessionId = req.sessionId; // Récupérer l'ID de session
    const filePath = req.file.path; // Chemin du fichier temporaire
    const userExtractPath = path.join('viewer', `session_${sessionId}`); // Chemin spécifique à l'utilisateur pour la décompression

    // Assurez-vous que le répertoire de l'utilisateur existe
    if (!fs.existsSync(userExtractPath)) {
        console.log(`Création du répertoire : ${userExtractPath}`);
        fs.mkdirSync(userExtractPath, { recursive: true });
    }

    // Lire et décompresser le fichier
    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: userExtractPath }))
        .on('close', () => {
            fs.unlinkSync(filePath); // Supprime le fichier zip après extraction
            res.sendFile(path.join(__dirname, 'loaded', 'index.html'));
        })
        .on('error', (err) => {
            res.status(500).send('Erreur lors de la décompression');
        });
});

// Route pour servir les fichiers statiques depuis le dossier 'viewer'
app.use('/sae501/viewer', express.static('viewer'));

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://127.0.0.1:${port}`);
});