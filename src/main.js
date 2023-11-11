const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const { RenameFolder, UnlockFolder } = require('./js/FolderOperations.js');
const path = require('path');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');
require('dotenv').config()

//? Načtení ostatních souborů
require(path.join(__dirname, './js/GetWeatherData.js'));

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 700,
        minWidth: 1490,
        minHeight: 700,
        frame: false,
        icon: path.join(__dirname, './icons/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadFile('./src/index.html');

    // Funkce pro načtení klávesových zkratek
    KeyCommand();

    // Detekce uzavření okna
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // Aplikace již běží, posíláme zprávu do existující instance
    app.quit();
} else {
    // Vytvoření hlavního okna
    app.whenReady().then(() => {
        createWindow();
    });

    app.on('second-instance', () => {
        // Při pokusu o spuštění druhé instance aplikace, otevřít již existující okno nebo provést jinou akci
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}
//! Funkce pro otevření webview

// Generická funkce pro otevření okna s danou URL adresou
function openWindow(url) {
    let newWindow = new BrowserWindow({
        width: 1400,
        height: 700,
    });

    // Načtěte obsah do nového okna
    newWindow.loadURL(url);

    // Zavření nového okna
    newWindow.on('closed', () => {
        newWindow = null;
    });
}

// Funkce pro otevření gmail.com v soukromém okně
function opengmaildWindow() {
    openWindow('https://gmail.com');
}

//! Funkce pro skrytí složky po neaktivitě uživatele
ipcMain.on('user-inactive', () => {
    RenameFolder();
});

//! Control buttons
ipcMain.on('control-window', (event, action) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    switch (action) {
        case 'close':
            RenameFolder();
            app.quit();
            break;
        case 'maximize':
            if (window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
            break;
        case 'minimize':
            window.minimize();
            break;
    }
});

//! Spuštení funkce po zadání do vyhledávaní
let PassCounter = 0;

ipcMain.on('input-text', (event, text) => {
    if (text === '#google') {
        exec('explorer "https://google.com');
    }
    if (text === '#mail' || text === '#gmail') {
        if (PassCounter === 1) {
            opengmaildWindow();
        }
    }
    if (text === '#ai') {
        exec('explorer "https://chat.openai.com"');
    }
    if (text.startsWith('&')) {
        const searchText = encodeURIComponent(text.substring(1));
        const url = 'https://www.google.com/search?q=' + searchText;
        exec('explorer "' + url + '"');
    }
    if (text === '@' + process.env.PASSWORD) {
        if (PassCounter === 0) {
            UnlockFolder();
            PassCounter = 1;
        } else {
            RenameFolder();
            PassCounter = 0;
        }
    }
});

//! Proměná pro spuštění klávesových zkratek
function KeyCommand() {
    const ToolTip = globalShortcut.register('Ctrl+Alt+H', () => {
        const message = `
        "&+text" - Otevře prohlížeč s google vyhledáváním a zadaným textem.

        "#gmail" - Otevře gmail v soukromém okně (heslo musí být zadáno)

        "#mail" - Otevře gmail v soukromém okně (heslo musí být zadáno)

        "#google" - Otevře prohlížeč s google vyhledáváním

        "#ai" - Otevře prohlížeč s openai

        "@Heslo - Otevře skrytou složku a povolí funkce jako #mail"
        `;

        dialog.showMessageBox({
            type: 'info',
            title: 'Nápověda',
            message: message,
            buttons: ['OK'],
        });
    });
}

// Detekce zda bylo okno zavřeno jiným způsobem než přes křížek
let isRenameFolderExecuted = false;

// Zachytí událost ukončení aplikace
app.on('before-quit', () => {
    if (!isRenameFolderExecuted) {
        RenameFolder();
        isRenameFolderExecuted = true;
    }
});

// Zachytí událost vypnutí počítače
app.on('will-quit', () => {
    if (!isRenameFolderExecuted) {
        RenameFolder();
        isRenameFolderExecuted = true;
    }
});

