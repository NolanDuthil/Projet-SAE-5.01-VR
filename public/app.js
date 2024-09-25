const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploaded_images/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, './')));

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
    const dirPath = path.join(__dirname, './uploaded_images');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
        }
        res.json(files);
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});