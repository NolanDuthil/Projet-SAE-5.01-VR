import Scene from "./Scene.js";
import TagInfo from "./TagInfo.js";
import TagPorte from "./TagPorte.js";

// Déclarez jsonData ici pour qu'il soit accessible à toutes les fonctions
let scenesInstances = []; 
let selectedScene = {};
let selectedTag = 0;

// Fonction pour remplir le menu des scènes
function populateSceneList() {
    const scenesContainer = document.getElementById('scenes');
    scenesContainer.innerHTML = ''; // Vider le conteneur

    scenesInstances.forEach(scene => {
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

// Fonction pour mettre à jour les détails de la scène
function updateSceneDetails(scene) {
    selectedScene = scene;
    console.log(selectedScene)
    const sceneNameInput = document.getElementById('scene-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');

    // Nom & Image de la scène
    sceneNameInput.value = selectedScene.name;
    selectedScene.image ? document.getElementById('image-360').setAttribute('src', "./uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "./assets/grey-background.avif");

    // Angle Caméra de la scène
    cameraVerticalInput.value = selectedScene.camera.vertical;
    cameraHorizontalInput.value = selectedScene.camera.horizontal;

    // Liste de tags
    tagSelect.innerHTML = '';
    const tags = selectedScene.tags || [];
    tags.forEach((tag, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = tag.name;
        tagSelect.appendChild(option);
    });

    updateCanvaTags(selectedScene);

    // Affichage des données du premier tag
    if (tags.length > 0) {
        loadTagDetails(tags, 0);
    } else {
        hideTags();
    }

    // Listener pour le nom de la scène
    sceneNameInput.addEventListener('input', ()=>{
        selectedScene.name = this.value;
    });

    // Listener pour l'angle vertical de la caméra
    cameraVerticalInput.addEventListener('input', ()=>{
        selectedScene.camera.vertical = this.value
    });

    // Listener pour l'angle horizontal de la caméra
    cameraHorizontalInput.addEventListener('input', ()=>{
        selectedScene.camera.horizontal = this.value;
    });

    // Listener pour le changement de tag
    tagSelect.addEventListener('change', ()=>{
        loadTagDetails(tags, this.value);
    });
}

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTagIndex) {
    selectedTag = selectedTagIndex;

    // Affiche les paramètres des tags
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

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = tag.name;
    tagLegendInput.value = tag.legend;
    rInput.value = tag.position.r;
    thetaInput.value = tag.position.theta;
    fiInput.value = tag.position.fi;

    sceneSelector.innerHTML = ''; // Vider le sélecteur
    scenesInstances.forEach((scene, index) => {
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
        sceneSelector.value = tag.action;
        sceneSelector.addEventListener('change', ()=>{
            tag.action = this.value;
        });
    } else {
        sceneSelectorContainer.style.display = 'none';
    }

    // Ajouter un listener pour changer le type de tag
    tagTypeSelector.value = tag.type; 
    tagTypeSelector.addEventListener('change', ()=>{
        tag.type = this.value;
        // Afficher ou cacher le sélecteur de scène selon le type sélectionné
        tag.type === 'porte' ? sceneSelectorContainer.style.display = '' : sceneSelectorContainer.style.display = 'none';
        updateCanvaTagInformations(tag);
    });

    tagNameInput.addEventListener('input', ()=>{
        tag.name = this.value;
        tagSelect.options[selectedTagIndex].textContent = this.value;
    });

    tagLegendInput.addEventListener('input', ()=>{
        tag.legend = this.value;
    });

    rInput.addEventListener('input', ()=>{
        tag.position.r = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
    });

    thetaInput.addEventListener('input', ()=>{
        tag.position.theta = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
    });

    fiInput.addEventListener('input', ()=>{
        tag.position.fi = this.value === '' ? 0 : this.value;
        updateCanvaTagInformations(tag);
    });
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
    const newScene = new Scene(
        `Scene ${Date.now()}`,
        "",
        {
            vertical: "0",
            horizontal: "0"      
        }, 
        []
    )
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

    // Mettre à jour l'affichage avec les scènes mises à jour
    updateSceneDetails(selectedScene);
}

// Fonction pour charger les données JSON depuis localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData){
        return JSON.parse(storedData);
    } else {
        initializeDefaultData();
        return null;
    }
}

// Fonction pour initialiser les données par défaut dans localStorage
function initializeDefaultData() {
    // Créer les scènes avec des instances de classes
    const scene1 = new Scene(
        "Entrée Studio",
        "GS__3523.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("1", "Porte Studio (côté extérieur)", "1", { r: "25", theta: "90", fi: "-115" }),
            new TagInfo("2", "Une information", "Nouvelle information", { r: "30", theta: "90", fi: "-40" })
        ]
    );

    const scene2 = new Scene(
        "Salle 1 Studio",
        "GS__3524.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("3", "Porte Studio (côté intérieur)", "0", { r: "30", theta: "90", fi: "135" }),
            new TagPorte("4", "Porte Salle 2 Studio", "2", { r: "30", theta: "90", fi: "-40" })
        ]
    );

    const scene3 = new Scene(
        "Salle 2 Studio",
        "GS__3525.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("5", "Porte Salle 1 Studio", "1", { r: "30", theta: "90", fi: "-40" }),
            new TagPorte("6", "Porte Salle 3 Studio", "3", { r: "40", theta: "90", fi: "-140" })
        ]
    );

    const scene4 = new Scene(
        "Salle 3 Studio",
        "GS__3526.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("7", "Porte Salle 2 Studio", "2", { r: "40", theta: "90", fi: "-65" })
        ]
    );

    // Ajouter les scènes au jsonData
    scenesInstances.push(scene1, scene2, scene3, scene4);

    // Enregistrer les données dans le stockage local
    saveToLocalStorage();
}


// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
    let jsonData = loadFromLocalStorage();

    // Créer des instances de la classe Scene à partir des données JSON
    if (jsonData != null) {
        scenesInstances = jsonData.map(sceneData => {
            const tags = sceneData._tags.map(tagData => {
                // Créer une instance de TagInfo ou TagPorte selon le type
                if (tagData._type === 'porte') {
                    return new TagPorte(tagData._id, tagData._name, tagData._legend, tagData._position, tagData._action);
                } else {
                    return new TagInfo(tagData._id, tagData._name, tagData._legend, tagData._position);
                }
            });
            return new Scene(sceneData._name, sceneData._image, sceneData._camera, tags);
        });
    }
    
    populateSceneList();
    if (scenesInstances.length > 0) {
        selectedScene = scenesInstances[0];
        updateSceneDetails(selectedScene);
    }
}

// Fonction pour sauvegarder les données JSON dans localStorage
function saveToLocalStorage() {
    localStorage.setItem('jsonData', JSON.stringify(scenesInstances));
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

// Fonction pour importer un fichier JSON
function importFromJson(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                jsonData = importedData;
                populateSceneList(jsonData.scenes);
                if (jsonData.scenes.length > 0) {
                    updateSceneDetails(jsonData.scenes[0]);
                }
                saveToLocalStorage();
                alert('Données importées avec succès !');
            } catch (error) {
                alert('Erreur lors de l\'importation du fichier JSON.');
            }
        };
        reader.readAsText(file);
    }
}

// Initialisation
async function init() {
    await loadPageData();
    document.getElementById('add-scene').addEventListener('click', addNewScene);
    document.getElementById('save-button').addEventListener('click', saveToLocalStorage);
    document.getElementById('add-tag-btn').addEventListener('click', addNewTag)
    document.getElementById('export-json').addEventListener('click', exportToJson);
    document.getElementById('import-json-input').addEventListener('click', importFromJson);
    // document.getElementById('delete-scene').addEventListener('click', deleteScene);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});