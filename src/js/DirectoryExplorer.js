const fs = require('fs');
const path = require('path');

const rootDirectoryPath = './Zamcena Slozka';
const directoryStack = [rootDirectoryPath];
let selectedElement = null;
let currentDirectoryIndex = 0;

function formatFileSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " B";
  } else if (sizeInBytes < 1024 * 1024) {
    return (sizeInBytes / 1024).toFixed(2) + " KB";
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

function listFilesAndDirectories(directoryPath) {
  fs.access(directoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Složka nebyla nalezena: ${directoryPath}`);
      return;
    }

    fs.readdir(directoryPath, (err, items) => {
      if (err) {
        console.error(err);
        return;
      }

      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = '';

      const currentDirectoryPathSpan = document.getElementById("currentDirectoryPath");
      currentDirectoryPathSpan.textContent = directoryPath;

      const folders = [];
      const files = [];

      items.forEach((item) => {
        const itemPath = path.join(directoryPath, item);
        const isFolder = fs.statSync(itemPath).isDirectory();

        if (isFolder) {
          folders.push(item);
        } else {
          files.push(item);
        }
      });

      folders.sort(); // Seřadit složky abecedně
      files.sort(); // Seřadit soubory abecedně

      const sortedItems = folders.concat(files);

      sortedItems.forEach((item) => {
        const itemPath = path.join(directoryPath, item);
        const isFolder = fs.statSync(itemPath).isDirectory();
        const itemElement = createItemElement(item, isFolder, directoryPath);

        itemElement.addEventListener('dblclick', () => {
          if (isFolder) {
            const folderPath = path.join(directoryPath, item);
            directoryStack.splice(currentDirectoryIndex + 1);
            directoryStack.push(folderPath);
            currentDirectoryIndex = directoryStack.length - 1;
            listFilesAndDirectories(folderPath);
          } else {
            const filePath = path.join(directoryPath, item);
            openFile(filePath);
          }
        });

        outputDiv.appendChild(itemElement);
      });
    });
  });
}

function createItemElement(item, isFolder, currentDirectoryPath) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("item");

  const itemIcon = document.createElement("img");
  itemIcon.classList.add("itemIcon");

  const itemName = document.createElement("span");
  itemName.classList.add("itemName");

  const itemSize = document.createElement("span");
  itemSize.classList.add("itemSize");

  if (isFolder) {
    itemIcon.src = "./icons/folder/folder-icon.png";
    itemIcon.alt = "Složka";
  } else {
    const itemPath = path.join(currentDirectoryPath, item);
    const fileExtension = item.split('.').pop();

    if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
      itemIcon.src = "./icons/folder/image-icon.png";
      itemIcon.alt = "Obrázek";
      itemSize.textContent = formatFileSize(fs.statSync(itemPath).size);
    } else {
      itemIcon.src = "./icons/folder/file-icon.png";
      itemIcon.alt = "Soubor";
      itemSize.textContent = formatFileSize(fs.statSync(itemPath).size);
    }
  }

  itemName.textContent = item;
  itemElement.appendChild(itemIcon);
  itemElement.appendChild(itemName);
  itemElement.appendChild(itemSize);

  itemElement.addEventListener('click', () => {
    if (selectedElement) {
      selectedElement.style.backgroundColor = '';
    }
    itemElement.style.backgroundColor = '#292636';
    selectedElement = itemElement;
  });

  return itemElement;
}

function openFile(filePath) {
  const { exec } = require('child_process');
  if (process.platform === 'win32') {
    exec(`start "" "${filePath}"`);
  } else {
    exec(`xdg-open "${filePath}"`, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }
}

function navigateBack() {
  if (currentDirectoryIndex > 0) {
    currentDirectoryIndex--;
    const parentDirectory = directoryStack[currentDirectoryIndex];
    listFilesAndDirectories(parentDirectory);
  }
}

function navigateForward() {
  if (currentDirectoryIndex < directoryStack.length - 1) {
    currentDirectoryIndex++;
    const forwardDirectory = directoryStack[currentDirectoryIndex];
    listFilesAndDirectories(forwardDirectory);
  }
}

document.getElementById("backButton").addEventListener('click', navigateBack);
document.getElementById("forwardButton").addEventListener('click', navigateForward);

// Funkce pro vyhledávání položek v aktuálním adresáři
function searchFilesInCurrentDirectory(currentDirectoryIndex, searchTerm) {
  const currentDirectoryPath = directoryStack[currentDirectoryIndex];
  fs.access(currentDirectoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Složka nebyla nalezena: ${currentDirectoryPath}`);
      return;
    }

    fs.readdir(currentDirectoryPath, (err, items) => {
      if (err) {
        console.error(err);
        return;
      }

      const outputDiv = document.getElementById("output");
      outputDiv.innerHTML = '';

      const currentDirectoryPathSpan = document.getElementById("currentDirectoryPath");
      currentDirectoryPathSpan.textContent = currentDirectoryPath;

      items.forEach((item) => {
        const itemPath = path.join(currentDirectoryPath, item);
        fs.stat(itemPath, (err, stats) => {
          if (err) {
            console.error(err);
            return;
          }

          const isFolder = stats.isDirectory();
          const itemElement = createItemElement(item, isFolder, currentDirectoryPath);

          if (item.toLowerCase().includes(searchTerm.toLowerCase())) {
            itemElement.addEventListener('dblclick', () => {
              if (isFolder) {
                const folderPath = path.join(currentDirectoryPath, item);
                directoryStack.splice(currentDirectoryIndex + 1);
                directoryStack.push(folderPath);
                currentDirectoryIndex = directoryStack.length - 1;
                listFilesAndDirectories(folderPath);
              } else {
                const filePath = path.join(currentDirectoryPath, item);
                openFile(filePath);
              }
            });
            outputDiv.appendChild(itemElement);
          }
        });
      });
    });
  });
}

