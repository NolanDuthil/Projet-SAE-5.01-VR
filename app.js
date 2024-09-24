let uploadedFiles = [];

// Fonction pour simuler l'upload de fichier et l'ajouter à la liste
function uploadFile() {
  const fileInput = document.getElementById('file-upload');
  const file = fileInput.files[0];

  if (file) {
    // Ajouter le fichier à la liste
    uploadedFiles.push(file.name);
    alert('Fichier "' + file.name + '" téléchargé avec succès !');
    fileInput.value = ''; // Réinitialiser l'input file
  } else {
    alert('Veuillez sélectionner un fichier.');
  }
}

// Fonction pour afficher la popup des fichiers uploadés
function showFilePopup() {
  // Mettre à jour la liste des fichiers dans la popup
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Effacer la liste existante
  uploadedFiles.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    fileList.appendChild(li);
  });

  // Afficher la popup et l'overlay
  document.getElementById('file-popup').style.display = 'block';
  document.getElementById('popup-overlay').style.display = 'block';
}

// Fonction pour fermer la popup
function closeFilePopup() {
  document.getElementById('file-popup').style.display = 'none';
  document.getElementById('popup-overlay').style.display = 'none';
}

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configuration de Multer pour stocker les fichiers dans le dossier "assets"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Utiliser le nom original du fichier
    }
});

const upload = multer({ storage: storage });

// Rendre le dossier "assets" accessible publiquement
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route pour afficher le formulaire d'upload (pour test)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ton fichier HTML de la scène 3D
});

// Route pour gérer l'upload de fichier
app.post('/upload', upload.single('file'), (req, res) => {
    // Vérification que le fichier est bien uploadé
    if (!req.file) {
        return res.status(400).send('Aucun fichier sélectionné.');
    }
    res.send('Fichier uploadé avec succès : ' + req.file.originalname);
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});