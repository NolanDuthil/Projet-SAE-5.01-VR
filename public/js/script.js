AFRAME.registerComponent('fromspherical', {
  // we will use two angles and a radius provided by the user 
  schema: {
    fi: {},
    theta: {},
    r: {},
  },
  init: function () {
    // lets change it to radians
    let fi = this.data.fi * Math.PI / 180
    let theta = this.data.theta * Math.PI / 180

    // The 'horizontal axis is x. The 'vertical' is y. 
    // The calculations below are straight from the wiki site.
    let z = (-1) * Math.sin(theta) * Math.cos(fi) * this.data.r
    let x = Math.sin(theta) * Math.sin(fi) * this.data.r
    let y = Math.cos(theta) * this.data.r
    // position the element using the provided data
    this.el.setAttribute('position', {
      x: x,
      y: y,
      z: z
    })
    // rotate the element towards the camera
    this.el.setAttribute('look-at', '[camera]')
  }
})

let uploadedFiles = [];

// Fonction pour gérer l'upload de fichier
function uploadFile() {
  const fileInput = document.getElementById('file-upload');
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload.');
        }
        return response.text();
      })
      .then(data => {
        alert('Fichier "' + file.name + '" téléchargé avec succès !');
        fileInput.value = ''; // Réinitialiser l'input file
        showFilePopup(); // Afficher la popup après l'upload
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'upload du fichier.');
      });
  } else {
    alert('Veuillez sélectionner un fichier.');
  }
}

// Fonction pour afficher la popup des fichiers uploadés
function showFilePopup() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Effacer la liste existante

  // Faire une requête pour récupérer les fichiers uploadés
  fetch('/uploaded_files')
    .then(response => response.json())
    .then(files => {
      files.forEach(fileName => {
        const li = document.createElement('li');
        li.textContent = fileName; // Afficher le nom du fichier

        // Créer un élément d'image si le fichier est une image
        const filePath = `/uploaded_images/${fileName}`; // Chemin d'accès pour afficher l'image
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
          const img = document.createElement('img');
          img.src = filePath; // Chemin de l'image
          img.alt = fileName; // Texte alternatif
          li.appendChild(img); // Ajouter l'image à la liste
        }

        fileList.appendChild(li);
      });

      // Afficher la popup et l'overlay
      document.getElementById('file-popup').style.display = 'block';
      document.getElementById('popup-overlay').style.display = 'block';
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des fichiers:', error);
    });
}

// Fonction pour fermer la popup
function closeFilePopup() {
  document.getElementById('file-popup').style.display = 'none';
  document.getElementById('popup-overlay').style.display = 'none';
}

// Ajout d'événement pour le bouton de visualisation des fichiers
document.getElementById('view-files-btn').addEventListener('click', showFilePopup);