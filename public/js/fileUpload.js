// export default function fileUpload() {
//   document.addEventListener('DOMContentLoaded', initFileUpload);

  // Initialise le chargement de fichiers et la configuration des événements
  function initFileUpload() {
    setupEventListeners();
    loadData(); // Charger les données initiales
  }

  // Ajoute les événements aux boutons et éléments du formulaire
  function setupEventListeners() {
    const fileUploadForm = document.getElementById('upload-form');
    const viewFilesBtn = document.getElementById('view-files-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const saveButton = document.getElementById('save-button');

    fileUploadForm?.addEventListener('submit', handleFileUpload);
    viewFilesBtn?.addEventListener('click', showFilePopup);
    closePopupBtn?.addEventListener('click', closeFilePopup);
    popupOverlay?.addEventListener('click', closeFilePopup);
    saveButton?.addEventListener('click', saveSceneChanges);
  }

  // Gère l'upload de fichier via le formulaire sans rechargement de page
  function handleFileUpload(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('upload-form'));

    fetch('/upload', { method: 'POST', body: formData })
      .then(response => {
        if (response.ok) {
          console.log('Fichier téléchargé avec succès');
          window.location.reload();
        } else {
          console.error('Erreur lors de l\'upload du fichier');
        }
      })
      .catch(error => console.error('Erreur:', error));
  }

  // Affiche la popup avec la liste des fichiers uploadés
  function showFilePopup() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    fetch('/uploaded_files')
      .then(response => response.json())
      .then(files => updateFileList(files, fileList))
      .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));
  }

  // Met à jour la liste des fichiers dans la popup
  function updateFileList(files, fileList) {
    if (files.length === 0) {
      const noFilesMessage = document.createElement('p');
      noFilesMessage.textContent = 'Aucun fichier uploadé.';
      fileList.appendChild(noFilesMessage);
    } else {
      files.forEach(fileName => createFileListItem(fileName, fileList));
    }
    togglePopup(true);
  }

  // Crée un élément de liste pour chaque fichier et ajoute un événement de sélection d'image
  function createFileListItem(fileName, fileList) {
    const li = document.createElement('li');
    const fileText = document.createElement('p');
    fileText.textContent = fileName;
    li.appendChild(fileText);

    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) {
      const img = document.createElement('img');
      img.src = `/uploaded_images/${fileName}`;
      img.alt = fileName;
      img.style.width = "100px";
      li.appendChild(img);

      li.addEventListener('click', () => {
        updateSceneImage(fileName);
        closeFilePopup();
      });
    }
    fileList.appendChild(li);
  }

  // Ferme la popup des fichiers
  function closeFilePopup() {
    togglePopup(false);
  }

  // Gère l'affichage ou la fermeture de la popup en fonction de l'état
  function togglePopup(show) {
    const displayStyle = show ? 'block' : 'none';
    document.getElementById('file-popup').style.display = displayStyle;
    document.getElementById('popup-overlay').style.display = displayStyle;
  }

  let jsonData = {};
  let selectedFileName = "";

  // Charge les données de la scène depuis un fichier JSON
  function loadData() {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => jsonData = data)
      .catch(error => console.error('Erreur lors du chargement des données:', error));
  }

  // Met à jour l'image sélectionnée dans la scène sans l'appliquer immédiatement
  function updateSceneImage(fileName) {
    selectedFileName = fileName;
  }

  // Sauvegarde les modifications de la scène en mettant à jour l'image
  function saveSceneChanges() {
    const sceneName = document.getElementById('scene-name').value;

    if (!jsonData?.scenes) {
      console.error('Les données ne sont pas encore chargées.');
      return;
    }

    const scene = jsonData.scenes.find(scene => scene.name === sceneName);
    if (scene && selectedFileName) {
      scene.image = selectedFileName;
      saveData();
    } else {
      console.error(`Scène "${sceneName}" introuvable ou aucune image sélectionnée.`);
    }
  }

  // Envoie les données mises à jour au serveur pour les sauvegarder
  async function saveData() {
    try {
      const response = await fetch('http://localhost:3000/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde des données : ' + response.statusText);
      console.log('Données sauvegardées avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données :', error);
    }
  }
// }
