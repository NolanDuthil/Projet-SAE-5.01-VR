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

// Overlay click to close all modals
document.getElementById('overlay').addEventListener('click', function () {
  closePopup('import-popup');
  closePopup('add-popup');
  closePopup('delete-room-confirmation-modal');
  closePopup('delete-tag-confirmation-modal');
});

export function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

export function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
