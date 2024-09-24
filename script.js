AFRAME.registerComponent('fromspherical', {
  // we will use two angles and a radius provided by the user 
  schema: {
    fi: {},
    theta: {},
    r: {},
  },
  init: function () {
    // lets change it to radians
    let fi = this.data.fi * Math.PI / 180
    let theta = this.data.theta * Math.PI / 180

    // The 'horizontal axis is x. The 'vertical' is y. 
    // The calculations below are straight from the wiki site.
    let z = (-1) * Math.sin(theta) * Math.cos(fi) * this.data.r
    let x = Math.sin(theta) * Math.sin(fi) * this.data.r
    let y = Math.cos(theta) * this.data.r
    // position the element using the provided data
    this.el.setAttribute('position', {
      x: x,
      y: y,
      z: z
    })
    // rotate the element towards the camera
    this.el.setAttribute('look-at', '[camera]')
  }
})


let uploadedFiles = [];

// Fonction pour simuler l'upload de fichier et l'ajouter à la liste
function uploadFile() {
  const fileInput = document.getElementById('file-upload');
  const file = fileInput.files[0];

  if (file) {
    // Ajouter le fichier à la liste
    uploadedFiles.push(file.name);
    alert('Fichier "' + file.name + '" téléchargé avec succès !');
    fileInput.value = ''; // Réinitialiser l'input file
  } else {
    alert('Veuillez sélectionner un fichier.');
  }
}

// Fonction pour afficher la popup des fichiers uploadés
function showFilePopup() {
  // Mettre à jour la liste des fichiers dans la popup
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Effacer la liste existante
  uploadedFiles.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    fileList.appendChild(li);
  });

  // Afficher la popup et l'overlay
  document.getElementById('file-popup').style.display = 'block';
  document.getElementById('popup-overlay').style.display = 'block';
}

// Fonction pour fermer la popup
function closeFilePopup() {
  document.getElementById('file-popup').style.display = 'none';
  document.getElementById('popup-overlay').style.display = 'none';
}