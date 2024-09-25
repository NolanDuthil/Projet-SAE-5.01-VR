export default function fileUpload() {
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

  let jsonData = {};  // Déclaration globale de jsonData

  // Charger les données de data.json quand la page est chargée
  function loadData() {
    fetch('/data.json')  // Assurez-vous que cette route renvoie bien le fichier data.json
      .then(response => response.json())
      .then(data => {
        jsonData = data;  // Stocker les données dans la variable globale
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
      });
  }

  // Appeler loadData quand la page est chargée
  window.onload = function () {
    loadData();
  };

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

              // Ajouter un événement de clic pour changer l'image de la scène
              li.addEventListener('click', () => {
                // Remplacer l'image 360° dans la scène A-Frame
                document.getElementById('image-360').setAttribute('src', filePath);

                // Mettre à jour l'image dans l'objet jsonData (assurez-vous que la scène courante est définie)
                updateSceneImage(fileName);

                // Fermer la popup
                closeFilePopup();
              });
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

  function updateSceneImage(fileName) {
    const sceneName = document.getElementById('scene-name').value;  // Nom de la scène sélectionnée

    // Vérifier que jsonData est chargé et que la scène existe
    if (!jsonData || !jsonData.scenes) {
      console.error('Les données ne sont pas encore chargées.');
      return;
    }

    // Trouver la scène actuelle dans jsonData et mettre à jour l'image
    const scene = jsonData.scenes.find(scene => scene.name === sceneName);

    if (scene) {
      scene.image = fileName;  // Mettre à jour l'image de la scène dans jsonData

      // Envoyer la mise à jour au serveur pour sauvegarder dans data.json
      saveData();

      // Rafraîchir la page après la mise à jour
      setTimeout(function () {
        location.reload();
      }, 500);  // délai de 500ms pour s'assurer que le fichier est bien sauvegardé
    } else {
      console.error(`La scène "${sceneName}" n'a pas été trouvée.`);
    }
  }

  // Fonction pour envoyer les données mises à jour au serveur
  async function saveData() {
    try {
      const response = await fetch('http://localhost:3000/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),  // Envoyer les données mises à jour
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des données : ' + response.statusText);
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données :', error);
    }
  }

  function closeFilePopup() {
    document.getElementById('file-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
  }

  document.getElementById('view-files-btn').addEventListener('click', showFilePopup);

  document.getElementById('close-popup-btn').addEventListener('click', closeFilePopup);

  document.getElementById('popup-overlay').addEventListener('click', closeFilePopup);

}