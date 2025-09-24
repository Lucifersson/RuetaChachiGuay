// src/grid.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const filas = 3;
    const columnas = 12;
    let numero = 1;

    for (let col = 0; col < columnas; col++) {
        for (let fila = filas - 1; fila >= 0; fila--) { // de abajo hacia arriba
            const div = document.createElement('div');

            div.className = `
  border-2 border-white flex items-center justify-center
  text-white font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl
  max-h-[50px] max-w-[50px] sm:max-h-[60px] sm:max-w-[60px] md:max-h-[70px] md:max-w-[70px] lg:max-h-[80px] lg:max-w-[80px]
  shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]
  transition-transform duration-400 hover:-translate-y-1 hover:shadow-xl
  bg-gradient-to-b from-red-600 to-orange-500 z-10


      `;

            // Alternancia de degradado por impar/par
            if (numero % 2 === 0) {
                div.classList.replace('from-red-600', 'from-black');
                div.classList.replace('to-orange-500', 'to-gray-800');
            }

            div.textContent = numero;
            grid.appendChild(div);

            numero++;
        }
    }
});

const carrusel = document.getElementById("carrusel");

// Generar casillas de 0 a 36
for (let i = 0; i <= 36; i++) {
    const casilla = document.createElement("div");
    casilla.className = "h-16 flex items-center justify-center snap-center text-xl font-bold border-b border-gray-500";

    // Colores según regla de ruleta
    if (i === 0) {
        casilla.classList.add("bg-green-600", "text-white");
    } else if (i % 2 === 0) {
        casilla.classList.add("bg-black", "text-white");
    } else {
        casilla.classList.add("bg-red-600", "text-white");
    }

    casilla.textContent = i;
    carrusel.appendChild(casilla);
}

/**
 * Gira la ruleta hasta un número específico
 * @param {number} numero - El número que debe quedar en el centro
 * @param duracion
 */
function girarHasta(numero, duracion = 5000) {
    const casillas = carrusel.children;
    const target = Array.from(casillas).find(c => parseInt(c.textContent) === numero);
    if (!target) return;

    const offsetTop = target.offsetTop;
    const centerOffset = carrusel.clientHeight / 2 - target.clientHeight / 2;

    // Añadimos vueltas extra para que parezca real
    const vueltasExtra = carrusel.scrollHeight * 3;
    const destinoFinal = offsetTop - centerOffset + vueltasExtra;

    const inicio = carrusel.scrollTop;
    const distancia = destinoFinal - inicio;
    const startTime = performance.now();

    function animarScroll(time) {
        const elapsed = time - startTime;
        const progreso = Math.min(elapsed / duracion, 1);

        // Ease-out cúbico → empieza rápido y termina suave
        const easeOut = 1 - Math.pow(1 - progreso, 3);

        carrusel.scrollTop = inicio + distancia * easeOut;

        if (progreso < 1) {
            requestAnimationFrame(animarScroll);
        }
    }

    requestAnimationFrame(animarScroll);
}


// ======== LLAMADA AUTOMÁTICA AL CARGAR LA PÁGINA =========
window.addEventListener("load", () => {
    const numeroDelBack = Math.floor(Math.random() * 37); // simula número recibido del backend
    console.log("Número del backend:", numeroDelBack);
    girarHasta(numeroDelBack);
});
