import { loadFromLocalStorage, transformJSON } from "./model.js";
import { populateRoomList, updateRoomDetails, setupTag, getActualRoom, getActualTag, changeActiveTag, resetCameraRotation } from "./vue.js";
import { closePopup } from "./modales.js";

let vrExperience = {};

// Fonction pour initialiser les listeners
function initializeListeners() {
    document.getElementById('save-button').addEventListener('click', saveToLocalStorage);
    document.getElementById('confirm-delete-tag-button').addEventListener('click', deleteTag);
    document.getElementById('porte').addEventListener('click', function () {
        addNewTag('porte');
        closePopup('add-popup');
    });
    document.getElementById('info').addEventListener('click', function () {
        addNewTag('info');
        closePopup('add-popup');
    });
    document.getElementById('text').addEventListener('click', function () {
        addNewTag('text');
        closePopup('add-popup');
    });
    // document.getElementById('export-json').addEventListener('click', exportToJson);

    const confirmButton = document.getElementById('confirm-checkbox-popup');
    // Gestion du clic sur le bouton "Valider"
    confirmButton.addEventListener('click', () => {
        // Vérifie quelle case est cochée et appelle la fonction appropriée
        const json = document.getElementById('json');
        const zip = document.getElementById('zip');

        if (json.checked) {
            exportToJson(); // Appel de la fonction exportToJson si la première option est cochée
        } else if (zip.checked) {
            exportToZip(); // Appel de la fonction exportToZip si la deuxième option est cochée
        } else {
            alert('Veuillez sélectionner une option avant de valider.');
        }
    });

    document.getElementById('import-form').addEventListener('submit', importFromJson);
    document.getElementById('add-room').addEventListener('click', addNewRoom);
    document.getElementById('confirm-delete-room-button').addEventListener('click', deleteRoom);
}

function exportToJson() {
    let jsonString = vrExperience.exportExperience();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes_data.json'; // Nom du fichier téléchargé
    a.click();
}

async function exportToZip() {
    const zip = new JSZip();
    const imagesFolder = zip.folder("uploaded_images");

    await fetchAndAddImagesToZip(zip);

    // Ajouter le fichier JSON
    const jsonString = vrExperience.exportExperience();
    zip.file("scenes_data.json", jsonString);

    // Générer le fichier zip
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scenes_data.zip'; // Nom du fichier téléchargé
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Libérer l'URL après utilisation
        URL.revokeObjectURL(url);
    });
}

async function fetchAndAddImagesToZip(zip) {
    const imgFolder = zip.folder("uploaded_images");
    const imageUrls = vrExperience.rooms.flatMap(room => room.src360);

    for (let url of imageUrls) {
        let response = await fetch("./uploaded_images/" + url);
        let blob = await response.blob();
        let fileName = url.split("/").pop();
        imgFolder.file(fileName, blob);
    }
    console.log(imgFolder);
}

function importFromJson(event) {
    event.preventDefault();
    const fileInput = document.getElementById('import-json-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const loadData = JSON.parse(e.target.result);
                vrExperience = transformJSON(loadData);
                loadPageData(vrExperience);
                closePopup('import-popup');
            } catch (error) {
            }
        };
        reader.readAsText(file);
    }
}

// Fonction pour sauvegarder les données JSON dans localStorage
export function saveToLocalStorage() {
    localStorage.setItem('jsonData', JSON.stringify(vrExperience));
}

// Fonction pour charger la vue avec les données JSON
async function loadPageData(experience) {
    populateRoomList(experience.rooms);
    if (experience.rooms.length > 0) {
        updateRoomDetails(experience.rooms[0]);
    }
}

// Fonction pour update un tag
export function updateTagData(currentRoom, tagName, property, value) {
    const tag = currentRoom.getTag(tagName);
    if (tag) {
        const properties = property.split('.');
        let current = tag;
        for (let i = 0; i < properties.length - 1; i++) {
            current = current[properties[i]];
        }
        current[properties[properties.length - 1]] = value;
        setupTag(tag);
    }
}

function deleteTag() {
    let room = getActualRoom();
    let tag = getActualTag();
    room.deleteTag(tag.id);
    updateRoomDetails(room);
}

// Fonction pour ajouter un nouveau tag
function addNewTag(tagType) {
    let room = getActualRoom();
    let tag;
    switch (tagType) {
        case 'porte':
            tag = room.addPorteTag('Nouvelle porte');
            break;
        case 'info':
            tag = room.addInfoTag('Nouvelle info');
            break;
        case 'text':
            tag = room.addTextTag('Nouveau texte');
            break;
        default:
            break;
    }
    updateRoomDetails(room);
    changeActiveTag(tag);
    resetCameraRotation();
}

function addNewRoom() {
    let room = vrExperience.addRoom('Nouvelle salle');
    updateRoomDetails(room);
    populateRoomList(vrExperience.rooms);
}

function deleteRoom() {
    let room = getActualRoom();
    vrExperience.deleteRoom(room.id);
    updateRoomDetails(vrExperience.rooms[0]);
    populateRoomList(vrExperience.rooms);
}

// Fonction pour update une room
export function updateRoomData(roomId, property, value) {
    const room = vrExperience.getRoom(roomId);
    if (room) {
        const properties = property.split('.');
        let current = room;
        for (let i = 0; i < properties.length - 1; i++) {
            current = current[properties[i]];
        }
        current[properties[properties.length - 1]] = value;
    }
}

// Fonction init qui charge les données et initialise les listeners
async function init() {
    vrExperience = loadFromLocalStorage();

    saveToLocalStorage();

    await loadPageData(vrExperience);
    initializeListeners();
}

init();