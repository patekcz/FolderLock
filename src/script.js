const { ipcRenderer } = require('electron');

// Control buttons
function handleButtonClick(action) {
    ipcRenderer.send('control-window', action);
}


// Input-text
const hledat = document.getElementById('hledat');

hledat.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = e.target.value;
    ipcRenderer.send('input-text', text);
    e.target.value = ''; // Vyčištění textového pole po stisku Enter.
  }
});