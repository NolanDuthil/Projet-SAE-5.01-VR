// Pop-up import de données
const importJsonButton = document.getElementById('import-json');
const importPopup = document.getElementById('import-popup');
const overlay = document.getElementById('overlay');
const closeImportPopupButton = document.getElementById('close-import-popup');

if (importJsonButton && importPopup && overlay) {
  importJsonButton.addEventListener('click', function() {
    importPopup.style.display = 'block';
    overlay.style.display = 'block';
  });
}

if (closeImportPopupButton) {
  closeImportPopupButton.addEventListener('click', function() {
    closeImportPopup();
  });
}

if (overlay) {
  overlay.addEventListener('click', function() {
    closeImportPopup();
  });
}

export function closeImportPopup() {
  if (importPopup && overlay) {
    importPopup.style.display = 'none';
    overlay.style.display = 'none';
  }
}

// Dropdown création de tag
const addTagButton = document.getElementById('add-tag');
const addPopup = document.getElementById('add-popup');
const addPopupButtons = document.querySelectorAll('.main__add_popup__button');

if (addTagButton && addPopup && overlay) {
  addTagButton.addEventListener('click', function() {
    addPopup.style.display = 'block';
    overlay.style.display = 'block';
  });
}

if (addPopupButtons) {
  addPopupButtons.forEach(button => {
    button.addEventListener('click', function() {
      closeAddPopup();
    });
  });
}

if (overlay) {
  overlay.addEventListener('click', function() {
    closeAddPopup();
  });
}

export function closeAddPopup() {
  if (addPopup && overlay) {
    addPopup.style.display = 'none';
    overlay.style.display = 'none';
  }
}
