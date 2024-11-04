import Experience from "./Experience.js";

// Fonction pour charger les données JSON depuis localStorage
function loadFromLocalStorage() {
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
    experience.addRoom("Entrée Studio", "GS__3523.JPG", { vertical: "0", horizontal: "0" });
    let room1 = experience.getRoom("Entrée Studio");
    room1.addPorteTag("Porte Studio (cote exterieur)", "1", { r: "25", theta: "90", fi: "-115" }, "#ffffff");
    room1.addTextTag("Départ", "Bienvenue dans la simulation !", { r: "15", theta: "90", fi: "0" }, "#ffffff");

    // Room 2
    experience.addRoom("Salle 1 Studio", "GS__3524.JPG", { vertical: "0", horizontal: "0" });
    let room2 = experience.getRoom("Salle 1 Studio");
    room2.addPorteTag("Porte Studio (cote interieur)", "0", { r: "30", theta: "90", fi: "135" }, "#ffffff");
    room2.addPorteTag("Porte Salle 2 Studio", "2", { r: "30", theta: "90", fi: "-40" }, "#ffffff");
    room2.addInfoTag("Bureau", "Un bureau", { r: "20", theta: "110", fi: "-170" }, "#0000ff");

    // Room 3
    experience.addRoom("Salle 2 Studio", "GS__3525.JPG", { vertical: "0", horizontal: "0" });
    let room3 = experience.getRoom("Salle 2 Studio");
    room3.addPorteTag("Porte Salle 1 Studio", "1", { r: "30", theta: "90", fi: "-40" }, "#ffffff");
    room3.addPorteTag("Porte Salle 3 Studio", "3", { r: "40", theta: "90", fi: "-140" }, "#ffffff");

    // Room 4
    experience.addRoom("Salle 3 Studio", "GS__3526.JPG", { vertical: "0", horizontal: "0" });
    let room4 = experience.getRoom("Salle 3 Studio");
    room4.addPorteTag("Porte Salle 2 Studio", "2", { r: "40", theta: "90", fi: "-65" }, "#ffffff");
    room4.addInfoTag("Salle d'enregistrement", "C'est ici que l'on s'enregistre", { r: "25", theta: "95", fi: "40" }, "#ffffff");

    return experience;
}

// Fonction permettant de transformer les données du localStorage en un objet Experience
function transformJSON(data) {
    return Object.assign(new Experience(), data);
}

export { loadFromLocalStorage };