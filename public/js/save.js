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

// Function pour supprimer une scène
async function deleteScene() {


    jsonData.scenes.delete();

    // Mettre à jour l'affichage avec les scènes mises à jour
    populateSceneList(jsonData.scenes);
}

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    const sceneNameInput = document.getElementById('scene-name');
    const tagSelect = document.getElementById('tags-select');
    
    // Remplir les champs avec les données de la scène
    sceneNameInput.value = scene.name;
    scene.image ? document.getElementById('image-360').setAttribute('src', "uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "assets/grey-background.avif");

    const cameraData = scene.camera || { vertical: 0, horizontal: 0 };
    document.getElementById('camera-vertical').value = cameraData.vertical;
    document.getElementById('camera-horizontal').value = cameraData.horizontal;

    tagSelect.innerHTML = '';
    const tags = scene.tags || [];
    tags.forEach((tag, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = tag.name;
        tagSelect.appendChild(option);
    });

    if (tags.length > 0) {
        loadTagDetails(tags, 0);
    }

    // Écouter les changements sur le champ de nom de scène
    sceneNameInput.addEventListener('input', function() {
        jsonData.scenes.forEach(s => {
            if (s.name === scene.name) {
                s.name = this.value; // Mettre à jour le nom dans jsonData
            }
        });
    });

    // Écouter les changements sur les angles de la caméra
    document.getElementById('camera-vertical').addEventListener('input', function() {
        jsonData.scenes.forEach(s => {
            if (s.name === scene.name) {
                s.camera.vertical = this.value; // Mettre à jour l'angle vertical dans jsonData
            }
        });
    });

    document.getElementById('camera-horizontal').addEventListener('input', function() {
        jsonData.scenes.forEach(s => {
            if (s.name === scene.name) {
                s.camera.horizontal = this.value; // Mettre à jour l'angle horizontal dans jsonData
            }
        });
    });

    // Écouter le changement du tag sélectionné
    tagSelect.addEventListener('change', function() {
        loadTagDetails(tags, this.value); // Passer l'index sélectionné
    });
}

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTagIndex) {
    const tag = tags[selectedTagIndex];
    const tagNameInput = document.getElementById('tag-name-input');
    const tagLegendInput = document.getElementById('tag-legend-area');
    const rInput = document.getElementById('r');
    const thetaInput = document.getElementById('theta');
    const fiInput = document.getElementById('fi');

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = tag.name;
    tagLegendInput.value = tag.legend;
    rInput.value = tag.position.r;
    thetaInput.value = tag.position.theta;
    fiInput.value = tag.position.fi;

    // Ajouter des écouteurs d'événements pour enregistrer les modifications
    tagNameInput.addEventListener('input', function() {
        // Mettre à jour le nom du tag dans jsonData
        jsonData.scenes.forEach(scene => {
            if (scene.tags[selectedTagIndex]) {
                scene.tags[selectedTagIndex].name = this.value; // Utiliser jsonData
            }
        });
        // Mettre à jour l'option correspondante dans la liste déroulante
        const tagSelect = document.getElementById('tags-select');
        tagSelect.options[selectedTagIndex].textContent = this.value;
    });

    tagLegendInput.addEventListener('input', function() {
        jsonData.scenes.forEach(scene => {
            if (scene.tags[selectedTagIndex]) {
                scene.tags[selectedTagIndex].legend = this.value; // Utiliser jsonData
            }
        });
    });

    rInput.addEventListener('input', function() {
        jsonData.scenes.forEach(scene => {
            if (scene.tags[selectedTagIndex]) {
                scene.tags[selectedTagIndex].position.r = this.value; // Utiliser jsonData
            }
        });
    });

    thetaInput.addEventListener('input', function() {
        jsonData.scenes.forEach(scene => {
            if (scene.tags[selectedTagIndex]) {
                scene.tags[selectedTagIndex].position.theta = this.value; // Utiliser jsonData
            }
        });
    });

    fiInput.addEventListener('input', function() {
        jsonData.scenes.forEach(scene => {
            if (scene.tags[selectedTagIndex]) {
                scene.tags[selectedTagIndex].position.fi = this.value; // Utiliser jsonData
            }
        });
    });
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    await fetchData();
    const scenes = jsonData.scenes;

    populateSceneList(scenes);
    if (scenes.length > 0) {
        updateSceneDetails(scenes[0]);
    }
}

// Fonction pour sauvegarder les données de la page dans jsonData et le fichier JSON
async function saveData() {
    const sceneName = document.getElementById('scene-name').value;
    const cameraVertical = document.getElementById('camera-vertical').value;
    const cameraHorizontal = document.getElementById('camera-horizontal').value;

    // Mettre à jour les données de la scène correspondante dans jsonData
    jsonData.scenes.forEach(scene => {
        if (scene.name === sceneName) {
            scene.camera = {
                vertical: cameraVertical,
                horizontal: cameraHorizontal
            };
            // Pas besoin de mettre à jour les tags ici, car ils sont déjà mis à jour via les événements
        }
    });

    await updateJSON(jsonData); // Enregistrer les données JSON
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
    document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});
