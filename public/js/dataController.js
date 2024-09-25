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

// Fonction pour ajouter une nouvelle scène
async function addNewScene() {
    const newScene = {
        name: `Scene ${Date.now()}`,
        image: "", 
        tags: {}
    };

    // Ajouter la nouvelle scène à jsonData
    jsonData.scenes.push(newScene);

    // Mettre à jour l'affichage avec les scènes mises à jour
    populateSceneList(jsonData.scenes);
}

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    document.getElementById('scene-name').value = scene.name;
    scene.image ? document.getElementById('image-360').setAttribute('src', "uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "assets/grey-background.avif")

    const cameraData = {
        vertical: 0,
        horizontal: 0
    };
    document.getElementById('camera-vertical').value = cameraData.vertical;
    document.getElementById('camera-horizontal').value = cameraData.horizontal;

    const tagSelect = document.getElementById('tags-select');
    tagSelect.innerHTML = '';

    const tags = scene.tags || {};
    for (let tagKey in tags) {
        if (tags.hasOwnProperty(tagKey)) {
            const tag = tags[tagKey];
            const option = document.createElement('option');
            option.value = tagKey;
            option.textContent = tagKey;
            tagSelect.appendChild(option);
        }
    }

    if (Object.keys(tags).length > 0) {
        loadTagDetails(tags, Object.keys(tags)[0]);
    }

    tagSelect.addEventListener('change', function () {
        loadTagDetails(tags, this.value);
    });
}

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTag) {
    const tag = tags[selectedTag];
    document.getElementById('tag-name').value = selectedTag;
    document.getElementById('tag-legend').value = tag.legend;
    document.getElementById('r').value = tag.position.r;
    document.getElementById('theta').value = tag.position.theta;
    document.getElementById('fi').value = tag.position.fi;
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    await fetchData(); // Appeler fetchData pour remplir jsonData
    const scenes = jsonData.scenes;

    populateSceneList(scenes);
    if (scenes.length > 0) {
        updateSceneDetails(scenes[0]);
    }
}

// Fonction pour sauvegarder les données de la page dans jsonData et le fichier JSON
async function saveData() {
    // Collecter les données de la page
    const sceneName = document.getElementById('scene-name').value;
    const cameraVertical = document.getElementById('camera-vertical').value;
    const cameraHorizontal = document.getElementById('camera-horizontal').value;
    
    // Récupérer les tags
    const tagSelect = document.getElementById('tags-select');
    const tags = {};
    
    Array.from(tagSelect.options).forEach(option => {
        const tagKey = option.value;
        const tagLegend = document.getElementById('tag-legend').value;
        const tagPosition = {
            r: document.getElementById('r').value,
            theta: document.getElementById('theta').value,
            fi: document.getElementById('fi').value,
        };
        
        tags[tagKey] = {
            legend: tagLegend,
            position: tagPosition
        };
    });

    // Mettre à jour jsonData
    jsonData.scenes.forEach(scene => {
        if (scene.name === sceneName) {
            scene.camera = {
                vertical: cameraVertical,
                horizontal: cameraHorizontal
            };
            scene.tags = tags;
        }
    });

    // Enregistrer jsonData dans le fichier JSON
    await updateJSON(jsonData);
}

// Fonction pour mettre à jour le fichier JSON
async function updateJSON(data) {
    try {
        const response = await fetch(jsonUrl, {
            method: 'PUT', // Utilisez PUT pour mettre à jour
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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
    document.getElementById('save-button').addEventListener('click', saveData); 
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});
