document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Načtení dat z pocasi.json (obsahuje data o teplotě datum a weathercode) //cesta k souboru z proměnné v LoadCalendar.js
        const response = await fetch(jsonFilePath);
        const data = await response.json();

        // Globální proměnná pro uložení formátovaného data
        let formattedDate = getCurrentDate(); // Použití aktuálního datum jako výchozí hodnota

        // Funkce pro získání aktuálního data ve formátu YYYY-MM-DD (2023-09-23)
        function getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        document.addEventListener("DOMContentLoaded", async () => {
            try {
                // ... (zbytek vašeho kódu)
            } catch (error) {
                console.error('Chyba při načítání dat o počasí:', error.message);
            }
        });

        // Funkce pro odebrání třídy "selected-date-right" ze všech <span> elementů uvnitř buňek kalendáře
        function clearSelectedDate() {
            const calendarSpans = document.querySelectorAll('td[data-date] span');
            calendarSpans.forEach(span => {
                span.classList.remove('selected-date-right');
            });
        }

        // Připojení události pro pravé tlačítko myši na celý dokument
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Zabrání výchozímu chování kontextového menu (pravého kliknutí)

            // Zkontrolujte, zda bylo kliknuto mimo kalendář (ne na buňky kalendáře)
            const isOutsideCalendar = !event.target.closest('table');

            if (isOutsideCalendar) {
                // Nastavte počasí zpět na aktuální den
                formattedDate = getCurrentDate();

                // Vypsání do konzole, že bylo nastaveno zpět na aktuální den
                console.log('Počasí bylo nastaveno zpět na aktuální den');
                clearSelectedDate();

                // Aktualizace zobrazených dat pro nové datum
                changeFormattedDate(formattedDate);
            }
        });

        // Funkce pro aktualizaci zobrazení dat pro zadané datum
        function updateWeatherData() {
            const teplotyProDatum = data.hourly.temperature_2m.filter((temp, index) => {
                const datum = data.hourly.time[index].split("T")[0];
                return datum === formattedDate;
            });

            const weathercodeProDatum = data.hourly.weathercode.filter((code, index) => {
                const datum = data.hourly.time[index].split("T")[0];
                return datum === formattedDate;
            });

            if (teplotyProDatum.length === 0) {
                //alert("Pro zadané datum nebyla nalezena data o počasí."); // Alert pokud se klikne na datum pro které nejsou data načtena

                // Funkce pro smazání class "selected-date-right" u vybraného data, pokud pro datum nejsou žadá data načtena
                const selectedSpans = document.querySelectorAll('.selected-date-right');
                for (const selectedSpan of selectedSpans) {
                    selectedSpan.classList.remove('selected-date-right');
                }
                return;
            }

            // Výpočet mediánu teploty během dne
            const medianTemperature = calculateMedian(teplotyProDatum);

            // Výpis mediánu do konzole
            // console.log(`Medián teploty během dne: ${medianTemperature.toFixed(2)} °C`);

            // Aktualizace zobrazených dat
            const pocasiElement = document.getElementById("teploty");
            pocasiElement.innerHTML = "";

            // Přidání zobrazení mediánu nad seznamem teplot
            const medianElement = document.getElementById("medianTemperature");
            medianElement.textContent = `${medianTemperature.toFixed(2)}°C`;

            // Seznam pro přiřazení ikon kódům počasí
            const weatherIcons = {
                // Jasno
                0: './icons/Jasno/Jasná-obloha.png',
                // Zataženo
                1: './icons/Zatazeno/Hlavne-jasno.png',
                2: './icons/Zatazeno/Castecne-zatazeno.png',
                3: './icons/Zatazeno/Zatazeno.png',
                // Mlha
                45: './icons/Mlha/Mlha-slabá-intenzita.png',
                48: './icons/Mlha/Mlha-silná-intenzita.png',
                // Mrholení
                51: './icons/Mrholení/Mrholení-slabá-intenzita.png',
                53: './icons/Mrholení/Mrholení-strední-intenzita.png',
                55: './icons/Mrholení/Mrholení-silná-intenzita.png',
                // Mrazivé Mrholení
                56: './icons/Mrazivé-mrholení/Mrazivé-mrholení-slabé.png',
                57: './icons/Mrazivé-mrholení/Mrazivé-mrholení-silné.png',
                // Déšť
                61: './icons/Dést/Dést-slabá-intenzita.png',
                63: './icons/Dést/Dést-strední-intenzita.png',
                65: './icons/Dést/Dést-silná-intenzita.png',
                // Mrazivý děšť
                66: './icons/Mrazivý-dést/Mrazivý-dést-slabá-intenzita.png',
                67: './icons/Mrazivý-dést/Mrazivý-dést-silná-intenzita.png',
                // Sníh
                71: './icons/Snezení/Snezení-slabá-intenzita.png',
                73: './icons/Snezení/Snezení-strední-intenzita.png',
                75: './icons/Snezení/Snezení-silná-intenzita.png',
                // Kroupy
                77: './icons/Kroupy/Kroupy.png',
                //  Dešťové sprchy
                80: './icons/Dést/Dést-slabá-intenzita.png',
                81: './icons/Dést/Dést-strední-intenzita.png',
                82: './icons/Dést/Dést-silná-intenzita.png',
                // Sehové přeháňky
                85: './icons/Snezení/Snezení-slabá-intenzita.png',
                86: './icons/Snezení/Snezení-strední-intenzita.png',
                // Bouřka
                95: './icons/Bourka/Bourka.png',
                // Bouřka s krupobitím
                96: './icons/Bourka-s-krupobitím/Bourka-s-krupobitím-slabé.png',
                99: './icons/Bourka-s-krupobitím/Bourka-s-krupobitím-silné.png',

            };

            // Funkce pro získání ikony na základě weathercode (WMO)
            function getWeatherIcon(code) {
                const iconPath = weatherIcons[code];
                if (iconPath) {
                    return `<img src="${iconPath}" alt="Weather Icon" />`;
                } else {
                    return `Unknown Weather (${code})`;
                }
            }

            // Vytvoření sloupce pro teploty a weathercode
            const sloupec = document.createElement("div");
            sloupec.classList.add("cas");

            // Přidání teplot a weathercode do sloupce
            for (let i = 0; i < teplotyProDatum.length; i++) {
                const cas = data.hourly.time[i].split("T")[1].slice(0, 5); // Získání času ve formátu HH:mm

                const casElement = document.createElement("div");
                casElement.classList.add("cas");
                casElement.textContent = cas;

                const teplotaElement = document.createElement("div");
                teplotaElement.textContent = `${teplotyProDatum[i]} °C`;

                const weathercodeElement = document.createElement("div");
                const weathercode = weathercodeProDatum[i];
                weathercodeElement.innerHTML = `${getWeatherIcon(weathercode)}`;

                casElement.appendChild(teplotaElement);
                casElement.appendChild(weathercodeElement);

                sloupec.appendChild(casElement);
            }

            // Aktualizace zobrazených dat
            pocasiElement.appendChild(sloupec);
        }

        // Funkce pro výpočet mediánu
        function calculateMedian(arr) {
            const sortedArr = arr.slice().sort((a, b) => a - b); // Vytvoření kopie pole a seřazení vzestupně.
            const middle = Math.floor(sortedArr.length / 2); // Vypočítání indexu prostředního prvku pole.
            if (sortedArr.length % 2 === 0) {   // Zkontrolování, zda je sudý nebo lichý počet prvků v seřazeném poli.
                const median = (sortedArr[middle - 1] + sortedArr[middle]) / 2; // Pokud je sudý počet prvků, mediánem je průměr dvou prostředních prvků.
                return median;
            } else {
                return sortedArr[middle]; // Pokud máme lichý počet prvků, mediánem je prostřední prvek.
            }
        }

        // Události pro změnu formátovaného data
        document.addEventListener("formattedDateChanged", (event) => {
            formattedDate = event.detail.newDate;
            // Aktualizace data po změně data
            updateWeatherData();
        });

        // Funkce pro změnu formátovaného data
        function changeFormattedDate(newDate) {
            const event = new CustomEvent("formattedDateChanged", {
                detail: { newDate },
            });
            document.dispatchEvent(event);
        }

            // Připojení události pro pravé tlačítko myši pouze na datových buňkách v kalendáři
            const calendarTable = document.querySelector('table');
            calendarTable.addEventListener('contextmenu', (event) => {
                event.preventDefault(); // Zabrání výchozímu chování kontextového menu (pravého kliknutí)

                const span = event.target;
                if (span.tagName === 'SPAN') { // Kontrola, zda bylo kliknuto přímo na <span>
                    const cell = span.parentElement;
                    const date = cell.dataset.date;

                    // Rozdělení data na rok, měsíc a den
                    const [year, month, day] = date.split('-');

                    // Funkce pro formátování čísel s přidáním nuly před jednocifernými hodnotami
                    const formatNumber = (num) => (num < 10 ? `0${num}` : num);

                    // Upravení data na formát YYYY-MM-DD
                    formattedDate = `${year}-${formatNumber(parseInt(month))}-${formatNumber(parseInt(day))}`;

                    // Vypsání do konzole na jaké datum bylo kliknuto
                    console.log(`Kliknuto na datum: ${formattedDate}`);

                    // Aktualizace zobrazených dat pro nové datum
                    changeFormattedDate(formattedDate);
                }
            });

            // Zobrazení dat pro aktuální datum při načtení stránky
            updateWeatherData();

        } catch (error) {
            console.error('Chyba při načítání dat o počasí:', error.message);
        }
    });


        // ČAS

        // Funkce pro získání aktuálního data a času ve formátu HH:mm:ss
        function getCurrentDateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            return `${hours}:${minutes}`; // celý čas ${hours}:${minutes}:${seconds}
        }

        // Zobraz aktuální datum a čas při načtení stránky
        const currentDateTimeElement = document.getElementById('currentDateTime');
        setInterval(() => {
            const currentDateTime = getCurrentDateTime();
            currentDateTimeElement.textContent = `${currentDateTime}`;
        }, 1000); // Aktualizuj každou sekundu
