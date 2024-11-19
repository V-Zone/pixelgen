// Inicializálás
const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");
const output = document.getElementById("output");

let currentColor = colorPicker.value; // Kezdeti szín a színválasztóból
let currentTool = 'brush'; // Kezdetben ecsettel dolgozunk
let isDrawing = false;
let rows = 12; // Alapértelmezett sorok
let columns = 12; // Alapértelmezett oszlopok
let pixels = []; // Tárolja a pixel div-eket
let textInput = ''; // Az új szöveg tárolásához változó

// Színválasztó esemény
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value; // A kiválasztott szín beállítása
  colorPicker.style.backgroundColor = currentColor; // A színválasztó háttérszínének frissítése
});

// Eszköztár gombok kezelése
document.getElementById("brush").addEventListener("click", () => {
  currentTool = 'brush';
});

document.getElementById("eraser").addEventListener("click", () => {
  currentTool = 'eraser';
});

document.getElementById("bucket").addEventListener("click", (event) => {
  // Az eseményben átadjuk a színt és a kattintott pixelt
  applyBucket(event, currentColor); 
});

document.getElementById("eyedropper").addEventListener("click", () => {
  currentTool = 'eyedropper';
});



// Vászon átméretezése
document.getElementById("resizeButton").addEventListener("click", () => {
  const newRows = parseInt(document.getElementById("rows").value);
  const newColumns = parseInt(document.getElementById("columns").value);

  if (newRows > 0 && newColumns > 0) {
    rows = newRows;
    columns = newColumns;
    clearCanvas();
    createCanvas(rows, columns);
    generateYml(); // Kód újragenerálása az új mérethez
  }
});

// Vászon létrehozása
function createCanvas(rows, columns) {
  canvas.innerHTML = ""; // Vászon törlése a régiek eltávolításához
  pixels = []; // Pixels tömb törlése

  for (let i = 0; i < rows * columns; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.style.backgroundColor = "#ffffff"; // Alapértelmezett fehér
    pixels.push(pixel);

    // Kattintás és húzás kezelés
    pixel.addEventListener("mousedown", () => {
      isDrawing = true;
      handleToolAction(pixel);
      generateYml(); // Azonnali kód generálás
    });

    pixel.addEventListener("mousemove", () => {
      if (isDrawing) {
        handleToolAction(pixel);
        generateYml(); // Azonnali kód generálás
      }
    });

    pixel.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    canvas.appendChild(pixel);
  }

  canvas.style.gridTemplateColumns = `repeat(${columns}, 30px)`;
  canvas.style.gridTemplateRows = `repeat(${rows}, 30px)`;
}

// Canvas törlése
function clearCanvas() {
  canvas.innerHTML = "";
  pixels.length = 0; // Tömb törlése
}

// Pixel színének változtatása az eszköztől függően
function handleToolAction(pixel) {
  if (currentTool === 'brush') {
    pixel.style.backgroundColor = currentColor; // Színezés
  } else if (currentTool === 'eraser') {
    pixel.style.backgroundColor = "#ffffff"; // Törlés
  } else if (currentTool === 'eyedropper') {
    currentColor = rgbToHex(pixel.style.backgroundColor); // Pipetta: szín kiválasztás
    colorPicker.value = currentColor; // Színválasztó frissítése
    colorPicker.style.backgroundColor = currentColor; // Színválasztó háttérszínének frissítése
  } else if (currentTool === 'text') {
    // Szöveg hozzáadása a pixelhez
    pixel.textContent = textInput;
    pixel.style.color = currentColor; // A szöveg színének beállítása
    pixel.style.fontSize = "12px"; // A szöveg méretének beállítása
    textInput = ''; // Szöveg törlése a felugró ablak után
    currentTool = 'brush'; // Visszaállítunk a festő eszközre
  }
}

// Vödör funkció - Szomszédos kockák színezése a kattintott pixel színével
function applyBucket(event, color) {
  const targetColor = rgbToHex(event.target.style.backgroundColor); // Az eredeti szín a kattintott kockából
  if (targetColor === color) return; // Ha a kattintott pixel színe már megegyezik a célszínnel, ne csináljon semmit

  const visited = new Set(); // Nyomon követjük a már meglátogatott pixeleket
  const stack = [event.target]; // A stack-ben tároljuk azokat a pixeleket, amelyeket be kell járnunk

  // Flood fill algoritmus, amely végigjárja az összes szomszédos kockát
  while (stack.length > 0) {
    const currentPixel = stack.pop();
    const pixelIndex = pixels.indexOf(currentPixel);

    // Ha már meglátogattuk ezt a pixelt, akkor lépjünk tovább
    if (visited.has(pixelIndex)) continue;
    visited.add(pixelIndex); // Jelöljük meg, hogy már látogattuk

    // Csak akkor színezünk, ha a pixel színe megegyezik az eredeti színnel
    if (currentPixel.style.backgroundColor === targetColor) {
      currentPixel.style.backgroundColor = color; // Színezés

      // Ellenőrizzük a szomszédokat (fel, le, bal, jobb)
      const neighbors = [
        pixelIndex - columns, // Fölött
        pixelIndex + columns, // Alatta
        pixelIndex - 1, // Balra
        pixelIndex + 1, // Jobbra
      ];

      // Szomszédos pixelek hozzáadása a stackhez, ha még nem látogattuk meg őket
      neighbors.forEach((neighborIndex) => {
        // A szomszédos pixelek csak akkor kerülhetnek be, ha nem mentek ki a vászon határain
        if (
          neighborIndex >= 0 &&
          neighborIndex < pixels.length &&
          !visited.has(neighborIndex) &&
          !(neighborIndex % columns === 0 && pixelIndex % columns === columns - 1) &&
          !(neighborIndex % columns === columns - 1 && pixelIndex % columns === 0)
        ) {
          stack.push(pixels[neighborIndex]);
        }
      });
    }
  }

  generateYml(); // Azonnali kód generálás
}

