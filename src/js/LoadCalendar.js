const paths = require('path');
const jsonFileName = 'pocasi.json';
const appDataPath = process.env.APPDATA; // Získáme cestu k adresáři %appdata%
const folderName = 'folderlock'; // Název složky
const subfolderName = 'Data'; // Název složky "Data"



// Globální proměnná pro uchování označených dat
let selectedDates = new Set();

// Získání aktuálního dne, měsíce a roku
let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Funkce pro zjištění počtu dnů v měsíci
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Funkce pro zjištění počtu dnů v předchozím měsíci
function getDaysInPreviousMonth(month, year) {
    if (month === 0) {
        month = 11;
        year--;
    } else {
        month--;
    }
    return getDaysInMonth(month, year);
}

// Funkce pro zjištění prvního dne v měsíci (0 = Neděle, 1 = Pondělí, ...)
function getFirstDayOfMonth(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Převod na indexy pondělí (0) až neděle (6)
}

// Funkce pro zobrazení aktuálního dne (přiá class "current-day" pro aktuální den)
function displayCurrentDay(cell, day) {
    if (day === currentDay && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        cell.classList.add('current-day');
    }
}

// Generování kalendáře
function generateCalendar() {
    const table = document.querySelector('table');
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    let dayCounter = 1;

    // Nastavení názvu aktuálního měsíce a roku
    const currentMonthYear = document.getElementById('currentMonthYear');
    currentMonthYear.textContent = `${currentMonth + 1}. ${currentYear}`;

    for (let i = 0; i < 6; i++) {
        const newRow = table.insertRow();
        newRow.id = `week-${i + 1}`;

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                // Dny z předchozího měsíce
                const daysInPreviousMonth = getDaysInPreviousMonth(currentMonth, currentYear);
                const dayFromPreviousMonth = daysInPreviousMonth - firstDay + j + 1;
                const cell = newRow.insertCell();
                cell.textContent = dayFromPreviousMonth;
                cell.classList.add('previous-month-day');
                displayCurrentDay(cell, dayFromPreviousMonth);
            } else if (dayCounter <= daysInMonth) {
                // Dny aktuálního měsíce
                const cell = newRow.insertCell();
                cell.dataset.date = `${currentYear}-${currentMonth + 1}-${dayCounter}`; // Přidání atributu 'data-date'
                dayCounter++;

                // Přidání posluchače události na kliknutí na datum
                cell.addEventListener('click', toggleDateSelection);

                // Vytvoření vnořeného prvku <span> pro číslo
                const span = document.createElement('span');
                span.textContent = dayCounter - 1;
                cell.appendChild(span);

                if (selectedDates.has(`${currentYear}-${currentMonth + 1}-${dayCounter - 1}`)) {
                    // Pokud je datum v seznamu označených dat, přidat třídu pro zvýraznění
                    span.classList.add('selected-date');
                }

                displayCurrentDay(cell, dayCounter - 1);
            } else {
                // Dny z nadcházejícího měsíce
                const cell = newRow.insertCell();
                cell.textContent = dayCounter - daysInMonth;
                cell.classList.add('next-month-day');
                dayCounter++;
            }
        }
    }
}


// Tlačítek pro přechod mezi měsíci (Detekce kliknutí na tlačítko "prevMonth" a "nextMonth" v html)
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    clearCalendar();
    generateCalendar();
    LoadRaindays();
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    clearCalendar();
    generateCalendar();
    LoadRaindays();
});

