// URL du fichier JSON externe
const jsonUrl = '../data.json';

// Fonction asynchrone pour récupérer les données JSON
async function fetchData(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du fichier: ' + response.statusText);
        }
        const data = await response.json();
        return data;
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
        sceneImage.src = "uploaded_images/" + scene.image;
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

    // Ajouter le bouton pour ajouter une nouvelle scène
    const addSceneButton = document.createElement('div');
    addSceneButton.classList.add('add-scene');
    addSceneButton.textContent = '+';
    scenesContainer.appendChild(addSceneButton);
}


// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    // Remplir le nom de la scène & l'image
    document.getElementById('scene-name').value = scene.name;
    document.getElementById('image-360').setAttribute('src', "uploaded_images/" + scene.image);

    // Remplir les angles de la caméra (exemple : données fictives ici, vous pouvez les ajuster)
    const cameraData = {
        vertical: 0,  // À ajuster selon vos données
        horizontal: 0  // À ajuster selon vos données
    };
    document.getElementById('camera-vertical').value = cameraData.vertical;
    document.getElementById('camera-horizontal').value = cameraData.horizontal;

    // Réinitialiser le menu déroulant des tags
    const tagSelect = document.getElementById('tags-select');
    tagSelect.innerHTML = ''; // Vider le menu avant d'ajouter les nouvelles options

    const tags = scene.tags || {};  // Ajouter un contrôle pour les scènes sans tags
    for (let tagKey in tags) {
        if (tags.hasOwnProperty(tagKey)) {
            const tag = tags[tagKey];

            // Créer une nouvelle option
            const option = document.createElement('option');
            option.value = tagKey;
            option.textContent = tagKey;

            // Ajouter l'option au menu déroulant
            tagSelect.appendChild(option);
        }
    }

    // Remplir les informations du premier tag par défaut
    if (Object.keys(tags).length > 0) {
        loadTagDetails(tags, Object.keys(tags)[0]);
    }

    // Mettre à jour les détails du tag sélectionné lorsqu'il change
    tagSelect.addEventListener('change', function () {
        loadTagDetails(tags, this.value);
    });
}

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTag) {
    const tag = tags[selectedTag];

    // Remplir le nom du tag
    document.getElementById('tag-name').value = selectedTag;

    // Remplir la légende du tag
    document.getElementById('tag-legend').value = tag.legend;

    // Remplir la position du tag
    document.getElementById('r').value = tag.position.r;
    document.getElementById('theta').value = tag.position.theta;
    document.getElementById('fi').value = tag.position.fi;
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    const jsonData = await fetchData(jsonUrl);
    const scenes = jsonData.scenes || scenesData.scenes; // Utiliser les données par défaut si la récupération échoue

    populateSceneList(scenes);
    updateSceneDetails(scenes[0]);
    populateSceneList(scenes);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', loadPageData);
