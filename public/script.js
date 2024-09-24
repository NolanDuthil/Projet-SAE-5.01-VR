// Coordonnées Sphériques
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

//  File Upload
document.addEventListener('DOMContentLoaded', function () {
  const viewFilesBtn = document.getElementById('view-files-btn');
  const closePopupBtn = document.getElementById('close-popup-btn');
  const popupOverlay = document.getElementById('popup-overlay');

  if (viewFilesBtn) {
    viewFilesBtn.addEventListener('click', showFilePopup);
  }

  if (popupOverlay) {
    popupOverlay.addEventListener('click', closeFilePopup);
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closeFilePopup);
  }
});

// Fonction pour uploader automatiquement le fichier
function handleFileUpload(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          alert(`Fichier "${file.name}" téléchargé avec succès !`);
          fileInput.value = '';
        } else {
          alert('Erreur lors de l\'upload du fichier.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  }
}

document.getElementById('file-upload').addEventListener('change', handleFileUpload);

function showFilePopup() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Effacer la liste existante

  // Faire une requête pour récupérer les fichiers uploadés
  fetch('/uploaded_files')
      .then(response => response.json())
      .then(files => {
          files.forEach(fileName => {
              const li = document.createElement('li');
              const filePath = `/uploaded_images/${fileName}`; // Chemin d'accès pour afficher le fichier

              // Créer un élément d'image si le fichier est une image
              if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                  const img = document.createElement('img');
                  img.src = filePath;
                  img.alt = fileName;
                  img.style.width = "100px"; // Ajuster la taille de l'image
                  li.appendChild(img);

                  // Ajouter un événement pour changer l'image de la scène quand on clique sur l'image
                  img.addEventListener('click', () => {
                      updateSceneImage(filePath); // Mettre à jour l'image de la scène
                      closeFilePopup(); // Fermer la popup après avoir sélectionné une image
                  });
              }

              // Ajouter le nom du fichier dans tous les cas
              const fileText = document.createElement('p');
              fileText.textContent = fileName;
              li.appendChild(fileText);

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

function closeFilePopup() {
  document.getElementById('file-popup').style.display = 'none';
  document.getElementById('popup-overlay').style.display = 'none';
}

// Ajout d'événement pour le bouton de visualisation des fichiers
document.getElementById('view-files-btn').addEventListener('click', showFilePopup);

// Fermer la popup quand l'utilisateur clique sur l'overlay
document.getElementById('popup-overlay').addEventListener('click', closeFilePopup);