document.querySelectorAll('.tool').forEach(tool => {
  tool.addEventListener('click', function() {
    // Eltávolítjuk a "selected" osztályt az összes eszközről
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('selected'));
    
    // Hozzáadjuk a "selected" osztályt a kiválasztott eszközhöz
    this.classList.add('selected');
    
    // Az eszköz funkcióinak beállítása
    currentTool = this.id;  // Tartsuk nyilván, melyik eszközt választották
  });
});

// RGB szín hex kóddá alakítása
function rgbToHex(rgb) {
  if (!rgb) return "#ffffff";
  const result = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (result) {
    const r = parseInt(result[1]).toString(16).padStart(2, "0");
    const g = parseInt(result[2]).toString(16).padStart(2, "0");
    const b = parseInt(result[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return rgb;
}
function updateCanvasSize() {
  const rows = document.getElementById('rows').value;
  const columns = document.getElementById('columns').value;

  const canvas = document.getElementById('canvas');
  
  // Növeljük a vászon magasságát és szélességét (alapértelmezett cella mérettel)
  const cellSize = 30; // Egy cella mérete (px)
  canvas.style.width = `${columns * cellSize}px`;  // Szélesség = oszlopok száma * cella méret
  canvas.style.height = `${rows * cellSize}px`;    // Magasság = sorok száma * cella méret
}

// Hívjuk meg a vászon frissítését a "Resize" gombnyomáskor
document.getElementById('resizeButton').addEventListener('click', updateCanvasSize);

// Kattintás esemény a generált YAML kódra
document.getElementById("output").addEventListener("click", function() {
  // Másolandó szöveg
  const outputText = document.getElementById("output").textContent;

  // Másolás a vágólapra
  navigator.clipboard.writeText(outputText)
      .then(() => {
          // Üzenet létrehozása és hozzáadása
          var message = document.createElement('div');
          message.classList.add('copy-message');
          message.textContent = 'Sikeres másolás!';

          // Hozzáadjuk a DOM-hoz
          document.body.appendChild(message);

          // Az üzenet eltűnik 2 másodperc után
          setTimeout(function() {
              message.classList.add('fade');
              setTimeout(function() {
                  message.remove();
              }, 500); // Eltűnés után eltávolítjuk a DOM-ból
          }, 2000); // 2 másodperc után eltüntetjük
      })
      .catch((err) => {
          console.error('Hiba történt a szöveg másolásakor: ', err); // Hiba kezelése
      });
});




// Szövegmező eseményfigyelő
document.getElementById("centerText").addEventListener("input", () => {
  generateYml(); // Azonnali YAML frissítés szöveg megadása után
});

// YAML generálás (korábban frissített változat)
function generateYml() {
  let yml = "  generated:\n    messages:\n";
  const text = document.getElementById("centerText").value; // Szöveg a mezőből
  const lines = text.split("\\n"); // Az `\n` karakterek mentén daraboljuk a szöveget
  const textStartRow = Math.floor(rows / 2) - Math.floor(lines.length / 2); // Szöveg kezdősorának pozíciója
  const textStartColumn = columns + 2; // A szöveg oszlop kezdete (vászon után)

  for (let i = 0; i < rows; i++) {
    let row = "&f"; // Kezdő szín (fehér)
    let currentColor = "#ffffff";

    // Vászon rajzolása
    for (let j = 0; j < columns; j++) {
      const pixel = pixels[i * columns + j];
      const color = rgbToHex(pixel.style.backgroundColor || "#ffffff");

      if (color !== currentColor) {
        currentColor = color;
        row += color === "#ffffff" ? "&f" : color === "#000000" ? "&0" : `&#${color.slice(1)}`;
      }
      row += "█";
    }

    // Szöveg hozzáadása, ha ez a sor egy szövegsorhoz tartozik és nem üres
    if (i >= textStartRow && i < textStartRow + lines.length) {
      const textLine = lines[i - textStartRow].trim(); // Az adott szövegsor (levágott üres szóközök)
      if (textLine) {
        row += " ".repeat(textStartColumn - columns) + `&f${textLine}`; // Szöveg hozzáadása
      }
    }

    yml += `      - "${row}"\n`;
  }

  document.getElementById("output").textContent = yml; // YAML kimenet
}


// Vászon létrehozása kezdetben
createCanvas(rows, columns);
generateYml(); // Automatikus YAML generálás az oldal betöltésekor
