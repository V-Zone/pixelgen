// Inicializálás
const canvas = document.getElementById("canvas");
const colorPicker = document.getElementById("colorPicker");
const output = document.getElementById("output");

let currentColor = colorPicker.value;
let currentTool = 'brush'; // Kezdetben ecsettel dolgozunk
let isDrawing = false;
let rows = 12; // Alapértelmezett sorok
let columns = 12; // Alapértelmezett oszlopok
let pixels = []; // Tárolja a pixel div-eket

// Színválasztó esemény
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
});

// Eszköztár gombok kezelése
document.getElementById("brush").addEventListener("click", () => {
  currentTool = 'brush';
});

document.getElementById("eraser").addEventListener("click", () => {
  currentTool = 'eraser';
});

document.getElementById("bucket").addEventListener("click", () => {
  applyBucket(currentColor);
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
  }
}

// Vödör funkció - Az egész vászon színezése
function applyBucket(color) {
  pixels.forEach(pixel => {
    pixel.style.backgroundColor = color;
  });
  generateYml(); // Azonnali kód generálás
}

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

// YAML generálás
function generateYml() {
  let yml = "background:\n";

  for (let i = 0; i < rows; i++) {
    let row = "&f"; // Kezdő fehér szín
    let currentColor = "#ffffff";

    for (let j = 0; j < columns; j++) {
      const pixel = pixels[i * columns + j];
      const color = rgbToHex(pixel.style.backgroundColor || "#ffffff");

      // Ha a szín változik, akkor új színt kezdünk
      if (color !== currentColor) {
        currentColor = color;

        // Szín kód hozzáadása
        if (color === "#ffffff") {
          row += "&f";
        } else if (color === "#000000") {
          row += "&0";
        } else {
          row += `&#${color.slice(1)}`;
        }
      }
      row += "█";
    }
    yml += `  - "${row}"\n`;
  }

  output.textContent = yml;
}

// Másolás a vágólapra
output.addEventListener("click", () => {
  navigator.clipboard
    .writeText(output.textContent)
    .then(() => {
      alert("A YAML kód vágólapra másolva!");
    })
    .catch((err) => {
      console.error("Másolási hiba:", err);
    });
});

// Vászon létrehozása alapértelmezett mérettel
createCanvas(rows, columns);
generateYml(); // Automatikus YAML generálás az oldal betöltésekor
