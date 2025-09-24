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

function generarCasillas() {
    for (let i = 0; i <= 36; i++) {
        const cell = document.createElement("div");

        cell.className = `
      border-2 border-white flex items-center justify-center
      text-white font-extrabold text-xl
      h-[70px] w-[70px] mx-auto
      shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]
      transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
      snap-center
    `;

        if (i === 0) {
            cell.classList.add("bg-green-600");
        } else if (i % 2 === 0) {
            cell.classList.add("bg-black");
        } else {
            cell.classList.add("bg-red-600");
        }

        cell.textContent = i;
        carrusel.appendChild(cell);
    }
}

// Generar varias veces para simular infinito
for (let j = 0; j < 5; j++) {
    generarCasillas();
}

// Colocar scroll al centro
carrusel.scrollTop = carrusel.scrollHeight / 2;

// Bucle infinito
carrusel.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = carrusel;

    if (scrollTop <= 0) {
        carrusel.scrollTop = scrollHeight / 2 - clientHeight;
    } else if (scrollTop + clientHeight >= scrollHeight) {
        carrusel.scrollTop = scrollHeight / 2 - clientHeight;
    }
});

