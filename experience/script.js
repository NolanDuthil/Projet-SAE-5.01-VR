import "../js/fromSpherical.js";
import {loadFromLocalStorage} from "../js/dataLoader.js"

let currentlyVisibleInfoLegend = null;
let scenesInstances = [];

function updateCameraRotation(scene) {
    let cameraEntity = document.getElementById('cam');
    let camera = document.getElementById('camera');

    // Désactiver temporairement les look-controls
    camera.removeAttribute('look-controls');

    // Réinitialiser la rotation
    camera.setAttribute('rotation', { x: 0, y: 0, z: 0 });

    // Appliquer la nouvelle rotation basée sur la scène sélectionnée
    cameraEntity.setAttribute('rotation', {
        x: scene.camera.vertical,
        y: scene.camera.horizontal,
        z: 0
    });

    // Réactiver les look-controls pour permettre à l'utilisateur de bouger la caméra ensuite
    camera.setAttribute('look-controls', 'enabled: true');
}

// Fonction pour charger une scène
function loadScene(scene) {
    let canva = document.getElementById('a-scene');
    updateCameraRotation(scene);

    // Changer l'image de fond
    document.querySelector('#image-360').setAttribute('src', '../uploaded_images/'+scene.image);

    // Supprimer tous les anciens tags
    let pastTags = document.querySelectorAll('a-sphere, a-text');
    pastTags.forEach((pastTag) => {
        pastTag.remove(); // Supprimer les anciennes sphères et textes
    });

    // Créer de nouveaux tags
    scene.tags.forEach((tag) => {
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
            tagText.setAttribute('color', tag.textColor);
            tagText.setAttribute('align', 'center');
            tagText.setAttribute('width', '20');
            tagText.setAttribute('look-at', '[camera]'); 
    
            if (tag.type == 'porte') {
                tagSphere.addEventListener('click', () => {
                    const nextScene = scenesInstances[tag.action];
                    if (nextScene) {
                        loadScene(nextScene);
                    }
                });
            }

            if (tag.type === 'info') {
                tagText.setAttribute('opacity', '0'); // Opacité à 0 (invisible)
                tagText.setAttribute('visible', 'false'); // Masqué par défaut

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
        }
        
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
    });
}

// Fonction pour sauvegarder les données JSON dans localStorage
function saveToLocalStorage() {
    localStorage.setItem('jsonData', JSON.stringify(scenesInstances));
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

scenesInstances = loadFromLocalStorage();
saveToLocalStorage()
loadScene(scenesInstances[0]);