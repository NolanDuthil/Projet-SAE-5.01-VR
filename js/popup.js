// Gérer l'affichage de la popup et de l'overlay
document.getElementById('import-json').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });

  // Gérer la fermeture de la popup et de l'overlay
  document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });

// Option : Fermer la popup en cliquant sur l'overlay
document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });