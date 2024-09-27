// URL du fichier JSON externe
const jsonUrl = 'http://localhost:3000/data'; // URL de l'API du serveur

// Déclarez jsonData ici pour qu'il soit accessible à toutes les fonctions
let jsonData = { scenes: [] };
let selectedScene = {};
let selectedTag = 0;

// Fonction asynchrone pour récupérer les données JSON
async function fetchData() {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du fichier: ' + response.statusText);
        }
        jsonData = await response.json(); // Mettez à jour jsonData ici
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier:', error);
    }
}

// Fonction pour remplir le menu des scènes
function populateSceneList(scenes) {
    const scenesContainer = document.getElementById('scenes');
    scenesContainer.innerHTML = ''; // Vider le conteneur

    scenes.forEach(scene => {
        // Créer un élément pour la scène
        const sceneItem = document.createElement('div');
        sceneItem.classList.add('scene-item');

        // Créer une image pour la scène
        const sceneImage = document.createElement('img');
        // Vérifier si l'image est vide et utiliser l'image par défaut si c'est le cas
        sceneImage.src = scene.image ? "./uploaded_images/" + scene.image : "./assets/grey-background.avif";
        sceneImage.alt = scene.name;

        // Créer une étiquette pour le nom de la scène
        const sceneLabel = document.createElement('div');
        sceneLabel.classList.add('label');
        sceneLabel.textContent = scene.name;

        // Ajouter l'image et l'étiquette à l'élément de scène
        sceneItem.appendChild(sceneImage);
        sceneItem.appendChild(sceneLabel);

        // Ajouter un événement de clic pour charger les détails de la scène
        sceneItem.addEventListener('click', () => {
            updateSceneDetails(scene);
        });

        // Ajouter l'élément de scène au conteneur
        scenesContainer.appendChild(sceneItem);
    });
}

// Variables pour stocker les fonctions des EventListeners
let sceneNameListener;
let cameraVerticalListener;
let cameraHorizontalListener;
let tagSelectListener;
let fileUploadFormListener;
let viewFilesBtnListener;
let closePopupBtnListener;
let popupOverlayListener;
let saveButtonListener;

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    selectedScene = scene;
    const sceneNameInput = document.getElementById('scene-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');
    const fileUploadForm = document.getElementById('upload-form');
    const viewFilesBtn = document.getElementById('view-files-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');

    // Supprimer les anciens EventListeners s'ils existent
    if (sceneNameListener) sceneNameInput.removeEventListener('input', sceneNameListener);
    if (cameraVerticalListener) cameraVerticalInput.removeEventListener('input', cameraVerticalListener);
    if (cameraHorizontalListener) cameraHorizontalInput.removeEventListener('input', cameraHorizontalListener);
    if (tagSelectListener) tagSelect.removeEventListener('change', tagSelectListener);
    if (fileUploadFormListener) fileUploadForm.removeEventListener('submit', fileUploadFormListener);
    if (viewFilesBtnListener) viewFilesBtn.removeEventListener('click', viewFilesBtnListener);
    if (closePopupBtnListener) closePopupBtn.removeEventListener('click', closePopupBtnListener);
    if (popupOverlayListener) popupOverlay.removeEventListener('click', popupOverlayListener);
    if (saveButtonListener) saveButton.removeEventListener('click', saveButtonListener);

    // Nom & Image de la scène
    sceneNameInput.value = scene.name;
    scene.image ? document.getElementById('image-360').setAttribute('src', "uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "assets/grey-background.avif");

    // Angle Caméra de la scène
    cameraVerticalInput.value = scene.camera.vertical;
    cameraHorizontalInput.value = scene.camera.horizontal;

    // Liste de tags
    tagSelect.innerHTML = '';
    const tags = scene.tags || [];
    tags.forEach((tag, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = tag.name;
        tagSelect.appendChild(option);
    });

    updateCanvaTags(scene);

    // Affichage des données du premier tag
    if (tags.length > 0) {
        loadTagDetails(tags, 0);
    } else {
        hideTags();
    }

    // Créer et ajouter de nouveaux EventListeners

    // Listener pour le nom de la scène
    sceneNameListener = function () {
        scene.name = this.value;
    };
    sceneNameInput.addEventListener('input', sceneNameListener);

    // Listener pour l'angle vertical de la caméra
    cameraVerticalListener = function () {
        scene.camera.vertical = this.value;
    };
    cameraVerticalInput.addEventListener('input', cameraVerticalListener);

    // Listener pour l'angle horizontal de la caméra
    cameraHorizontalListener = function () {
        scene.camera.horizontal = this.value;
    };
    cameraHorizontalInput.addEventListener('input', cameraHorizontalListener);

    // Listener pour le changement de tag
    tagSelectListener = function () {
        loadTagDetails(tags, this.value);
    };
    tagSelect.addEventListener('change', tagSelectListener);

    // Listener pour le formulaire d'upload de fichier
    fileUploadFormListener = function (event) {
        event.preventDefault(); // Empêche la soumission classique
        handleFileUpload();
    };
    fileUploadForm.addEventListener('submit', fileUploadFormListener);

    // Listener pour le bouton de visualisation des fichiers
    viewFilesBtnListener = function () {
        showFilePopup();
    };
    viewFilesBtn.addEventListener('click', viewFilesBtnListener);

    // Listener pour le bouton de fermeture de la popup
    closePopupBtnListener = function () {
        closeFilePopup();
    };
    closePopupBtn.addEventListener('click', closePopupBtnListener);

    // Listener pour l'overlay de la popup (fermer la popup)
    popupOverlayListener = function () {
        closeFilePopup();
    };
    popupOverlay.addEventListener('click', popupOverlayListener);
}

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
            selectedScene.image = fileName; 
            updateImage()
            closeFilePopup();
        });
    }
    fileList.appendChild(li);
}

