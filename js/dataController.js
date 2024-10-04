import Scene from "./Scene.js";
import TagInfo from "./TagInfo.js";
import TagPorte from "./TagPorte.js";
import TagText from "./TagText.js";
import {loadFromLocalStorage} from './dataLoader.js'

// Déclarez jsonData ici pour qu'il soit accessible à toutes les fonctions
let scenesInstances = [];
let selectedScene = {};
let selectedTagIndex = 0;
let selectedTag = {};
let currentlyVisibleInfoLegend = null;

// Fonction pour remplir le menu des scènes
function populateSceneList() {
    const scenesContainer = document.getElementById('scenes');
    scenesContainer.innerHTML = ''; // Vider le conteneur

    scenesInstances.forEach(scene => {
        // Créer un élément pour la scène
        const sceneItem = document.createElement('div');
        sceneItem.classList.add('main__bottom_panel__left_side__scenes__item');

        // Créer une image pour la scène
        const sceneImage = document.createElement('img');
        // Vérifier si l'image est vide et utiliser l'image par défaut si c'est le cas
        sceneImage.src = scene.image ? "./uploaded_images/" + scene.image : "./assets/grey-background.avif";
        sceneImage.alt = scene.name;
        sceneImage.classList.add('main__bottom_panel__left_side__scenes__item__image');

        // Créer une étiquette pour le nom de la scène
        const sceneLabel = document.createElement('div');
        sceneLabel.classList.add('main__bottom_panel__left_side__scenes__item__label');
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
    updateCameraRotation()
    const sceneNameInput = document.getElementById('scene-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');

    // Nom & Image de la scène
    sceneNameInput.value = selectedScene.name;
    selectedScene.image ? document.getElementById('image-360').setAttribute('src', "./uploaded_images/" + scene.image) : document.getElementById('image-360').setAttribute('src', "./assets/grey-background.avif");

    // // Angle Caméra de la scène
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
    sceneNameInput.addEventListener('input', (event) => {
        selectedScene.name = event.target.value;
    });

    // Listener pour l'angle vertical de la caméra
    cameraVerticalInput.addEventListener('input', (event) => {
        selectedScene.camera.vertical = event.target.value;
        updateCameraRotation()
    });

    // Listener pour l'angle horizontal de la caméra
    cameraHorizontalInput.addEventListener('input', (event) => {
        selectedScene.camera.horizontal = event.target.value;
        updateCameraRotation()
    });

    // Listener pour le changement de tag
    tagSelect.addEventListener('change', (event) => {
        loadTagDetails(tags, event.target.value);
    });
}

function updateCameraRotation() {
    let cameraEntity = document.getElementById('cam');
    let camera = document.getElementById('camera');

    // Désactiver temporairement les look-controls
    camera.removeAttribute('look-controls');

    // Réinitialiser la rotation
    camera.setAttribute('rotation', { x: 0, y: 0, z: 0 });

    // Appliquer la nouvelle rotation basée sur la scène sélectionnée
    cameraEntity.setAttribute('rotation', {
        x: selectedScene.camera.vertical,
        y: selectedScene.camera.horizontal,
        z: 0
    });

    // Réactiver les look-controls pour permettre à l'utilisateur de bouger la caméra ensuite
    camera.setAttribute('look-controls', 'enabled: true');
}

// Fonction pour remplir les détails du tag sélectionné
function loadTagDetails(tags, selectedTagI) {
    selectedTagIndex = selectedTagI;
    selectedTag = tags[selectedTagIndex];

    // Affiche les paramètres des tags
    document.getElementById('tag-settings').style = "";
    document.getElementById('tag-name').style = "";
    document.getElementById('tag-legend').style = "";
    document.getElementById('tag-position').style = "";

    const tagNameInput = document.getElementById('tag-name-input');
    const tagLegendContainer = document.getElementById('tag-legend')
    const tagLegendInput = document.getElementById('tag-legend-area');
    const rInput = document.getElementById('r');
    const thetaInput = document.getElementById('theta');
    const fiInput = document.getElementById('fi');
    const tagSelect = document.getElementById('tags-select');
    const sceneSelectorContainer = document.getElementById('scene-selector-container');
    const sceneSelector = document.getElementById('scene-selector');
    const colorSelector = document.getElementById('color-selector');

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = selectedTag.name;
    tagLegendInput.value = selectedTag.legend;
    rInput.value = selectedTag.position.r;
    thetaInput.value = selectedTag.position.theta;
    fiInput.value = selectedTag.position.fi;
    colorSelector.value = selectedTag.textColor;

    sceneSelector.innerHTML = '';
    scenesInstances.forEach((scene, index) => {
        if (scene != selectedScene) {
            const option = document.createElement('option');
            option.value = index; 
            option.textContent = scene.name;
            sceneSelector.appendChild(option);
        }
    });

    // Si le type du tag est "porte", afficher le sélecteur de scène
    if (selectedTag.type === 'porte') {
        tagLegendContainer.style.display = 'none';
        sceneSelectorContainer.style.display = '';
        sceneSelector.value = selectedTag.action;
        sceneSelector.addEventListener('change', (event) => {
            selectedTag.action = event.target.value;
        });
    } else {
        sceneSelectorContainer.style.display = 'none';
        tagLegendContainer.style.display = '';
    }

    tagNameInput.addEventListener('input', (event) => {
        selectedTag.name = event.target.value;
        tagSelect.options[selectedTagIndex].textContent = event.target.value;
        setupTag(selectedTag);
    });

    tagLegendInput.addEventListener('input', (event) => {
        selectedTag.legend = event.target.value;
        setupTag(selectedTag);
    });

    rInput.addEventListener('input', (event) => {
        selectedTag.position.r = event.target.value === '' ? 0 : event.target.value;
        setupTag(selectedTag);
    });

    thetaInput.addEventListener('input', (event) => {
        selectedTag.position.theta = event.target.value === '' ? 0 : event.target.value;
        setupTag(selectedTag);
    });

    fiInput.addEventListener('input', (event) => {
        selectedTag.position.fi = event.target.value === '' ? 0 : event.target.value;
        setupTag(selectedTag);
    });

    colorSelector.addEventListener('input', (event) => {
        selectedTag.textColor = event.target.value;
        setupTag(selectedTag);
    })
}

function getDistanceToCamera(el) {
    // Récupérer la position de la caméra
    let camera = document.querySelector('a-camera');
    let cameraPos = camera.object3D.position;

    // Récupérer la position de l'élément (la sphère)
    let elPos = el.object3D.position;
    // Calculer la distance entre la caméra et l'élément
    let distance = elPos.distanceTo(cameraPos);

    return distance;
}

function hideTags() {
    document.getElementById('tag-settings').style = "display:none";
    document.getElementById('tag-name').style = "display:none";
    document.getElementById('tag-legend').style = "display:none";
    document.getElementById('tag-position').style = "display:none";
}

function updateCanvaTags(scene) {
    let pastTags = document.querySelectorAll('a-sphere, a-text');
    pastTags.forEach((tag) => {
        tag.remove();
    })
    scene.tags.forEach((tag) => {
        setupTag(tag);
    });
}

function setupTag(tag) {
    let canva = document.getElementById('a-scene');

    // Supprimer les anciennes instances du tag (sphère ou texte)
    let pastTag = document.getElementById(tag.id);
    let pastText = document.getElementById(tag.id + "-text");
    if (pastTag) {
        pastTag.remove();
    }
    if (pastText) {
        pastText.remove();
    }

    // Créer une sphère pour les tags de type 'porte' ou 'info'
    if (tag.type === 'porte' || tag.type === 'info') {
        let tagSphere = document.createElement('a-sphere');
        tagSphere.setAttribute('color', tag.type === 'porte' ? 'red' : 'blue');
        tagSphere.setAttribute('id', tag.id);
        tagSphere.setAttribute('radius', 1);

        // Ajouter le composant de conversion des coordonnées sphériques
        tagSphere.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta}; r:${tag.position.r};`);

        // Ajouter la sphère au canvas
        canva.appendChild(tagSphere);

        // Créer un texte sous le tag 'porte' ou pour la légende 'info'
        let tagText = document.createElement('a-text');
        tagText.setAttribute('value', tag.type === 'porte' ? tag.name : tag.legend);
        tagText.setAttribute('id', tag.id + '-text');
        tagText.setAttribute('color', 'white');
        tagText.setAttribute('align', 'center');
        tagText.setAttribute('width', '20');
        tagText.setAttribute('look-at', '[camera]'); 

        // Par défaut, masquer la légende des tags 'info'
        if (tag.type === 'info') {
            tagText.setAttribute('opacity', '0'); // Opacité à 0 (invisible)
            tagText.setAttribute('visible', 'false'); // Masqué par défaut
        }

        // Attendre que la sphère soit chargée pour calculer la distance à la caméra
        tagSphere.addEventListener('loaded', function () {
            let distanceToCamera = getDistanceToCamera(tagSphere);

            // Ajustement de l'écart vertical en fonction de la distance à la caméra
            let baseOffset = -7; // Offset de base si proche
            let thetaAdjustment = baseOffset + (distanceToCamera * 0.1); // Écart proportionnel à la distance

            // Positionner le texte en fonction de l'ajustement
            tagText.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta - thetaAdjustment}; r:${tag.position.r};`);

            // Ajouter le texte au canvas
            canva.appendChild(tagText);
        });

        // Gestion de l'événement de clic pour afficher/masquer la légende du tag 'info'
        if (tag.type === 'info') {
            tagSphere.addEventListener('click', () => {
                // Si une légende est actuellement visible, la masquer
                if (currentlyVisibleInfoLegend) {
                    currentlyVisibleInfoLegend.text.setAttribute('visible', 'false');
                    currentlyVisibleInfoLegend.text.setAttribute('opacity', '0');
                }

                // Vérifier si c'est la légende actuellement visible
                if (currentlyVisibleInfoLegend && currentlyVisibleInfoLegend.text === tagText) {
                    tagText.setAttribute('visible', 'false');
                    tagText.setAttribute('opacity', '0'); 
                    currentlyVisibleInfoLegend = null;
                } else {
                    tagText.setAttribute('visible', 'true');
                    tagText.setAttribute('opacity', '1');
                    currentlyVisibleInfoLegend = { text: tagText };
                }
            });
        }
    }

    // Pour les tags de type 'text', seulement créer le texte sans sphère
    if (tag.type === 'text') {
        let tagText = document.createElement('a-text');
        tagText.setAttribute('value', tag.legend);
        tagText.setAttribute('id', tag.id + '-text');
        tagText.setAttribute('color', tag.textColor);
        tagText.setAttribute('align', 'center');
        tagText.setAttribute('width', '20');
        tagText.setAttribute('look-at', '[camera]');
        tagText.setAttribute('fromspherical', `fi:${tag.position.fi}; theta:${tag.position.theta}; r:${tag.position.r};`);

        // Ajouter le texte au canvas
        canva.appendChild(tagText);
    }
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
    scenesInstances.push(newScene);

    // Mettre à jour l'affichage avec les scènes mises à jour
    populateSceneList(scenesInstances);
    loadTagDetails(selectedScene.tags, selectedTagIndex);
}

