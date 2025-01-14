<?php
// You can add dynamic PHP functionality here if needed (e.g., database connection, form handling)
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VZone Pixel Generator</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Fejléc -->
    <header>
        <h1>VZone Pixel Generator</h1>
    </header>

    <div class="container">
        <!-- Eszköztár -->
        <div id="toolbar">
            <button id="brush" class="tool">🖌️ Brush</button>
            <button id="eraser" class="tool">🧽 Eraser</button>
            <button id="bucket" class="tool">🪣 Bucket</button>
            <button id="eyedropper" class="tool">🔍 Eye Dropper</button>

            <!-- Színválasztó -->
            <label for="colorPicker" class="tool">Color Picker:</label>
            <input type="color" id="colorPicker" value="#1e90ff">
        </div>

        <!-- Vászon beállítása -->
        <div class="settings">
            <label for="rows">Rows:</label>
            <input type="number" id="rows" value="12" min="1">
            <label for="columns">Columns:</label>
            <input type="number" id="columns" value="12" min="1">
            <button id="resizeButton">Resizing</button>
        </div>

        <!-- Vászon -->
        <div id="canvas"></div>

        <!-- Kimeneti YAML -->
        <pre id="output"></pre>
    </div>

    <!-- Lábléc -->
    <footer>
        <p>Discord: <a href="https://dc.vzone.hu" target="_blank">https://dc.vzone.hu</a></p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