// Vymazání stávajícího kalendáře
function clearCalendar() {
    const table = document.querySelector('table');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

// Funkce pro označení a změnu barvy vybraného data
function toggleDateSelection(event) {
    const span = event.target;
    if (span.tagName === 'SPAN') { // Kontrola, zda bylo kliknuto přímo na <span>
        const cell = span.parentElement;
        const date = cell.dataset.date;

        if (span.classList.contains('selected-date')) {
            // Pokud buňka již byla označena
            selectedDates.delete(date); // Odebrat datum z označených dat
            span.classList.remove('selected-date'); // Odebrat třídu pro zvýraznění
            saveSelectedDates(); // Uložit změny
        } else {
            // Pokud buňka nebyla označena, přidáme ji
            selectedDates.add(date); // Přidat datum do označených dat
            span.classList.add('selected-date'); // Přidat třídu pro zvýraznění
            saveSelectedDates(); // Uložit změny
        }
    }
}

// Funkce pro uložení vybraných dat do localStorage
function saveSelectedDates() {
    const selectedDatesArray = Array.from(selectedDates); // Převedení Set na pole
    const selectedDatesJSON = JSON.stringify(selectedDatesArray);
    localStorage.setItem('selectedDates', selectedDatesJSON);
}

// Funkce pro načtení uložených dat z localStorage
function loadSelectedDates() {
    const selectedDatesJSON = localStorage.getItem('selectedDates');
    if (selectedDatesJSON) {
        const selectedDatesArray = JSON.parse(selectedDatesJSON);
        selectedDates = new Set(selectedDatesArray);
    }
}

// Načtení uložených dat při načtení stránky
loadSelectedDates();

// Generování kalendáře při prvním načtení stránky
generateCalendar();






// Funkce pro pravé tlačítko (přidání class "selected-date-right" pro určené datum)

const calendarTable = document.querySelector('table');

// Funkce pro označení a změnu barvy vybraného data (pravým tlačítkem)
function toggleDateSelectionRight(event) {
    if (event.button === 2) { // Pouze pravé tlačítko
        event.preventDefault(); // Zabrání výchozímu chování kontextového menu (pravého kliknutí)

        const span = event.target;
        if (span.tagName === 'SPAN') { // Kontrola, zda bylo kliknuto přímo na <span>
            // Odstranit všechny červeně označené prvky
            const selectedSpans = document.querySelectorAll('.selected-date-right');
            for (const selectedSpan of selectedSpans) {
                selectedSpan.classList.remove('selected-date-right');
            }
            // Přidat class "selected-date-right" označení k aktuálnímu datu
            span.classList.add('selected-date-right');
        }
    }
}

// Přidání posluchače události pro pravé tlačítko myši (kontextové menu)
calendarTable.addEventListener('contextmenu', toggleDateSelectionRight);



// Nastavte cestu k JSON souboru se seznamem počasí
const jsonFilePath = paths.join(appDataPath, folderName, subfolderName, jsonFileName);
 // Změňte název souboru na váš JSON soubor

// Seznam kódů počasí, které značí déšť
const rainyWeatherCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];

// Asynchronní funkce pro hledání deštivých dnů
async function findRainyDays(jsonFilePath) {
    try {
        // Načíst JSON data z externího souboru
        const response = await fetch(jsonFilePath);
        const data = await response.json();

        // Inicializovat prázdný Set pro ukládání deštivých dnů
        const rainyDays = new Set();

        // Zpracování dat z JSON souboru
        for (let i = 0; i < data.hourly.time.length; i++) {
            const dateTime = data.hourly.time[i];
            const code = data.hourly.weathercode[i];

            // Převést datum a čas na pouze datum
            const day = new Date(dateTime).toISOString().split('T')[0];

            // Získat hodinu z času
            const hour = new Date(dateTime).getHours();

            // Pokud kód značí déšť a čas odpovídá rozmezí 0:00 až 23:00, přidejte tento den do seznamu deštivých dnů
            if (rainyWeatherCodes.includes(code) && hour >= 0 && hour <= 23) {
                rainyDays.add(day);
            }
        }

        // Přidat třídu "rain-day" ke všem buňkám kalendáře, pokud je den deštivý a není "current-day"
        const calendarCells = document.querySelectorAll('td[data-date]');
        calendarCells.forEach(cell => {
            const day = cell.dataset.date;

            // Přidat třídu "rain-day" k buňce, pokud je den deštivý a není "current-day"
            if (
                (rainyDays.has(day)) || cell.classList.contains('current-month-day')
            ) {
                cell.classList.add('rain-day');

                // Vytvořit obrázek s ikonou deště
                const icon = document.createElement('img');
                icon.src = './icons/drop.png';

                // Přidejte třídu nebo ID k ikoně pro snadnější cílení pomocí CSS
                icon.classList.add('rain-icon'); // Přidejte třídu "rain-icon"

                // Přidejte ikonu do buňky
                cell.appendChild(icon);
            }
        });
    } catch (error) {
        // Zpracování chyby při načítání JSON dat
        console.error(`Chyba při načítání JSON dat: ${error}`);
    }
}

// Funkce pro spuštění kódu
function LoadRaindays() {
    findRainyDays(jsonFilePath);
}

LoadRaindays();