// Fonction pour mettre à jour uniquement l'image dans l'interface
function updateImage() {
    document.getElementById('image-360').setAttribute('src', `uploaded_images/${selectedScene.image}`);
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

// Variables pour stocker les fonctions des EventListeners des tags
let tagNameListener;
let tagLegendListener;
let rInputListener;
let thetaInputListener;
let fiInputListener;
let sceneSelectListener;
let tagTypeListener;

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTagIndex) {
    selectedTag = selectedTagIndex;

    document.getElementById('tag-settings').style = "";
    document.getElementById('tag-name').style = "";
    document.getElementById('tag-legend').style = "";
    document.getElementById('tag-position').style = "";

    const tag = tags[selectedTagIndex];
    const tagNameInput = document.getElementById('tag-name-input');
    const tagLegendInput = document.getElementById('tag-legend-area');
    const rInput = document.getElementById('r');
    const thetaInput = document.getElementById('theta');
    const fiInput = document.getElementById('fi');
    const tagSelect = document.getElementById('tags-select');
    const sceneSelectorContainer = document.getElementById('scene-selector-container');
    const sceneSelector = document.getElementById('scene-selector');
    const tagTypeSelector = document.getElementById('tag-type-selector');

    // Supprimer les anciens EventListeners s'ils existent
    if (tagNameListener) tagNameInput.removeEventListener('input', tagNameListener);
    if (tagLegendListener) tagLegendInput.removeEventListener('input', tagLegendListener);
    if (rInputListener) rInput.removeEventListener('input', rInputListener);
    if (thetaInputListener) thetaInput.removeEventListener('input', thetaInputListener);
    if (fiInputListener) fiInput.removeEventListener('input', fiInputListener);
    if (sceneSelectListener) sceneSelector.removeEventListener('change', sceneSelectListener);
    if (tagTypeListener) tagTypeSelector.removeEventListener('change', tagTypeListener); // Supprimez le listener de type

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = tag.name;
    tagLegendInput.value = tag.legend;
    rInput.value = tag.position.r;
    thetaInput.value = tag.position.theta;
    fiInput.value = tag.position.fi;

    sceneSelector.innerHTML = ''; // Vider le sélecteur
    jsonData.scenes.forEach((scene, index) => {
        if (scene != selectedScene) {
            const option = document.createElement('option');
            option.value = index;  // L'index de la scène
            option.textContent = scene.name;  // Le nom de la scène
            sceneSelector.appendChild(option);
        }
    });

    // Si le type du tag est "porte", afficher le sélecteur de scène
    if (tag.type === 'porte') {
        sceneSelectorContainer.style.display = '';

        // Sélectionner la scène correspondante si elle est déjà définie
        sceneSelector.value = tag.action;

        // Ajouter un event listener pour mettre à jour l'action (numéro de scène)
        sceneSelectListener = function () {
            tag.action = this.value;
            // updateCanvaTags(selectedScene);
        };
        sceneSelector.addEventListener('change', sceneSelectListener);
    } else {
        // Cacher le sélecteur si le type n'est pas "porte"
        sceneSelectorContainer.style.display = 'none';
    }

    // Ajouter un listener pour changer le type de tag
    tagTypeSelector.value = tag.type; // Remplir le sélecteur avec le type actuel
    tagTypeListener = function () {
        tag.type = this.value; // Met à jour le type du tag
        // Afficher ou cacher le sélecteur de scène selon le type sélectionné
        if (tag.type === 'porte') {
            sceneSelectorContainer.style.display = ''; // Affiche le sélecteur de scène
        } else {
            sceneSelectorContainer.style.display = 'none'; // Cache le sélecteur de scène
        }
    };
    tagTypeSelector.addEventListener('change', tagTypeListener);

    // Ajouter de nouveaux EventListeners
    tagNameListener = function () {
        tag.name = this.value;
        tagSelect.options[selectedTagIndex].textContent = this.value;
        // updateCanvaTags(selectedScene);
    };
    tagNameInput.addEventListener('input', tagNameListener);

    tagLegendListener = function () {
        tag.legend = this.value;
    };
    tagLegendInput.addEventListener('input', tagLegendListener);

    rInputListener = function () {
        // updateCanvaTags(selectedScene);
        tag.position.r = this.value === '' ? 0 : this.value;
    };
    rInput.addEventListener('input', rInputListener);

    thetaInputListener = function () {
        // updateCanvaTags(selectedScene);
        tag.position.theta = this.value === '' ? 0 : this.value;
    };
    thetaInput.addEventListener('input', thetaInputListener);

    fiInputListener = function () {
        // updateCanvaTags(selectedScene);
        tag.position.fi = this.value === '' ? 0 : this.value;
    };
    fiInput.addEventListener('input', fiInputListener);
}

