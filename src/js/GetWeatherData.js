const fs = require('fs');
const NodeGeocoder = require('node-geocoder'); // Importování knihovny node-geocoder
const { app } = require('electron'); // Pokud používáte Electron
const path = require('path');
const axios = require('axios');

// Nastavení vašeho geokódovacího poskytovatele (v příkladu používáme OpenStreetMap)
const geocoderOptions = {
  provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(geocoderOptions);

// Nastavení vaší lokace (název místa)
const lokace = process.env.LOCATION;
const days = parseInt(process.env.WEATHER_FORECAST_DAYS);

// Funkce pro získání souřadnic z geokódování
async function ziskejSouradnice() {
  try {
    // Použití node-geocoder pro získání souřadnic
    const res = await geocoder.geocode(lokace);
    const latitude = res[0].latitude;
    const longitude = res[0].longitude;

    console.log(latitude, longitude);
    // Předání souřadnic do funkce pro získání počasí
    ziskejPocasi(latitude, longitude);
  } catch (error) {
    console.error('Chyba pri ziskavani souradnic:', error.message);
  }
}

// Funkce pro získání dat o počasí z open-meteo.com API
async function ziskejPocasi(latitude, longitude) {
  try {
    // Získání cesty k %appdata%\folderlock\Data
    const appDataPath = app.getPath('appData'); // Pro Electron
    const folderLockDataPath = path.join(appDataPath, 'folderlock', 'Data');

    // Kontrola za existuje složka 'Data', pokud ne, vytvoří se
    if (!fs.existsSync(folderLockDataPath)) {
      fs.mkdirSync(folderLockDataPath, { recursive: true });
    }

    // Vytvoření cesty k souboru 'pocasi.json' v %appdata%\folderlock\Data
    const filePath = path.join(folderLockDataPath, 'pocasi.json');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=sunrise,sunset&timezone=auto&precipitation&forecast_days=${days}`;

    const response = await axios.get(url);
    const data = response.data;

    // Uložení dat do souboru
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) console.error(err);
      console.log('Data o pocasi byla ulozena do souboru pocasi.json v %appdata%\\folderlock\\Data');
    });
  } catch (error) {
    console.error('Chyba pri ziskavani dat o pocasi:', error.message);
  }
}

// Volání funkce pro získání souřadnic
ziskejSouradnice();
