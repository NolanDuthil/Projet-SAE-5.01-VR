// Pop-up import de données
document.getElementById('import-json').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
  });
  document.getElementById('close-import-popup').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });
document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('import-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  });


// Dropdown création de tag
document.getElementById('add-tag').addEventListener('click', function() {
  document.getElementById('add-popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
});
document.getElementById('close-add-popup').addEventListener('click', function() {
  document.getElementById('add-popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
});
document.getElementById('overlay').addEventListener('click', function() {
  document.getElementById('add-popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
});
