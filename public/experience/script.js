import fromSpherical from "../js/fromSpherical.js";
fromSpherical();

const jsonUrl = 'http://localhost:3000/data'; // URL du fichier JSON
let jsonData = { scenes: [] };
let selectedScene = {};

// Charger les données JSON
async function loadJSON() {
    const response = await fetch(jsonUrl);
    jsonData = await response.json();
    loadScene(jsonData.scenes[0]);
}

// Fonction pour charger une scène
function loadScene(scene) {
    // Changer l'image de fond
    document.querySelector('#image-360').setAttribute('src', '../uploaded_images/'+scene.image);

    // Supprimer tous les anciens tags
    document.querySelectorAll('.tag').forEach(el => el.parentNode.removeChild(el));

    // Créer de nouveaux tags
    scene.tags.forEach(tag => {
        const tagEl = document.createElement('a-sphere');
        tagEl.setAttribute('class', 'tag');
        tagEl.setAttribute('radius', 1);
        tagEl.setAttribute('color', tag.type == 'porte' ? 'red' : 'blue');
        tagEl.setAttribute('fromspherical', 'r: ' + tag.position.r + '; theta: ' + tag.position.theta +'; fi: ' + tag.position.fi);
        
        if (tag.type == 'porte') {
            tagEl.addEventListener('click', () => {
                const nextScene = jsonData.scenes[tag.action];
                if (nextScene) {
                    loadScene(nextScene);
                }
            });
        }

        // Ajouter la sphère dans la scène
        document.querySelector('a-scene').appendChild(tagEl);
    });
}

// Initialiser la scène
loadJSON(); 