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
    document.getElementById('export-json').addEventListener('click', exportToJson);
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

    // Libérer l'URL après utilisation
    URL.revokeObjectURL(url);
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