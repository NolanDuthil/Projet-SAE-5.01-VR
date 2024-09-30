// Déclarez jsonData ici pour qu'il soit accessible à toutes les fonctions
let jsonData = { scenes: [] };
let selectedScene = {};
let selectedTag = 0;

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
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('popup-overlay');

    // Supprimer les anciens EventListeners s'ils existent
    if (sceneNameListener) sceneNameInput.removeEventListener('input', sceneNameListener);
    if (cameraVerticalListener) cameraVerticalInput.removeEventListener('input', cameraVerticalListener);
    if (cameraHorizontalListener) cameraHorizontalInput.removeEventListener('input', cameraHorizontalListener);
    if (tagSelectListener) tagSelect.removeEventListener('change', tagSelectListener);
    if (fileUploadFormListener) fileUploadForm.removeEventListener('submit', fileUploadFormListener);
    if (closePopupBtnListener) closePopupBtn.removeEventListener('click', closePopupBtnListener);
    if (popupOverlayListener) popupOverlay.removeEventListener('click', popupOverlayListener);
    if (saveButtonListener) saveButton.removeEventListener('click', saveButtonListener);

    // Nom & Image de la scène
    sceneNameInput.value = scene.name;
    scene.image ? document.getElementById('image-360').setAttribute('src', "./uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "./assets/grey-background.avif");

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
        updateCanvaTagInformations(tag);
    };
    tagTypeSelector.addEventListener('change', tagTypeListener);

    // Ajouter de nouveaux EventListeners
    tagNameListener = function () {
        tag.name = this.value;
        tagSelect.options[selectedTagIndex].textContent = this.value;
    };
    tagNameInput.addEventListener('input', tagNameListener);

    tagLegendListener = function () {
        tag.legend = this.value;
    };
    tagLegendInput.addEventListener('input', tagLegendListener);

    rInputListener = function () {
        tag.position.r = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
    };
    rInput.addEventListener('input', rInputListener);

    thetaInputListener = function () {
        tag.position.theta = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
        console.log(tag);
    };
    thetaInput.addEventListener('input', thetaInputListener);

    fiInputListener = function () {
        tag.position.fi = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
        console.log(tag);
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
    let pastTags = document.querySelectorAll('a-sphere, a-text'); // Sélectionner aussi les éléments de texte
    pastTags.forEach((pastTag) => {
        pastTag.remove(); // Supprimer les anciennes sphères et textes
    });

    scene.tags.forEach((tag) => {
        let tagSphere = document.createElement('a-sphere');
        tagSphere.setAttribute('color', tag.type === 'porte' ? 'red' : 'blue');
        tagSphere.setAttribute('id', tag.id);
        tagSphere.setAttribute('radius', 1);
        tagSphere.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta}; r:${tag.position.r};`);
        canva.appendChild(tagSphere);

        let tagText = document.createElement('a-text');
        tagText.setAttribute('id', tag.id + "-text")
        tagText.setAttribute('value', tag.legend);
        tagText.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta - (-4)}; r:${tag.position.r};`); // Ajustement pour le texte
        tagText.setAttribute('color', 'white');
        tagText.setAttribute('align', 'center'); // Centrer le texte par rapport à la sphère
        tagText.setAttribute('width', '20');
        tagText.setAttribute('look-at', '[camera]');
        canva.appendChild(tagText);
    });
}

