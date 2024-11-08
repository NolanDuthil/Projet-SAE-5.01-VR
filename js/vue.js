import { updateTagData, updateRoomData } from './controller.js';

let selectedRoom = {};
let selectedTag = {};
let roomsInstances = [];
let areRoomListenersInitialized = false;
let areTagListenersInitialized = false;

export function populateRoomList(roomsInstancesTemp) {
    const roomsContainer = document.getElementById('rooms');
    roomsContainer.innerHTML = ''; // Vider le conteneur
    roomsInstances = roomsInstancesTemp;

    roomsInstances.forEach(room => {
        const roomItem = document.createElement('div');
        roomItem.classList.add('left_side__rooms__item');

        const roomImage = document.createElement('img');
        roomImage.src = room.src360 ? "./uploaded_images/" + room.src360 : "./uploaded_images/default.avif";
        roomImage.alt = room.name;
        roomImage.classList.add('left_side__rooms__item__image');

        const roomLabel = document.createElement('div');
        roomLabel.classList.add('left_side__rooms__item__label');
        roomLabel.textContent = room.name;

        roomItem.appendChild(roomImage);
        roomItem.appendChild(roomLabel);

        roomItem.addEventListener('click', () => {
            updateRoomDetails(room);
        });

        roomsContainer.appendChild(roomItem);
    });
}

export function updateRoomDetails(actualRoom) {
    selectedRoom = actualRoom;

    const roomNameInput = document.getElementById('room-name');
    const cameraVerticalInput = document.getElementById('camera-vertical');
    const cameraHorizontalInput = document.getElementById('camera-horizontal');
    const tagSelect = document.getElementById('tags-select');

    roomNameInput.value = selectedRoom.name;
    const roomImage = selectedRoom.src360 ? "./uploaded_images/" + selectedRoom.src360 : "./uploaded_images/default.avif";
    document.getElementById('image-360').setAttribute('src', roomImage);

    cameraVerticalInput.value = selectedRoom.camera.vertical;
    cameraHorizontalInput.value = selectedRoom.camera.horizontal;

    tagSelect.innerHTML = '';
    const tags = selectedRoom.tags || [];
    tags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag.id;
        option.textContent = tag.name;
        tagSelect.appendChild(option);
    });
    tagSelect.addEventListener('change', (event) => {
        loadTagDetails(selectedRoom.getTag(event.target.value));
    });

    updateCanvaTags();
    updateCameraRotation(selectedRoom);
    if (tags.length > 0) {
        loadTagDetails(selectedRoom.tags[0]);
    } else {
        hideTags();
    }

    if (!areRoomListenersInitialized) {
        roomNameInput.addEventListener('input', (event) => {
            updateRoomData(selectedRoom.id, 'name', event.target.value);
        });

        cameraVerticalInput.addEventListener('input', (event) => {
            let vValue = event.target.value;
            if (vValue == "") {
                vValue = 0;
            }
            updateRoomData(selectedRoom.id, 'camera.vertical', vValue);
            updateCameraRotation(selectedRoom);
        });

        cameraHorizontalInput.addEventListener('input', (event) => {
            let hValue = event.target.value;
            if (hValue == "") {
                hValue = 0;
            }
            updateRoomData(selectedRoom.id, 'camera.horizontal', hValue);
            updateCameraRotation(selectedRoom);
        });
        areRoomListenersInitialized = true;
    }
}

function updateCanvaTags() {
    let tags = selectedRoom.tags || [];
    let pastTags = document.querySelectorAll('a-sphere, a-text');
    pastTags.forEach((tag) => {
        tag.remove();
    });
    tags.forEach((tag) => {
        setupTag(tag);
    });
}


