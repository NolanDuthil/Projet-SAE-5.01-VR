import Scene from "./Scene.js";
import TagInfo from "./TagInfo.js";
import TagPorte from "./TagPorte.js";
import TagText from "./TagText.js";

let scenesInstances = [];

// Fonction pour charger les données JSON depuis localStorage
export function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData) {
        let scenesInstances = transformJSON(JSON.parse(storedData));
        return scenesInstances;
    } else {
        initializeDefaultData();
        return scenesInstances;
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
            new TagPorte("1", "Porte Studio (cote exterieur)", "1", { r: "25", theta: "90", fi: "-115" }, "#ffffff"),
            new TagText("2", "Départ", "Bienvenue dans la simulation !", { r: "15", theta: "90", fi: "0" }, "#ffffff")
        ]
    );

    const scene2 = new Scene(
        "Salle 1 Studio",
        "GS__3524.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("3", "Porte Studio (cote interieur)", "0", { r: "30", theta: "90", fi: "135" }, "#ffffff"),
            new TagPorte("4", "Porte Salle 2 Studio", "2", { r: "30", theta: "90", fi: "-40" }, "#ffffff"),
            new TagInfo("5", "Bureau", "Un bureau", { r: "20", theta: "110", fi: "-170" }, "#0000ff")
        ]
    );

    const scene3 = new Scene(
        "Salle 2 Studio",
        "GS__3525.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("6", "Porte Salle 1 Studio", "1", { r: "30", theta: "90", fi: "-40" }, "#ffffff"),
            new TagPorte("7", "Porte Salle 3 Studio", "3", { r: "40", theta: "90", fi: "-140" }, "#ffffff")
        ]
    );

    const scene4 = new Scene(
        "Salle 3 Studio",
        "GS__3526.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("8", "Porte Salle 2 Studio", "2", { r: "40", theta: "90", fi: "-65" }, "#ffffff"),
            new TagInfo("9", "Salle d'enregistrement", "C'est ici que l'on s'enregistre", { r: "25", theta: "95", fi: "40" }, "#ffffff")
        ]
    );

    // Ajouter les scènes au jsonData
    scenesInstances.push(scene1, scene2, scene3, scene4);
}

function transformJSON(data){
    // Créer des instances de la classe Scene à partir des données JSON
    if (data != null) {
        scenesInstances = data.map(sceneData => {
            const tags = sceneData._tags.map(tagData => {
                switch (tagData._type) {
                    case ("porte"):
                        return new TagPorte(tagData._id, tagData._name, tagData._action, tagData._position, tagData._textColor);
                    case ("info"):
                        return new TagInfo(tagData._id, tagData._name, tagData._legend, tagData._position, tagData._textColor);
                    case ("text"):
                        return new TagText(tagData._id, tagData._name, tagData._legend, tagData._position, tagData._textColor);
                }
            });
            return new Scene(sceneData._name, sceneData._image, sceneData._camera, tags);
        });
    }
    return scenesInstances
}