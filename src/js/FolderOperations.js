const fs = require('fs');
const { exec } = require('child_process');


const NazevZamceneSlozky = 'Lock.{21EC2020-3AEA-1069-A2DD-08002B303­­­­­­09D}';
const NazevSlozky = 'Zamcena Slozka';
const Podadresar = 'Nová složka';


//  Console.error a console.log pouze pro debugging, není v kódu potřeba.

function vytvorSlozku(NazevZamceneSlozky) {
  fs.access(NazevZamceneSlozky, fs.constants.F_OK, (err) => {
    if (err) {
      // Složka neexistuje, vytvoříme ji
      fs.mkdir(NazevSlozky, (err) => {
        if (err) {
          // console.error(`Nepodarilo se vytvorit slozku "${NazevSlozky}": ${err}`);
        } else {
           // console.log(`Slozka "${NazevSlozky}" byla uspesne vytvorena.`);
          vytvorPodadresar(NazevSlozky, Podadresar);
        }
      });
    } else {
       // console.log(`Slozka "${NazevZamceneSlozky}" jiz existuje.`);
      vytvorPodadresar(NazevZamceneSlozky, Podadresar);
    }
  });
}

function vytvorPodadresar(rodicSlozka, nazevPodadresare) {
  const cesta = `${rodicSlozka}/${nazevPodadresare}`;
  fs.access(cesta, fs.constants.F_OK, (err) => {
    if (err) {
      // Podadresář neexistuje, vytvoříme ho
      fs.mkdir(cesta, (err) => {
        if (err) {
          // console.error(`Nepodarilo se vytvorit podadresar "${cesta}": ${err}`);
        } else {
          // console.log(`Podadresar "${cesta}" byl uspesne vytvoren.`);
        }
      });
    } else {
      // console.log(`Podadresar "${cesta}" jiz existuje.`);
    }
  });
}

function RenameFolder() {
  try {
    fs.renameSync(NazevSlozky, NazevZamceneSlozky);
    LockFolder();
    // console.log('Slozka byla uspesne prejmenovana.');
  } catch (err) {
    // console.error(`Nepodarilo se prejmenovat slozku: ${err}`);
  }
}

function LockFolder() {
  try {
    exec(`attrib +h +s "${NazevZamceneSlozky}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Nepodarilo se pouzit prikaz "attrib": ${error}`);
        return;
      }
      if (stderr) {
        console.error(`Chyba pri provadeni prikazu "attrib": ${stderr}`);
        return;
      }
      // console.log(`Slozka "${NazevZamceneSlozky}" byla uspesne nastavena jako skryta a systemova.`);
    });
  } catch (err) {
    console.error(`Chyba pri skryvani slozky: ${err}`);
  }
}

function UnlockFolder() {
  fs.rename(NazevZamceneSlozky, NazevSlozky, (err) => {
    if (err) {
      console.error(`Nepodarilo se prejmenovat slozku: ${err}`);
    } else {
      ShowFolder();
      // console.log('Slozka byla uspesne prejmenovana.');
    }
  });
}

function ShowFolder() {
  exec(`attrib -h -s "${NazevSlozky}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Nepodarilo se pouzit prikaz "attrib": ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Chyba pri provadeni prikazu "attrib": ${stderr}`);
      return;
    }
    // console.log(`Slozka "${NazevSlozky}" byla uspesne nastavena jako skryta a systemova.`);
  });
}

vytvorSlozku(NazevZamceneSlozky);

module.exports = {
  vytvorSlozku,
  RenameFolder,
  LockFolder,
  UnlockFolder,
  ShowFolder,
};
