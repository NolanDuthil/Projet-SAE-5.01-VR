// Pop-up import de données
document.getElementById('import-json').addEventListener('click', function () {
  showPopup('import-popup');
});
document.getElementById('close-import-popup').addEventListener('click', function () {
  closePopup('import-popup');
});

// Dropdown création de tag
document.getElementById('add-tag').addEventListener('click', function () {
  showPopup('add-popup');
});
document.getElementById('close-add-popup').addEventListener('click', function () {
  closePopup('add-popup');
});

// Delete confirmation modal for room
document.getElementById('delete-room').addEventListener('click', function () {
  showPopup('delete-room-confirmation-modal');
});
document.getElementById('confirm-delete-room-button').addEventListener('click', function () {
  // Add your delete room logic here
  closePopup('delete-room-confirmation-modal');
});
document.getElementById('cancel-delete-room-button').addEventListener('click', function () {
  closePopup('delete-room-confirmation-modal');
});

// Delete confirmation modal for tag
document.getElementById('delete-tag').addEventListener('click', function () {
  showPopup('delete-tag-confirmation-modal');
});
document.getElementById('confirm-delete-tag-button').addEventListener('click', function () {
  // Add your delete tag logic here
  closePopup('delete-tag-confirmation-modal');
});
document.getElementById('cancel-delete-tag-button').addEventListener('click', function () {
  closePopup('delete-tag-confirmation-modal');
});

// Export popup
document.getElementById('export-json').addEventListener('click', function () {
  showPopup('export-popup');
});
document.getElementById('close-checkbox-popup').addEventListener('click', function () {
  closePopup('export-popup');
});

document.getElementById('confirm-checkbox-popup').addEventListener('click', function () {
  closePopup('export-popup');
});

const cards = document.querySelectorAll('.export_popup__content__card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Désélectionne toutes les cases et retire la classe de sélection
    cards.forEach(cbCard => {
      cbCard.classList.remove('export_popup__content__card--selected');
      document.getElementById(cbCard.getAttribute('data-option-id')).checked = false;
    });

    // Sélectionne la case associée et ajoute la classe de sélection
    const checkbox = document.getElementById(card.getAttribute('data-option-id'));
    checkbox.checked = true;
    card.classList.add('export_popup__content__card--selected');
  });
});

// Pop-up pour afficher une image
document.getElementById('image-change').addEventListener('click', function () {
  // Tableau des images disponibles dans le dossier 'images'
  const imageSources = [
    'uploaded_images/default.avif',
    'uploaded_images/GS__3523.JPG',
    'uploaded_images/GS__3524.JPG',
    'uploaded_images/GS__3525.JPG',
    'uploaded_images/GS__3526.JPG'
  ];
  openImageGalleryPopup(imageSources);
});

// Fonction pour afficher la popup avec la galerie d'images
function openImageGalleryPopup(imageSources) {
  const imageGallery = document.getElementById('image-gallery');
  imageGallery.innerHTML = ''; // Réinitialiser la galerie

  // Ajouter chaque image dans la galerie
  imageSources.forEach(src => {
      const imgElement = document.createElement('img');
      imgElement.src = src;
      imgElement.alt = 'Aperçu de l\'image';
      imgElement.classList.add('image_popup__content__image');
      imageGallery.appendChild(imgElement);
  });

  // Afficher la popup
  showPopup('image-popup');
}

// Bouton de fermeture de la modale d'image
document.getElementById('close-image-popup').addEventListener('click', function () {
  closePopup('image-popup');
});

// Overlay click to close all modals
document.getElementById('overlay').addEventListener('click', function () {
  closePopup('import-popup');
  closePopup('add-popup');
  closePopup('delete-room-confirmation-modal');
  closePopup('delete-tag-confirmation-modal');
  closePopup('export-popup');
  closePopup('image-popup');
});

export function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

export function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
