import "../js/fromSpherical.js";

import Scene from "../js/Scene.js";
import TagInfo from "../js/TagInfo.js";
import TagPorte from "../js/TagPorte.js";
import TagText from "../js/TagText.js";

let currentlyVisibleInfoLegend = null;
let scenesInstances = [];

// Fonction pour charger les données JSON depuis localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData){
        let jsonData = JSON.parse(storedData)
        // Créer des instances de la classe Scene à partir des données JSON
        if (jsonData != null) {
            scenesInstances = jsonData.map(sceneData => {
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
    } else {
        initializeDefaultData();
        localStorage.setItem('jsonData', JSON.stringify(scenesInstances));
        return null;
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
            new TagPorte("1", "Porte Studio (côté extérieur)", "1", { r: "25", theta: "90", fi: "-115" }, "#ffffff"),
            new TagText("2", "Départ", "Bienvenue dans la simulation !", { r: "15", theta: "90", fi: "0" }, "#ffffff")
        ]
    );

    const scene2 = new Scene(
        "Salle 1 Studio",
        "GS__3524.JPG",
        { vertical: "0", horizontal: "0" },
        [
            new TagPorte("3", "Porte Studio (côté intérieur)", "0", { r: "30", theta: "90", fi: "135" }, "#ffffff"),
            new TagPorte("4", "Porte Salle 2 Studio", "2", { r: "30", theta: "90", fi: "-40" }, "#ffffff"),
            new TagInfo("5", "Bureau", "Un bureau", { r: "35", theta: "100", fi: "-170" }, "#ffffff")
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

    // Enregistrer les données dans le stockage local
    saveToLocalStorage();
}

// Fonction pour charger une scène
function loadScene(scene) {
    let canva = document.getElementById('a-scene');

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

loadFromLocalStorage();
loadScene(scenesInstances[0]);