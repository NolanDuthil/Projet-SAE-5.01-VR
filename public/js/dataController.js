// URL du fichier JSON externe
const jsonUrl = 'http://localhost:3000/data'; // URL de l'API du serveur

// Déclarez jsonData ici pour qu'il soit accessible à toutes les fonctions
let jsonData = { scenes: [] };

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

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    const sceneNameInput = document.getElementById('scene-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');

    // Supprimer les anciens EventListeners s'ils existent
    if (sceneNameListener) sceneNameInput.removeEventListener('input', sceneNameListener);
    if (cameraVerticalListener) cameraVerticalInput.removeEventListener('input', cameraVerticalListener);
    if (cameraHorizontalListener) cameraHorizontalInput.removeEventListener('input', cameraHorizontalListener);
    if (tagSelectListener) tagSelect.removeEventListener('change', tagSelectListener);

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

    // Affichage des données du premier tag
    if (tags.length > 0) {
        loadTagDetails(tags, 0);
    }

    // Créer et ajouter de nouveaux EventListeners

    sceneNameListener = function() {
        scene.name = this.value;
    };
    sceneNameInput.addEventListener('input', sceneNameListener);

    cameraVerticalListener = function() {
        scene.camera.vertical = this.value;
    };
    cameraVerticalInput.addEventListener('input', cameraVerticalListener);

    cameraHorizontalListener = function() {
        scene.camera.horizontal = this.value;
    };
    cameraHorizontalInput.addEventListener('input', cameraHorizontalListener);

    tagSelectListener = function() {
        loadTagDetails(tags, this.value);
    };
    tagSelect.addEventListener('change', tagSelectListener);
}


// Variables pour stocker les fonctions des EventListeners des tags
let tagNameListener;
let tagLegendListener;
let rInputListener;
let thetaInputListener;
let fiInputListener;

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTagIndex) {
    const tag = tags[selectedTagIndex];
    const tagNameInput = document.getElementById('tag-name-input');
    const tagLegendInput = document.getElementById('tag-legend-area');
    const rInput = document.getElementById('r');
    const thetaInput = document.getElementById('theta');
    const fiInput = document.getElementById('fi');

    // Supprimer les anciens EventListeners s'ils existent
    if (tagNameListener) tagNameInput.removeEventListener('input', tagNameListener);
    if (tagLegendListener) tagLegendInput.removeEventListener('input', tagLegendListener);
    if (rInputListener) rInput.removeEventListener('input', rInputListener);
    if (thetaInputListener) thetaInput.removeEventListener('input', thetaInputListener);
    if (fiInputListener) fiInput.removeEventListener('input', fiInputListener);

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = tag.name;
    tagLegendInput.value = tag.legend;
    rInput.value = tag.position.r;
    thetaInput.value = tag.position.theta;
    fiInput.value = tag.position.fi;

    // Ajouter de nouveaux EventListeners

    tagNameListener = function() {
        // Mettre à jour le nom du tag dans jsonData
        tag.name = this.value;
        // Mettre à jour l'option correspondante dans la liste déroulante
        document.getElementById('tags-select').options[selectedTagIndex].textContent = this.value;
    };
    tagNameInput.addEventListener('input', tagNameListener);

    tagLegendListener = function() {
        tag.legend = this.value;
    };
    tagLegendInput.addEventListener('input', tagLegendListener);

    rInputListener = function() {
        tag.position.r = this.value;
    };
    rInput.addEventListener('input', rInputListener);

    thetaInputListener = function() {
        tag.position.theta = this.value;
    };
    thetaInput.addEventListener('input', thetaInputListener);

    fiInputListener = function() {
        tag.position.fi = this.value;
    };
    fiInput.addEventListener('input', fiInputListener);
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
async function init(){
    await loadPageData();
    document.getElementById('add-scene').addEventListener('click', addNewScene); 
    document.getElementById('save-button').addEventListener('click', updateJSON); 
    // document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});