// Fonction pour mettre à jour la rotation de la caméra en fonction de la scène sélectionnée
export function updateCameraRotation(room) {
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

export function resetCameraRotation() {
    let cameraEntity = document.getElementById('cam');
    let camera = document.getElementById('camera');

    // Désactiver temporairement les look-controls
    camera.removeAttribute('look-controls');

    // Réinitialiser la rotation
    camera.setAttribute('rotation', { x: 0, y: 0, z: 0 });

    // Réactiver les look-controls pour permettre à l'utilisateur de bouger la caméra ensuite
    camera.setAttribute('look-controls', 'enabled: true');
}

// Fonction pour cacher l'interface de tag quand il n'y en a pas sur la scène
function hideTags() {
    document.getElementById('tag-name').style = "display:none";
    document.getElementById('tag-legend').style = "display:none";
    document.getElementById('tag-position').style = "display:none";
    document.getElementById('room-selector-container').style = "display:none";
    document.getElementById('color-selector-container').style = "display:none";
}

export function setupTag(tag) {
    let canva = document.getElementById('a-scene');

    // Supprimer les anciennes instances du tag (sphère ou texte)
    let pastTag = document.getElementById(tag.id);
    let pastText = document.getElementById(tag.id + '-text');

    if (pastTag) {
        pastTag.remove();
    }
    if (pastText) {
        pastText.remove();
    }
    // if(tag != null) console.log(tag.textColor)

    // Créer une sphère pour les tags de type 'porte' ou 'info'
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
            tagText.setAttribute('fromspherical', `phi:${tag.position.phi}; theta:${tag.position.theta - thetaAdjustment}; r:${tag.position.r};`);

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
        tagText.setAttribute('fromspherical', `phi:${tag.position.phi}; theta:${tag.position.theta}; r:${tag.position.r};`);

        // Ajouter le texte au canvas
        canva.appendChild(tagText);
    }
}

export function getDistanceToCamera(el) {
    // Récupérer la position de la caméra
    let camera = document.querySelector('a-camera');
    let cameraPos = camera.object3D.position;

    // Récupérer la position de l'élément (la sphère)
    let elPos = el.object3D.position;
    // Calculer la distance entre la caméra et l'élément
    let distance = elPos.distanceTo(cameraPos);

    return distance;
}

export function changeActiveTag(tag) {
    loadTagDetails(tag);
    let selectTag = document.getElementById('tags-select');
    selectTag.value = tag.id;
}

// Fonction pour remplir les détails du tag sélectionné
export function loadTagDetails(tag) {
    selectedTag = tag;

    // Affiche les paramètres des tags
    document.getElementById('tag-name').style = "";
    document.getElementById('tag-legend').style = "";
    document.getElementById('tag-position').style = "";
    document.getElementById('color-selector-container').style = "";
    document.getElementById('room-selector-container').style = "";

    const tagNameInput = document.getElementById('tag-name-input');
    const tagLegendContainer = document.getElementById('tag-legend')
    const tagLegendInput = document.getElementById('tag-legend-area');
    const rInput = document.getElementById('r');
    const thetaInput = document.getElementById('theta');
    const phiInput = document.getElementById('phi');
    const tagSelect = document.getElementById('tags-select');
    const roomSelectorContainer = document.getElementById('room-selector-container');
    const roomSelector = document.getElementById('room-selector');
    const colorSelector = document.getElementById('color-selector');

    // Remplir les champs de formulaire avec les données du tag sélectionné
    tagNameInput.value = selectedTag.name;
    tagLegendInput.value = selectedTag.legend;
    rInput.value = selectedTag.position.r;
    thetaInput.value = selectedTag.position.theta;
    phiInput.value = selectedTag.position.phi;
    colorSelector.value = selectedTag.textColor;

    roomSelector.innerHTML = '';
    roomsInstances.forEach((room, index) => {
        if (room != selectedRoom) {
            const option = document.createElement('option');
            option.value = index;
            if (selectedTag.action === index) option.selected = true;
            option.textContent = room.name;
            roomSelector.appendChild(option);
        }
    });

    // Si le type du tag est "porte", afficher le sélecteur de scène
    if (selectedTag.type === 'porte') {
        tagLegendContainer.style.display = 'none';
        roomSelectorContainer.style.display = '';
        roomSelector.value = selectedTag.action;
        roomSelector.addEventListener('change', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'action', event.target.value);
        });
    } else {
        roomSelectorContainer.style.display = 'none';
        tagLegendContainer.style.display = '';
    }

    if (!areTagListenersInitialized) {
        tagNameInput.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'name', event.target.value);
            const optionToUpdate = Array.from(tagSelect.options).find(option => option.value == selectedTag.id);
            if (optionToUpdate) {
                optionToUpdate.textContent = event.target.value;
            }
        });

        tagLegendInput.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'legend', event.target.value);
        });

        rInput.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'position.r', event.target.value === '' ? 0 : event.target.value);
        });

        thetaInput.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'position.theta', event.target.value === '' ? 0 : event.target.value);
        });

        phiInput.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'position.fi', event.target.value === '' ? 0 : event.target.value);
        });

        colorSelector.addEventListener('input', (event) => {
            updateTagData(selectedRoom, selectedTag.id, 'textColor', event.target.value);
        })
        areTagListenersInitialized = true;
    }
}

export function getActualRoom() {
    return selectedRoom;
}

export function getActualTag() {
    return selectedTag;
}