import "../js/fromSpherical.js";

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
        tagText.setAttribute('value', tag._name);
        tagText.setAttribute('fromspherical', `fi:${tag._position.fi}; theta:${tag._position.theta - (-4)}; r:${tag._position.r};`);
        tagText.setAttribute('color', 'white');
        tagText.setAttribute('align', 'center');
        tagText.setAttribute('width', '20');
        tagText.setAttribute('look-at', '[camera]');
        canva.appendChild(tagText);
    });
}

let jsonData = loadFromLocalStorage();
console.log(jsonData);
loadScene(jsonData[0]);