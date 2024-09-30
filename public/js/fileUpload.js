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

  function closeFilePopup() {
    document.getElementById('file-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
  }

  let jsonData = {};  // Déclaration globale de jsonData
  let selectedFileName = "";  // Variable pour stocker le fichier sélectionné

  // Charger les données de data.json quand la page est chargée
  function loadData() {
    fetch('/data.json')  // Assurez-vous que cette route renvoie bien le fichier data.json
      .then(response => response.json())
      .then(data => {
        jsonData = data;  // Stocker les données dans la variable globale
        loadSceneImage(); // Charger l'image de la scène après avoir récupéré les données
      })
      .catch(error => {
        console.error('Erreur lors du chargement des données:', error);
      });
  }

  // Fonction pour charger l'image de la scène
  function loadSceneImage() {
    const sceneName = document.getElementById('scene-name').value;  // Nom de la scène sélectionnée
    const scene = jsonData.scenes.find(scene => scene.name === sceneName);  // Chercher la scène dans les données

    let imageSrc;

    if (scene && scene.image) {
      // Si l'image est définie dans data.json, elle a la priorité
      imageSrc = `./uploaded_images/${scene.image}`;
      console.log('Image chargée depuis data.json:', imageSrc);
    } else if (localStorage.getItem('savedImage360')) {
      // Si aucune image n'est dans data.json, on vérifie le localStorage
      imageSrc = localStorage.getItem('savedImage360');
      console.log('Image chargée depuis localStorage:', imageSrc);
    } else {
      // Image par défaut si aucune n'est définie
      imageSrc = './assets/default_image.jpg';
      console.log('Aucune image trouvée, chargement de l\'image par défaut:', imageSrc);
    }

    // Appliquer l'image à la balise <a-sky>
    document.getElementById('image-360').setAttribute('src', imageSrc);
  }

  window.onload = function () {
    loadData(); // Charger les données quand la page est chargée

    // Ajouter un événement de clic au bouton de sauvegarde
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      saveButton.addEventListener('click', saveSceneChanges);
    } else {
      console.error('Bouton de sauvegarde non trouvé dans le DOM.');
    }
  };

  // Sélectionner un fichier, mais ne pas l'appliquer encore
  function updateSceneImage(fileName) {
    selectedFileName = fileName;  // Stocker le fichier sélectionné, mais ne pas l'appliquer encore
  }

  // Fonction déclenchée lors du clic sur "Sauvegarder"
  function saveSceneChanges() {
    const sceneName = document.getElementById('scene-name').value;  // Nom de la scène sélectionnée

    // Vérifier que jsonData est chargé et que la scène existe
    if (!jsonData || !jsonData.scenes) {
      console.error('Les données ne sont pas encore chargées.');
      return;
    }

    // Trouver la scène actuelle dans jsonData et mettre à jour l'image
    const scene = jsonData.scenes.find(scene => scene.name === sceneName);

    if (scene && selectedFileName) {
      scene.image = selectedFileName;  // Mettre à jour l'image de la scène dans jsonData

      // Sauvegarder également dans le localStorage pour persistance
      localStorage.setItem('savedImage360', `./uploaded_images/${selectedFileName}`);

      // Envoyer la mise à jour au serveur pour sauvegarder dans data.json
      saveData();
    } else {
      console.error(`La scène "${sceneName}" n'a pas été trouvée ou aucune image n'a été sélectionnée.`);
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
      } else {
        console.log('Données sauvegardées avec succès.');
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données :', error);
    }
  }
}