function hideTags() {
    document.getElementById('tag-settings').style = "display:none";
    document.getElementById('tag-name').style = "display:none";
    document.getElementById('tag-legend').style = "display:none";
    document.getElementById('tag-position').style = "display:none";
}

function updateCanvaTags(scene) {
    let canva = document.getElementById('a-scene');
    let pastTags = document.querySelectorAll('a-sphere');
    pastTags.forEach((pastTag) => {
        pastTag.remove();
    })
    scene.tags.forEach((tag) => {
        let tagSphere = document.createElement('a-sphere');
        tagSphere.setAttribute('color', tag.type == 'porte' ? 'red' : 'blue');
        tagSphere.setAttribute('id', tag.name);
        tagSphere.setAttribute('radius', 1);
        tagSphere.setAttribute('fromspherical', 'fi:' + tag.position.fi + '; theta:' + tag.position.theta + '; r:' + tag.position.r + ';');
        canva.appendChild(tagSphere);
    });
}

// Fonction pour ajouter une nouvelle scène
async function addNewScene() {
    const newScene = {
        name: `Scene ${Date.now()}`,
        image: "",
        camera: {
            vertical: "0",
            horizontal: "0"
        },
        tags: {}
    };

    // Ajouter la nouvelle scène à jsonData
    jsonData.scenes.push(newScene);

    // Mettre à jour l'affichage avec les scènes mises à jour
    populateSceneList(jsonData.scenes);
    loadTagDetails(selectedScene.tags, selectedTag);
}

// Fonction pour ajouter une nouvelle scène
async function addNewTag() {
    const newTag = {
        name: "nouveau tag",
        type: "porte",
        legend: "nouveau tag",
        "position": {
            "r": "2",
            "theta": "0",
            "fi": "0"
        }
    };

    // Ajouter la nouvelle scène à jsonData
    selectedScene.tags.push(newTag);
    console.log(jsonData)

    // Mettre à jour l'affichage avec les scènes mises à jour
    updateSceneDetails(selectedScene);
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    await fetchData();

    let scenes = jsonData.scenes;
    populateSceneList(scenes);
    if (scenes.length > 0) {
        updateSceneDetails(scenes[0]);
    }
}

// Fonction pour mettre à jour le fichier JSON
async function updateJSON() {
    try {
        const response = await fetch(jsonUrl, {
            method: 'PUT', // Utilisez PUT pour mettre à jour
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du fichier: ' + response.statusText);
        }
        console.log('Données enregistrées avec succès!');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
    }
}

// Initialisation
async function init() {
    await loadPageData();
    document.getElementById('add-scene').addEventListener('click', addNewScene);
    document.getElementById('save-button').addEventListener('click', updateJSON);
    document.getElementById('add-tag-btn').addEventListener('click', addNewTag)
    // document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});
