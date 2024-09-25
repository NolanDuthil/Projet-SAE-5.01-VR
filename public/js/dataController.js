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

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    await fetchData();

    // populateSceneList(scenes);
    if (jsonData.scenes.length > 0) {
        updateSceneDetails(jsonData.scenes[0]);
    }
}

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    // Nom & Image de la scène
    document.getElementById('scene-name').value = scene.name;
    scene.image ? document.getElementById('image-360').setAttribute('src', "uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "assets/grey-background.avif");

    // Angle Caméra de la scène
    document.getElementById('camera-vertical').value = scene.camera.vertical;
    document.getElementById('camera-horizontal').value = scene.camera.horizontal;

    // Liste de tags
    const tagSelect = document.getElementById('tags-select');
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
        // loadTagDetails(tags, 0);
    }

    // Écouter les changements sur le champ de nom de scène
    document.getElementById('scene-name').addEventListener('input', () => {
        scene.name = this.value;
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

// Initialisation
async function init(){
    await loadPageData();
    // document.getElementById('add-scene').addEventListener('click', addNewScene); 
    // document.getElementById('save-button').addEventListener('click', saveData); 
    // document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});
