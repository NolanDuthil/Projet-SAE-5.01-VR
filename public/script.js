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
  const fileUploadForm = document.getElementById('upload-form');

  if (fileUploadForm) {
    fileUploadForm.addEventListener('submit', handleFileUpload);
  }

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

// Fonction pour uploader automatiquement le fichier sans redirection
function handleFileUpload(event) {
  event.preventDefault(); // Empêche la soumission du formulaire classique

  const formData = new FormData(document.getElementById('upload-form'));

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        console.log('Fichier téléchargé avec succès');
        window.location.reload(); // Rafraîchit la page après l'upload
      } else {
        console.error('Erreur lors de l\'upload du fichier');
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
}

function showFilePopup() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';

  fetch('/uploaded_files')
    .then(response => response.json())
    .then(files => {
      if (files.length === 0) {
        const noFilesMessage = document.createElement('p');
        noFilesMessage.textContent = 'Aucun fichier uploadé.';
        fileList.appendChild(noFilesMessage);
      } else {
        files.forEach(fileName => {
          const li = document.createElement('li');
          const filePath = `/uploaded_images/${fileName}`;

          const fileText = document.createElement('p');
          fileText.textContent = fileName;
          li.appendChild(fileText);

          if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            const img = document.createElement('img');
            img.src = filePath;
            img.alt = fileName;
            img.style.width = "100px";
            li.appendChild(img);
          }

          fileList.appendChild(li);
        });
      }

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

document.getElementById('view-files-btn').addEventListener('click', showFilePopup);

document.getElementById('close-popup-btn').addEventListener('click', closeFilePopup);

document.getElementById('popup-overlay').addEventListener('click', closeFilePopup);