// Přidání posluchače na událost změny v textovém poli
document.getElementById("hledat").addEventListener('input', function(event) {
  const searchTerm = event.target.value.trim(); // Získání hodnoty z textového pole a odstranění přebytečných mezer

  // Ignorovat výrazy začínající '#', '&', nebo '@'
  if (searchTerm.startsWith('#') || searchTerm.startsWith('&') || searchTerm.startsWith('@')) {
    // Výrazy začínající '#', '&', nebo '@' jsou ignorovány
    return;
  }

  searchFilesInCurrentDirectory(currentDirectoryIndex, searchTerm); // Spuštění vyhledávání v aktuálním adresáři s novým hledaným termínem
});

listFilesAndDirectories(rootDirectoryPath);



// Open složky v exploreru
function openCurrentDirectory() {
  const { exec } = require('child_process');
  let currentDirectoryPath = directoryStack[currentDirectoryIndex];

  if (process.platform === 'win32') {
    currentDirectoryPath = currentDirectoryPath.replace(/\//g, '\\');
    currentDirectoryPath = `"${currentDirectoryPath}"`;

    exec(`explorer ${currentDirectoryPath}`);
  } else {
    console.error("Tato funkce je k dispozici pouze na platformě Windows.");
  }
}




// Funkce pro aktualizaci seznamu složky
function updateDirectoryListing() {
  const currentDirectoryPath = directoryStack[currentDirectoryIndex];

  // Kontrola existence složky
  fs.access(currentDirectoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`Složka neexistuje: ${currentDirectoryPath}`);
        clearDirectoryListing();
      } else {
        console.error(`Chyba při přístupu k složce: ${err.message}`);
      }
      return;
    }

    listFilesAndDirectories(currentDirectoryPath);
  });
  console.log("folder update");
}

// Aktualizace seznamu složky každých 5 sekund
/*
const updateInterval = 5000; // 5000 ms (5 sekund)
setInterval(updateDirectoryListing, updateInterval);
*/

// Zavolejte `updateDirectoryListing` také při načtení stránky
window.addEventListener('load', updateDirectoryListing);

function clearDirectoryListing() {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = '';
  // Neprovádějte čistění pole directoryStack a nepřenastavujte currentDirectoryIndex
}


// Aktualizace složek po zmáčkutí Enter
hledat.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    // Zavoláme funkci updateDirectoryListing po 2000 milisekundách (2 sekundy)
    setTimeout(() => {
      updateDirectoryListing();
    }, 5000);
  }
});