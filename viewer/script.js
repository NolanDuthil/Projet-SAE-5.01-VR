import { Experience, Room, Tag, TagPorte, TagInfo, TagText } from './classes.js';

let currentlyVisibleInfoLegend = null;
let vrExperience = [];

// Coordonnées Sphériques
function fromSpherical() {
    AFRAME.registerComponent('fromspherical', {
        // we will use two angles and a radius provided by the user 
        schema: {
            phi: {},
            theta: {},
            r: {},
        },
        init: function () {
            // lets change it to radians
            let phi = this.data.phi * Math.PI / 180;
            let theta = this.data.theta * Math.PI / 180;

            // The 'horizontal axis is x. The 'vertical' is y. 
            // The calculations below are straight from the wiki site.
            let z = (-1) * Math.sin(theta) * Math.cos(phi) * this.data.r;
            let x = Math.sin(theta) * Math.sin(phi) * this.data.r;
            let y = Math.cos(theta) * this.data.r;
            // position the element using the provided data
            this.el.setAttribute('position', {
                x: x,
                y: y,
                z: z
            });
            // rotate the element towards the camera
            this.el.setAttribute('look-at', '[camera]');
        }
    });
}

fromSpherical();

// Fonction pour obtenir l'ID de session à partir des cookies
function getSessionId() {
    const match = document.cookie.match(new RegExp('(^| )sessionId=([^;]+)'));
    return match ? match[2] : null;
}

// Fonction pour mettre à jour la rotation de la caméra en fonction de la scène sélectionnée
function updateCameraRotation(room) {
    let cameraEntity = document.getElementById('cam');
    let camera = document.getElementById('camera');

    // Désactiver temporairement les look-controls
    camera.removeAttribute('look-controls');

    // Réinitialiser la rotation
    camera.setAttribute('rotation', { x: 0, y: 0, z: 0 });

    // Appliquer la nouvelle rotation basée sur la scène sélectionnée
    cameraEntity.setAttribute('rotation', {
        x: room.camera.vertical,
        y: room.camera.horizontal,
        z: 0
    });

    // Réactiver les look-controls pour permettre à l'utilisateur de bouger la caméra ensuite
    camera.setAttribute('look-controls', 'enabled: true');
}

// Fonction pour calculer la distance entre la caméra et un élément
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

async function loadFromLocal() {
    const sessionId = getSessionId();
    const filePath = `/sae501/viewer/session_${sessionId}/scenes_data.json`;

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données locales');
        }
        const data = await response.json();
        let experience = transformJSON(data);
        return experience;
    } catch (error) {
        console.error('Error loading local data:', error);
        return null;
    }
}

// Fonction permettant de transformer les données du localStorage en un objet Experience
function transformJSON(data) {
    let experience = Object.assign(new Experience(), data);
    experience.rooms = experience.rooms.map(roomData => {
        let room = Object.assign(new Room(), roomData);
        room.tags = room.tags.map(tagData => {
            switch (tagData._type) {
                case 'porte':
                    return Object.assign(new TagPorte(), tagData);
                case 'info':
                    return Object.assign(new TagInfo(), tagData);
                case 'text':
                    return Object.assign(new TagText(), tagData);
                default:
                    return Object.assign(new Tag(), tagData);
            }
        });
        return room;
    });
    return experience;
}

// Fonction pour charger une scène
function loadScene(scene) {
    const sessionId = getSessionId();
    let canva = document.getElementById('a-scene');
    updateCameraRotation(scene);

    // Changer l'image de fond
    let roomImage = scene.src360 ? `/sae501/viewer/session_${sessionId}/uploaded_images/${scene.src360}` : `viewer/session_${sessionId}/uploaded_images/default.avif`;
    document.querySelector('#image-360').setAttribute('src', roomImage);

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
            tagSphere.setAttribute('fromspherical', `phi:${tag.position.phi}; theta:${tag.position.theta}; r:${tag.position.r};`);

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

            if (tag.type === 'porte') {
                tagSphere.addEventListener('click', () => {
                    const nextScene = vrExperience.rooms[tag.action];
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
                tagText.setAttribute('fromspherical', `phi:${tag.position.phi}; theta:${tag.position.theta - thetaAdjustment}; r:${tag.position.r};`);

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
            tagText.setAttribute('fromspherical', `phi:${tag.position.phi}; theta:${tag.position.theta}; r:${tag.position.r};`);

            // Ajouter le texte au canvas
            canva.appendChild(tagText);
        }
    });
}

async function init() {
    vrExperience = await loadFromLocal();
    if (vrExperience && vrExperience.rooms.length > 0) {
        loadScene(vrExperience.rooms[0]);
    } else {
        console.error("Aucune scène disponible.");
    }
}

init();
