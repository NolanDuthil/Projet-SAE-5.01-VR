import { loadFromLocalStorage } from "./model.js";
import { populateRoomList, updateRoomDetails, setupTag } from "./vue.js";

let vrExperience = {};

function initializeListeners() {
    document.getElementById('save-button').addEventListener('click', saveToLocalStorage);
    document.getElementById('delete-tag').addEventListener('click', deleteTag);
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

async function loadPageData(experience) {
    populateRoomList(experience.rooms);
    if (experience.rooms.length > 0) {
        updateRoomDetails(experience.rooms[0]);
    }
}

export function updateTagData(currentRoom, tagName, property, value) {
    const tag = currentRoom.tags.find(tag => tag.name === tagName);
    if (tag) {
        tag[property] = value;
        setupTag(tag);
    }
}

async function init() {
    vrExperience = loadFromLocalStorage();
    await loadPageData(vrExperience);
    // initializeListeners();
}

init();