function updateCanvaTagInformations(tag){
    let canva = document.getElementById('a-scene');
    document.getElementById(tag.id).remove();
    document.getElementById(tag.id + '-text').remove();

    let tagSphere = document.createElement('a-sphere');
    tagSphere.setAttribute('color', tag.type == 'porte' ? 'red' : 'blue');
    tagSphere.setAttribute('id', tag.id);
    tagSphere.setAttribute('radius', 1);
    tagSphere.setAttribute('fromspherical', 'fi:' + tag.position.fi + '; theta:' + tag.position.theta + '; r:' + tag.position.r + ';');
    canva.appendChild(tagSphere);

    let tagText = document.createElement('a-text');
    tagText.setAttribute('id', tag.id + "-text")
    tagText.setAttribute('value', tag.legend);
    tagText.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta - (-4)}; r:${tag.position.r};`); // Ajustement pour le texte
    tagText.setAttribute('color', 'white');
    tagText.setAttribute('align', 'center'); // Centrer le texte par rapport à la sphère
    tagText.setAttribute('width', '20');
    tagText.setAttribute('look-at', '[camera]');
    canva.appendChild(tagText);
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
        id: Date.now(),
        name: "nouveau tag",
        type: "porte",
        legend: "nouveau tag",
        position: {
            r: "2",
            theta: "0",
            fi: "0"
        }
    };

    // Ajouter la nouvelle scène à jsonData
    selectedScene.tags.push(newTag);
    console.log(jsonData)

    // Mettre à jour l'affichage avec les scènes mises à jour
    updateSceneDetails(selectedScene);
}

// Fonction pour charger les données JSON depuis localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData) {
        jsonData = JSON.parse(storedData);
    } else {
        initializeDefaultData();
    }
}

// Fonction pour initialiser les données par défaut dans localStorage
function initializeDefaultData() {
    jsonData = {
        scenes: [
    {
        "name": "Entrée Studio",
        "image": "GS__3523.JPG",
        "camera": {
            "vertical": "0",
            "horizontal": "0"
        },
        "tags": [
            {
                "id": "1",
                "name": "Porte Studio (côté extérieur)",
                "legend": "Rentrer dans le studio",
                "type": "porte",
                "action": "1",
                "position": {
                    "r": "25",
                    "theta": "90",
                    "fi": "-115"
                }
            },
            {
                "id": "2",
                "name": "Une information",
                "type": "info",
                "legend": "Nouvelle information",
                "action": "1",
                "position": {
                    "r": "30",
                    "theta": "90",
                    "fi": "-40"
                }
            }
        ]
    },
    {
        "name": "Salle 1 Studio",
        "image": "GS__3524.JPG",
        "camera": {
            "vertical": "0",
            "horizontal": "0"
        },
        "tags": [
            {
                "id": "3",
                "name": "Porte Studio (côté intérieur)",
                "legend": "Sortir du studio",
                "type": "porte",
                "action": "0",
                "position": {
                    "r": "30",
                    "theta": "90",
                    "fi": "135"
                }
            },
            {
                "id": "4",
                "name": "Porte Salle 2 Studio",
                "legend": "Rentrer dans la 2e salle du studio",
                "type": "porte",
                "action": "2",
                "position": {
                    "r": "30",
                    "theta": "90",
                    "fi": "-40"
                }
            }
        ]
    },
    {
        "name": "Salle 2 Studio",
        "image": "GS__3525.JPG",
        "camera": {
            "vertical": "0",
            "horizontal": "0"
        },
        "tags": [
            {
                "id": "5",
                "name": "Porte Salle 1 Studio",
                "legend": "Sortir de la 2e salle du studio",
                "type": "porte",
                "action": "1",
                "position": {
                    "r": "30",
                    "theta": "90",
                    "fi": "-40"
                }
            },
            {
                "id": "6",
                "name": "Porte Salle 3 Studio",
                "legend": "Rentrer dans la 3e salle du studio",
                "type": "porte",
                "action": "3",
                "position": {
                    "r": "40",
                    "theta": "90",
                    "fi": "-140"
                }
            }
        ]
    },
    {
        "name": "Salle 3 Studio",
        "image": "GS__3526.JPG",
        "camera": {
            "vertical": "0",
            "horizontal": "0"
        },
        "tags": [
            {
                "id": "7",
                "name": "Porte Salle 2 Studio",
                "legend": "Sortir de la 3e salle du studio",
                "type": "porte",
                "action": "2",
                "position": {
                    "r": "40",
                    "theta": "90",
                    "fi": "-65"
                }
            }
        ]
    }
]
    };
    saveToLocalStorage();
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    loadFromLocalStorage();
    let scenes = jsonData.scenes;
    populateSceneList(scenes);
    if (scenes.length > 0) {
        updateSceneDetails(scenes[0]);
    }
}

// Fonction pour sauvegarder les données JSON dans localStorage
function saveToLocalStorage() {
    localStorage.setItem('jsonData', JSON.stringify(jsonData));
}

// Fonction pour exporter les données JSON
function exportToJson() {
    const jsonString = JSON.stringify(jsonData, null, 2); // Formate le JSON avec des indentations
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes_data.json'; // Nom du fichier téléchargé
    a.click();

    // Libérer l'URL après utilisation
    URL.revokeObjectURL(url);
}

// Initialisation
async function init() {
    await loadPageData();
    document.getElementById('add-scene').addEventListener('click', addNewScene);
    document.getElementById('save-button').addEventListener('click', saveToLocalStorage);
    document.getElementById('add-tag-btn').addEventListener('click', addNewTag)
    document.getElementById('export-json').addEventListener('click', exportToJson);
    // document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});