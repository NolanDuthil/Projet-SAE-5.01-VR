import Experience from "./Experience.js";
import Room from "./Room.js";
import TagPorte from "./TagPorte.js";
import TagInfo from "./TagInfo.js";
import TagText from "./TagText.js";

// Fonction pour charger les données JSON depuis localStorage
export function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData) {
        let experience = transformJSON(JSON.parse(storedData));
        return experience;
    } else {
        let experience = initializeDefaultData();
        return experience;
    }
}

// Fonction pour initialiser les données par défaut dans localStorage
function initializeDefaultData() {
    // Init experience
    let experience = new Experience();

    // Room 1
    let room1 = experience.addRoom("Entrée Studio");
    room1.src360 = "GS__3523.JPG";
    room1.camera = { vertical: "0", horizontal: "0" };
    let porteTag1 = room1.addPorteTag("Porte Studio (cote exterieur)");
    porteTag1.action = "1";
    porteTag1.position = { r: "25", theta: "90", phi: "-115" };
    porteTag1.textColor = "#ffffff";
    let textTag1 = room1.addTextTag("Départ");
    textTag1.legend = "Bienvenue dans la simulation !";
    textTag1.position = { r: "15", theta: "90", phi: "0" };
    textTag1.textColor = "#ffffff";

    // Room 2
    let room2 = experience.addRoom("Salle 1 Studio");
    room2.src360 = "GS__3524.JPG";
    room2.camera = { vertical: "0", horizontal: "0" };
    let porteTag2_1 = room2.addPorteTag("Porte Studio (cote interieur)");
    porteTag2_1.action = "0";
    porteTag2_1.position = { r: "30", theta: "90", phi: "135" };
    porteTag2_1.textColor = "#ffffff";
    let porteTag2_2 = room2.addPorteTag("Porte Salle 2 Studio");
    porteTag2_2.action = "2";
    porteTag2_2.position = { r: "30", theta: "90", phi: "-40" };
    porteTag2_2.textColor = "#ffffff";
    let infoTag2 = room2.addInfoTag("Bureau");
    infoTag2.legend = "Un bureau";
    infoTag2.position = { r: "20", theta: "110", phi: "-170" };
    infoTag2.textColor = "#0000ff";

    // Room 3
    let room3 = experience.addRoom("Salle 2 Studio");
    room3.src360 = "GS__3525.JPG";
    room3.camera = { vertical: "0", horizontal: "0" };
    let porteTag3_1 = room3.addPorteTag("Porte Salle 1 Studio");
    porteTag3_1.action = "1";
    porteTag3_1.position = { r: "30", theta: "90", phi: "-40" };
    porteTag3_1.textColor = "#ffffff";
    let porteTag3_2 = room3.addPorteTag("Porte Salle 3 Studio");
    porteTag3_2.action = "3";
    porteTag3_2.position = { r: "40", theta: "90", phi: "-140" };
    porteTag3_2.textColor = "#ffffff";

    // Room 4
    let room4 = experience.addRoom("Salle 3 Studio");
    room4.src360 = "GS__3526.JPG";
    room4.camera = { vertical: "0", horizontal: "0" };
    let porteTag4 = room4.addPorteTag("Porte Salle 2 Studio");
    porteTag4.action = "2";
    porteTag4.position = { r: "40", theta: "90", phi: "-65" };
    porteTag4.textColor = "#ffffff";
    let infoTag4 = room4.addInfoTag("Salle d'enregistrement");
    infoTag4.legend = "C'est ici que l'on s'enregistre";
    infoTag4.position = { r: "25", theta: "95", phi: "40" };
    infoTag4.textColor = "#ffffff";

    return experience;
}

// Fonction permettant de transformer les données du localStorage en un objet Experience
export function transformJSON(data) {
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