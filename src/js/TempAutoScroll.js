// Funkce která automatický posová scrollbar u předpovědi počasí podel času

/*
1* 0 - 0:00 až 3:00 
1* 1 - 4:00 až 7:00
1* 2 - 8:00 až 11:00
1* 3 - 12:00 až 15:00
1* 4 - 16:00 až 19:00
1* 5 - 20:00 až 23:00
*/

const content = document.querySelector(".ramec");
const scrollbarPositions = [0, 285, 570, 850, 1130, 1400]; // Pozice pro každé číslo od 0 do 5

function roundToNearestHour(date) {
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}

function scrollContent() {
    const now = new Date();
    roundToNearestHour(now);
    const hour = now.getHours();
    let position;

    if (hour >= 0 && hour < 3) {
        position = 0;
    } else if (hour >= 4 && hour < 7) {
        position = 1;
    } else if (hour >= 8 && hour < 11) {
        position = 2;
    } else if (hour >= 12 && hour < 15) {
        position = 3;
    } else if (hour >= 16 && hour < 19) {
        position = 4;
    } else if (hour >= 20 && hour < 23) {
        position = 5;
    } else {
        // Zjistí nejbližší možný časový úsek
        if (hour < 4) {
            position = 0;
        } else if (hour < 8) {
            position = 1;
        } else if (hour < 12) {
            position = 2;
        } else if (hour < 16) {
            position = 3;
        } else if (hour < 20) {
            position = 4;
        } else {
            position = 5;
        }
    }

    const scrollAmount = scrollbarPositions[position]; // Získání pozice scrollbaru pro zadané číslo
    content.scrollLeft = scrollAmount; // Nastavení pozice scrollbaru bez čekání

    setTimeout(scrollContent, 60 * 1000);
}

scrollContent();