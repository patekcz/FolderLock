let inactivityTimer;
const inactivityTime = 30 * 60000;

function startInactivityTimer() {
  inactivityTimer = setTimeout(() => {
    // Poslat zprávu do hlavního procesu
    ipcRenderer.send('user-inactive');
  }, inactivityTime);
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  startInactivityTimer();
}

startInactivityTimer();

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);