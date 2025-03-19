// Crear el mapa centrado en Latinoamérica con zoom ajustado
var map = L.map('map').setView([-9.053496, -70], 3.5); // Ajustar la vista inicial y el zoom

// Crear los diferentes mapas base
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var stamenTerrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}@2x.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
});

var cartoDBPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
});

// Establecer el mapa base inicial
cartoDBPositron.addTo(map);

// Crear el control de capas
var baseMaps = {
    "OpenStreetMap": openStreetMap,
    "Stamen Terrain": stamenTerrain,
    "CartoDB Positron": cartoDBPositron
};

L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

// Lista de capitales con coordenadas
var capitales = [
    { nombre: "Buenos Aires", pais: "Argentina", lat: -34.6037, lon: -58.3816 },
    { nombre: "La Paz", pais: "Bolivia", lat: -16.5000, lon: -68.1500 },
    { nombre: "Brasilia", pais: "Brasil", lat: -15.7801, lon: -47.9292 },
    { nombre: "Santiago", pais: "Chile", lat: -33.4489, lon: -70.6693 },
    { nombre: "Bogotá", pais: "Colombia", lat: 4.7110, lon: -74.0721 },
    { nombre: "Lima", pais: "Perú", lat: -12.0464, lon: -77.0428 },
    //{ nombre: "Asunción", pais: "Paraguay", lat: -25.285285, lon: -57.640253 }, 
    //{ nombre: "Quito", pais: "Ecuador", lat: -0.220000, lon: -78.512500 }, 
    //{ nombre: "Caracas", pais: "Venezuela", lat: 10.506462, lon: -66.919541}, 
    //{ nombre: "Ciudad de México", pais: "México", lat: 19.438530, lon: -99.132155},   
    //{ nombre: "San José", pais: "Costa Rica", lat: 9.934275, lon: -84.087675},   
    //{ nombre: "Santo domingo", pais: "Republica Dominica", lat: 18.484199, lon: -69.934606} 
];

// Función para obtener la fecha actual en formato DD-MM-YYYY
function obtenerFechaActual() {
    let fecha = new Date();
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
    let año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
}

// Agregar círculos y popups en cada capital
capitales.forEach(capital => {
    let circle = L.circle([capital.lat, capital.lon], {
        color: 'green',
        fillColor: 'white',
        fillOpacity: 0.5,
        radius: 30000
    }).addTo(map);

    // Crear el popup con formulario
    let popupContent = `
        <h3>${capital.nombre}, ${capital.pais}</h3>
        <form id="form-${capital.nombre}">
            <label>Nombre:</label><br>
            <input type="text" id="nombre-${capital.nombre}" required><br>

            <label>Organización:</label><br>
            <input type="text" id="organizacion-${capital.nombre}" required><br>

            <label>Fecha:</label><br>
            <input type="text" id="fecha-${capital.nombre}" value="${obtenerFechaActual()}" readonly><br>

            <label>URL Adjunta:</label><br>
            <input type="url" id="url-${capital.nombre}" placeholder="https://ejemplo.com"><br>

            <button type="button" onclick="guardarDatos('${capital.nombre}')">Guardar</button>
        </form>
    `;

    circle.bindPopup(popupContent);
});

// Función para guardar datos (puedes modificarla para enviarlos a una base de datos)
function guardarDatos(ciudad) {
    let nombre = document.getElementById(`nombre-${ciudad}`).value;
    let organizacion = document.getElementById(`organizacion-${ciudad}`).value;
    let url = document.getElementById(`url-${ciudad}`).value;
    let fecha = document.getElementById(`fecha-${ciudad}`).value;

    if (nombre && organizacion) {
        alert(`Datos guardados para ${ciudad}:\nNombre: ${nombre}\nOrganización: ${organizacion}\nURL: ${url}`);
        agregarFila(ciudad, nombre, organizacion, url, fecha); // Asegurarse de pasar la fecha
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función para agregar una fila a la tabla
function agregarFila(ciudad, nombre, organizacion, url, fecha) {
    let table = document.getElementById("infoTableContent").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();
    newRow.insertCell(0).innerHTML = ciudad;
    newRow.insertCell(1).innerHTML = nombre;
    newRow.insertCell(2).innerHTML = organizacion;
    newRow.insertCell(3).innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    newRow.insertCell(4).innerHTML = fecha; // Asegurarse de agregar la fecha
}

// Función para mostrar/ocultar la tabla
function toggleTable() {
    let infoTableContainer = document.getElementById("infoTableContainer");
    let toggleButton = document.getElementById("toggleButton");
    let map = document.getElementById("map");
    if (infoTableContainer.style.height === "0px" || infoTableContainer.style.height === "") {
        infoTableContainer.style.height = "10%";
        map.style.height = "calc(100% - 10%)"; // Ajustar la altura del mapa
        document.getElementById("infoTable").style.display = "block";
        toggleButton.style.bottom = "10%"; // Mover el botón junto con el contenedor
        toggleButton.innerHTML = "&#9650;"; // Cambiar a flecha hacia arriba
    } else {
        infoTableContainer.style.height = "0";
        map.style.height = "100%"; // Ajustar la altura del mapa
        document.getElementById("infoTable").style.display = "none";
        toggleButton.style.bottom = "10px"; // Mover el botón junto con el contenedor
        toggleButton.innerHTML = "&#9660;"; // Cambiar a flecha hacia abajo
    }
}