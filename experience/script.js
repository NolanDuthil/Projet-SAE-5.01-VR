import "../js/fromSpherical.js";

let currentlyVisibleInfoLegend = null;

// Fonction pour charger les données JSON depuis localStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('jsonData');
    if (storedData){
        return JSON.parse(storedData);
    } else {
        initializeDefaultData();
        return null;
    }
}

// Fonction pour charger une scène
function loadScene(scene) {
    let canva = document.getElementById('a-scene');

    // Changer l'image de fond
    document.querySelector('#image-360').setAttribute('src', '../uploaded_images/'+scene._image);

    // Supprimer tous les anciens tags
    let pastTags = document.querySelectorAll('a-sphere, a-text');
    pastTags.forEach((pastTag) => {
        pastTag.remove(); // Supprimer les anciennes sphères et textes
    });

    // Créer de nouveaux tags
    scene._tags.forEach((tag) => {
        let tagSphere = document.createElement('a-sphere');
        tagSphere.setAttribute('color', tag._type === 'porte' ? 'red' : 'blue');
        tagSphere.setAttribute('id', tag._id);
        tagSphere.setAttribute('radius', 1);
        tagSphere.setAttribute('fromspherical', `fi:${tag._position.fi}; theta:${tag._position.theta}; r:${tag._position.r};`);
        canva.appendChild(tagSphere);

        if (tag._type == 'porte') {
            tagSphere.addEventListener('click', () => {
                const nextScene = jsonData[tag._action];
                if (nextScene) {
                    loadScene(nextScene);
                }
            });
        }

        let tagText = document.createElement('a-text');
        tagText.setAttribute('id', tag._id + "-text")
        tagText.setAttribute('value', tag._type === 'porte' ? tag._name : tag._legend);
        tagText.setAttribute('fromspherical', `fi:${tag._position.fi}; theta:${tag._position.theta - (-4)}; r:${tag._position.r};`);
        tagText.setAttribute('color', 'white');
        tagText.setAttribute('align', 'center');
        tagText.setAttribute('width', '20');
        tagText.setAttribute('look-at', '[camera]');
        tagText.setAttribute('opacity', tag._type === 'porte' ? '1' : '0');
        canva.appendChild(tagText);

        // Attendre que la sphère soit positionnée pour calculer la distance
        tagSphere.addEventListener('loaded', function () {
            let distanceToCamera = getDistanceToCamera(tagSphere);
            // Ajustement de l'écart vertical en fonction de la distance à la caméra
            let baseOffset = -7; // Offset de base si proche

            let thetaAdjustment = baseOffset + (distanceToCamera * 0.1); // Écart proportionnel à la distance

            // Utiliser les mêmes coordonnées pour placer le texte
            tagText.setAttribute('fromspherical', `fi:${tag._position.fi}; theta:${tag._position.theta - thetaAdjustment}; r:${tag._position.r};`);

            // Ajouter le texte au canvas
            canva.appendChild(tagText);
        });

        // Ajouter un gestionnaire d'événements pour afficher la légende lorsque l'on clique sur le tag
        if (tag._type === 'info') {
            tagSphere.addEventListener('click', () => {
                // Si une légende est actuellement visible, la masquer
                if (currentlyVisibleInfoLegend) {
                    currentlyVisibleInfoLegend.text.setAttribute('visible', 'false');
                    currentlyVisibleInfoLegend.text.setAttribute('opacity', '0');
                }

                // Vérifiez si le tagText est déjà visible
                if (currentlyVisibleInfoLegend && currentlyVisibleInfoLegend.text === tagText) {
                    tagText.setAttribute('visible', 'false');
                    tagText.setAttribute('opacity', '0'); // Réinitialiser l'opacité
                    currentlyVisibleInfoLegend = null; // Réinitialiser la légende actuellement visible
                } else {
                    tagText.setAttribute('visible', 'true'); // Affichez la légende du tag "info"
                    // Réinitialiser l'opacité pour afficher le texte
                    tagText.setAttribute('opacity', '1'); // Rendre le texte visible

                    currentlyVisibleInfoLegend = { text: tagText }; // Mettre à jour la légende actuellement visible
                }
            });
        };
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

let jsonData = loadFromLocalStorage();
console.log(jsonData);
loadScene(jsonData[0]);