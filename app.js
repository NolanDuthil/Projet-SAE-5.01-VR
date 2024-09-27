const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploaded_images/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier sélectionné.');
    }
    res.send('Fichier uploadé avec succès : ' + req.file.originalname);
});

app.get('/uploaded_files', (req, res) => {
    const dirPath = path.join(__dirname, 'uploaded_images');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
        }
        res.json(files);
    });
});

app.use(cors()); // Permettre les requêtes cross-origin
app.use(bodyParser.json()); // Middleware pour parser les requêtes JSON

const jsonFilePath = 'data.json'; // Chemin vers le fichier JSON

// Route pour récupérer les données
app.get('/data', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur lors de la lecture du fichier');
        }
        res.json(JSON.parse(data));
    });
});

// Route pour mettre à jour les données
app.put('/data', (req, res) => {
    fs.writeFile(jsonFilePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Erreur lors de l\'écriture du fichier');
        }
        res.send('Fichier mis à jour avec succès');
    });
});

// Route expérience (pour faire la visite)
app.get('/experience', (req, res) => {
    res.sendFile(path.join(__dirname, 'experience/index.html'));
});

// Démarrer le serveur
app.listen(port, () => console.log("Server ready on port"+port+"."));