// Fonction pour ajouter une nouvelle scène
async function addNewTag(type) {
    let newTag;

    switch (type) {
        case 'porte':
            newTag = new TagPorte(
                Date.now(),
                "Nouveau tag",
                "",
                {
                    r: "5",
                    theta: "90",
                    fi: "0"
                },
                "#ffffff"
            );
            break;

        case 'info':
            newTag = new TagInfo(
                Date.now(),
                "Nouveau tag",
                "Légende du nouveau tag",
                {
                    r: "5",
                    theta: "90",
                    fi: "0"
                },
                "#ffffff"
            );
            break;

        case 'text':
            newTag = new TagText(
                Date.now(),
                "nouveau tag",
                "Texte d'exemple",
                {
                    r: "5",
                    theta: "90",
                    fi: "0"
                },
                "#ffffff"
            );
            break;

        default:
            console.error('Type de tag inconnu:', type);
            return;
    }

    // Ajouter la nouvelle scène à jsonData
    selectedScene.addTag(newTag);

    // Mettre à jour l'affichage avec les scènes mises à jour
    updateSceneDetails(selectedScene);
}

async function deleteTag(){
    selectedScene.removeTag(selectedTagIndex);
    updateSceneDetails(selectedScene);
}

// Fonction pour charger les données de la page lorsque le document est prêt
async function loadPageData() {
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
    const jsonString = JSON.stringify(scenesInstances);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes_data.json'; // Nom du fichier téléchargé
    a.click();

    // Libérer l'URL après utilisation
    URL.revokeObjectURL(url);
}

// Fonction pour importer un fichier JSON via le formulaire
function importFromJson(event) {
    event.preventDefault();
    const fileInput = document.getElementById('import-json-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);
                loadPageData(importedData)
                alert('Données importées avec succès !');
            } catch (error) {
                alert('Erreur lors de l\'importation du fichier JSON.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Veuillez sélectionner un fichier JSON.');
    }
}

// Initialisation
async function init() {
    scenesInstances = loadFromLocalStorage();
    await loadPageData();
    document.getElementById('save-button').addEventListener('click', saveToLocalStorage);
    document.getElementById('delete-tag').addEventListener('click', deleteTag)
    document.getElementById('porte').addEventListener('click', function () {
        addNewTag('porte');
    });
    document.getElementById('info').addEventListener('click', function () {
        addNewTag('info');
    });
    document.getElementById('text').addEventListener('click', function () {
        addNewTag('text');
    });
    document.getElementById('export-json').addEventListener('click', exportToJson);
    document.getElementById('import-form').addEventListener('submit', importFromJson);
}

// Charger les données de la page lorsque le document est prêt
document.addEventListener('DOMContentLoaded', () => {
    init();
});