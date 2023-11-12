<h1 align="center">
  <br>
  <a href="https://github.com/patekcz"><img src="https://github.com/patekcz/FolderLock/assets/52839023/2a18da8c-058f-4a48-9bf9-f736faba9fc4" height="100" alt="Folder Lock"></a>
  <br>
  Folder Lock
  <br>
</h1>

<p align="center">Aplikace napsána v JavaScriptu s využitím Electron frameworku.</p>
<p align="center">Nabízí skrytou složkou, kalendář s předpovědí počasí, průzkumník souborů a webové okna</p>
<p align="center">Pokud využijete můj kód, budu rád když zmíníte původního tvůrce ve svém kódu</p>

<div align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=00FFFB&random=false&width=250&lines=Open+source+%E2%9C%B0" alt="Typing SVG" /></a>
</div>

<br>




   ## ⭐ Jak začít
     
   - Otevřete Terminal a následujte kroky
      
  ```sh
  $ git clone https://github.com/patekcz/FolderLock.git
  $ cd FolderLock
  $ npm install
  $ npm start
  ```
   
   - Pokud chcete využít příkazy `git` a `npm`, je potřeba mít nainstalované balíčky [Node.js](https://nodejs.org/en) a [Git](https://git-scm.com/downloads)

<br>

   ## 🌸 Informace
   
   - Při prvním spuštění, aplikace vytvoří složku "Zamcena Slozka" ve stejném adresáři, obsahující podsložku "Nová složka".
   - Kód vytvoří složku pouze tehdy, pokud neexistuje.
   - Vyhledávací pole slouží pro zadávaní příkazů a vyhledávaní ve složce.
   - Klávesovou zkratkou `Ctrl+Alt+H` se zobrazí nápověda.
   - Základní heslo pro odemčení složky a povolení otevírání soukromích oken je `@password`.

<br>

   ## 🌱 Nastavení
   
- Většina vzhledových úprav se dá nastavit v souboru `config.css`
- Pokud chcete upravit heslo pro složku, lokaci pro předpověď a nebo počet dnů předpovědí, vše naleznete v souboru `.env`

  <img src="https://github.com/patekcz/FolderLock/assets/52839023/3649f684-83ef-4bbf-b1d3-74b7c9602ac9" height="300">
  <img src="https://github.com/patekcz/FolderLock/assets/52839023/3d77efb0-d42e-41c7-a521-0979fdda45c8" height="300">


- Pokud máte zájem upravit heslo, kód naleznete v souboru `main.js`, možné je například upravit prefix `@`.

  <img src="https://github.com/patekcz/FolderLock/assets/52839023/b34495d5-e6a0-4395-8e9e-99a672e9ec01" height="300">

- Pokud chcete upravit název skryté složky, nastavení naleznete v souboru `FolderOperations.js`

  <img src="https://github.com/patekcz/FolderLock/assets/52839023/68da6bbe-3b31-4fd2-9499-eeb30ba38f24" height="300">


<details>
  <summary>Folder and Files Tree</summary>
  <ol>
    
```sh
FolderLock:.
│   .env     # Konfigurační soubor pro nastavení hesla, lokace a pod.
│   package-lock.json 
│   package.json
│   
└───src
    │   index.html
    │   main.js     # Hlavní soubor aplikace
    │   script.js     # Detekce akcí v html a poslaní je do electron
    │   
    ├───css
    │       config.css     # Hlavní soubor pro nastavení vzhledu aplikace
    │       styles.css     # Celý css kód aplikace
    │       
    ├───icons
    │   │   drop.png
    │   │   icon.ico
    │   │   pozadi.jpg
    │   │
    │   ├───Bourka
    │   │       Bourka.png
    │   │
    │   ├───Bourka-s-krupobitím
    │   │       Bourka-s-krupobitím-silné.png
    │   │       Bourka-s-krupobitím-slabé.png
    │   │
    │   ├───Dést
    │   │       Dést-silná-intenzita.png
    │   │       Dést-slabá-intenzita.png
    │   │       Dést-strední-intenzita.png
    │   │
    │   ├───folder
    │   │       file-icon.png
    │   │       folder-icon.png
    │   │       image-icon.png
    │   │       play-circle-outline.svg
    │   │
    │   ├───Jasno
    │   │       Jasná-obloha.png
    │   │
    │   ├───Kroupy
    │   │       Kroupy.png
    │   │
    │   ├───Mlha
    │   │       Mlha-silná-intenzita.png
    │   │       Mlha-slabá-intenzita.png
    │   │
    │   ├───Mrazivé-mrholení
    │   │       Mrazivé-mrholení-silné.png
    │   │       Mrazivé-mrholení-slabé.png
    │   │
    │   ├───Mrazivý-dést
    │   │       Mrazivý-dést-silná-intenzita.png
    │   │       Mrazivý-dést-slabá-intenzita.png
    │   │
    │   ├───Mrholení
    │   │       Mrholení-silná-intenzita.png
    │   │       Mrholení-slabá-intenzita.png
    │   │       Mrholení-strední-intenzita.png
    │   │
    │   ├───Noc
    │   │       Mesíc-zataženo.png
    │   │       Mesíc.png
    │   │
    │   ├───Snezení
    │   │       Snezení-silná-intenzita.png
    │   │       Snezení-slabá-intenzita.png
    │   │       Snezení-strední-intenzita.png
    │   │
    │   └───Zatazeno
    │           Castecne-zatazeno.png
    │           Hlavne-jasno.png
    │           Zatazeno.png
    │
    └───js
            ActivityDetect.js     # Detekce aktivity uživatele (Po 30min automaticky uzamknout složku)
            DirectoryExplorer.js     # Funkce pro zobrazování adresáře
            FolderOperations.js     # Funkce pro vytvoření a skrytí složky
            GetWeatherData.js      # Funkce pro získání počasí
            HideAtSymbolInput.js     # Fukce pro skrytí textu ve vyhledávaní, pokud text začíná "@" 
            LoadCalendar.js     # Funkce pro načtení kalendáře
            LoadTempData.js     # Funkce pro načtení dat o počasí
            TempAutoScroll.js      # Funkce pro automatické posunování scrollbaru u předpovědi počasí
```

  </ol>
</details>



