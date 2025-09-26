// src/grid.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Generando grid de números...');
    const grid = document.getElementById('grid');
    if (!grid) {
        console.error('No se encontró el grid');
        return;
    }

    const filas = 3;
    const columnas = 12;
    let numero = 1;

    // Limpiar el grid primero
    grid.innerHTML = '';

    for (let col = 0; col < columnas; col++) {
        for (let fila = filas - 1; fila >= 0; fila--) { // de abajo hacia arriba
            const div = document.createElement('div');

            div.className = `
                border-2 border-white flex items-center justify-center
                text-white font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl
                min-h-[50px] min-w-[50px] sm:min-h-[60px] sm:min-w-[60px] md:min-h-[70px] md:min-w-[70px] lg:min-h-[80px] lg:min-w-[80px]
                shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]
                transition-transform duration-400 hover:-translate-y-1 hover:shadow-xl
                bg-gradient-to-b from-red-600 to-orange-500 z-10
                cursor-pointer
            `;

            // Alternancia de degradado por impar/par
            if (numero % 2 === 0) {
                div.classList.add('bg-gradient-to-b', 'from-gray-700', 'to-gray-900');
                div.classList.remove('from-red-600', 'to-orange-500');
            }

            div.textContent = numero;
            div.setAttribute('data-number', numero);

            // Agregar event listener para hacer click en el número
            div.addEventListener('click', () => {
                console.log(`Clicked on number: ${numero}`);
                if (!isSpinning) {
                    girarHasta(numero);
                }
            });

            grid.appendChild(div);
            numero++;
        }
    }

    console.log(`Grid generado con ${numero - 1} números`);
});

// ============ NUEVA IMPLEMENTACIÓN DE RULETA ============

// Números de ruleta con sus colores correspondientes
const rouletteNumbers = [
    {num: '0', color: 'green'},
    {num: '32', color: 'red'}, {num: '15', color: 'black'}, {num: '19', color: 'red'},
    {num: '4', color: 'black'}, {num: '21', color: 'red'}, {num: '2', color: 'black'},
    {num: '25', color: 'red'}, {num: '17', color: 'black'}, {num: '34', color: 'red'},
    {num: '6', color: 'black'}, {num: '27', color: 'red'}, {num: '13', color: 'black'},
    {num: '36', color: 'red'}, {num: '11', color: 'black'}, {num: '30', color: 'red'},
    {num: '8', color: 'black'}, {num: '23', color: 'red'}, {num: '10', color: 'black'},
    {num: '5', color: 'red'}, {num: '24', color: 'black'}, {num: '16', color: 'red'},
    {num: '33', color: 'black'}, {num: '1', color: 'red'}, {num: '20', color: 'black'},
    {num: '14', color: 'red'}, {num: '31', color: 'black'}, {num: '9', color: 'red'},
    {num: '22', color: 'black'}, {num: '18', color: 'red'}, {num: '29', color: 'black'},
    {num: '7', color: 'red'}, {num: '28', color: 'black'}, {num: '12', color: 'red'},
    {num: '35', color: 'black'}, {num: '3', color: 'red'}, {num: '26', color: 'black'}
];

let isSpinning = false;

function initializeRoulette() {
    const carrusel = document.getElementById('carrusel');
    if (!carrusel) {
        console.error('No se encontró el elemento carrusel');
        return;
    }

    // Limpiar contenido existente de la ruleta (conservar indicadores)
    const existingWheel = document.getElementById('roulette-wheel');
    if (existingWheel) {
        existingWheel.remove();
    }

    // Crear contenedor de las casillas
    const wheel = document.createElement('div');
    wheel.id = 'roulette-wheel';
    wheel.className = 'absolute w-full flex flex-col transform translate-y-0 transition-none';

    // Crear múltiples ciclos para animación continua (unas 8 vueltas completas)
    for (let cycle = 0; cycle < 8; cycle++) {
        rouletteNumbers.forEach(item => {
            const slot = document.createElement('div');
            slot.className = `w-full h-11 border border-white/20 border-b-black/30 flex items-center justify-center 
                            text-lg font-bold text-white font-serif box-border
                            shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]`;

            // Aplicar colores con Tailwind
            if (item.color === 'red') {
                slot.classList.add('bg-gradient-to-b', 'from-red-600', 'to-red-800');
            } else if (item.color === 'black') {
                slot.classList.add('bg-gradient-to-b', 'from-gray-600', 'to-gray-900');
            } else { // green (0)
                slot.classList.add('bg-gradient-to-b', 'from-emerald-600', 'to-emerald-800');
            }

            slot.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
            slot.textContent = item.num;
            wheel.appendChild(slot);
        });
    }

    carrusel.appendChild(wheel);
    console.log('Ruleta inicializada correctamente');

    // Actualizar debug info
    updateDebugInfo('Ruleta lista');
}

/**
 * Gira la ruleta hasta un número específico
 * @param {number|string} targetNumber - El número que debe quedar en el centro
 */
function girarHasta(targetNumber) {
    if (isSpinning) {
        console.log('La ruleta ya está girando');
        updateDebugInfo('Ruleta ocupada');
        return;
    }

    const wheel = document.getElementById('roulette-wheel');
    if (!wheel) {
        console.error('No se encontró la rueda de la ruleta');
        updateDebugInfo('Error: no hay rueda');
        return;
    }

    // Deshabilitar botón
    const btn = document.getElementById('girar-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = '🔄 Girando...';
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    isSpinning = true;
    updateDebugInfo(`Girando hacia: ${targetNumber}`);
    console.log('Iniciando giro hacia el número:', targetNumber);

    // Resetear posición
    wheel.style.transition = 'none';
    wheel.style.transform = 'translateY(0px)';

    // Forzar reflow
    wheel.offsetHeight;

    const slotHeight = 44; // h-11 = 44px
    const carruselHeight = document.getElementById('carrusel').offsetHeight;
    const centerPosition = carruselHeight / 2;

    let finalDistance;
    let winningNumber;

    if (targetNumber !== null && targetNumber !== undefined) {
        // Buscar el índice del número objetivo
        const targetIndex = rouletteNumbers.findIndex(num => num.num === targetNumber.toString());

        if (targetIndex === -1) {
            console.error(`Número ${targetNumber} no encontrado en la ruleta`);
            isSpinning = false;
            updateDebugInfo('Error: número no encontrado');
            // Rehabilitar botón
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🎰 GIRAR RULETA';
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            return;
        }

        winningNumber = rouletteNumbers[targetIndex];

        // Calcular la distancia para que el número objetivo quede en el centro
        const totalCycles = 7; // Número de vueltas completas
        const baseCycleDistance = rouletteNumbers.length * slotHeight * totalCycles;

        // Posición donde debe quedar el número objetivo (centrado)
        const targetSlotPosition = targetIndex * slotHeight;

        // Calcular distancia final para centrar el número objetivo
        finalDistance = baseCycleDistance + targetSlotPosition - (centerPosition - slotHeight/2);

    } else {
        // Comportamiento aleatorio original
        const totalSlots = rouletteNumbers.length * 7;
        const randomOffset = Math.floor(Math.random() * rouletteNumbers.length) * slotHeight;
        finalDistance = (totalSlots * slotHeight) - randomOffset;

        // Calcular número ganador para modo aleatorio
        const finalPosition = finalDistance % (rouletteNumbers.length * slotHeight);
        const winningIndex = Math.floor(finalPosition / slotHeight) % rouletteNumbers.length;
        winningNumber = rouletteNumbers[winningIndex];
    }

    console.log(`Girando hacia: ${targetNumber}, Distancia: ${finalDistance}px`);

    // Aplicar animación con easing personalizado usando Tailwind
    wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    wheel.style.transform = `translateY(-${finalDistance}px)`;

    // Cuando termine la animación
    setTimeout(() => {
        isSpinning = false;

        console.log(`Número ganador: ${winningNumber.num} (${winningNumber.color})`);
        updateDebugInfo(`Ganador: ${winningNumber.num} (${winningNumber.color})`);

        // Rehabilitar botón
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🎰 GIRAR RULETA';
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // Disparar evento personalizado con el resultado
        const event = new CustomEvent('rouletteResult', {
            detail: {
                number: winningNumber.num,
                color: winningNumber.color,
                wasTargeted: targetNumber !== null && targetNumber !== undefined
            }
        });
        document.dispatchEvent(event);

    }, 5000);
}

/**
 * Función para girar la ruleta de forma manual (botón)
 */
function girarRuletaManual() {
    const numeroAleatorio = Math.floor(Math.random() * 37);
    console.log("Giro manual hacia el número:", numeroAleatorio);
    girarHasta(numeroAleatorio);
}

// Hacer la función disponible globalmente
window.girarRuletaManual = girarRuletaManual;

// Función para actualizar información de debug
function updateDebugInfo(message) {
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
        debugElement.textContent = message;
    }
}

// Función para verificar si está girando
function isRouletteSpinning() {
    return isSpinning;
}

// Exportar funciones para uso global
window.rouletteAnimation = {
    init: initializeRoulette,
    spin: girarHasta, // Mantener el nombre original para compatibilidad
    isSpinning: isRouletteSpinning
};

// ======== LLAMADA AUTOMÁTICA AL CARGAR LA PÁGINA =========
window.addEventListener("load", () => {
    console.log('Página cargada, inicializando ruleta...');

    // Inicializar la nueva ruleta
    initializeRoulette();

    // Simular número del backend y girar
    const numeroDelBack = Math.floor(Math.random() * 37);
    console.log("Número del backend:", numeroDelBack);

    // Pequeño delay para asegurar que la ruleta esté inicializada
    setTimeout(() => {
        girarHasta(numeroDelBack);
    }, 1000);
});

async function actualizarDinero() {
    try {
        // Cambia esta URL por tu endpoint real
        const response = await fetch('http://localhost:8000/saldo');
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const { saldo } = await response.json();

        // Suponiendo que el backend devuelve { dinero: 1300.45 }
        const dinero = parseFloat(saldo).toFixed(2); // Forzamos dos decimales
        const h2 = document.getElementById('dinero');
        h2.textContent = `${dinero} $$`;

    } catch (err) {
        console.error('No se pudo actualizar el dinero:', err);
        // Mostrar valor por defecto si falla la conexión
        const h2 = document.getElementById('dinero');
        if (h2.textContent === 'test') {
            h2.textContent = '1000.00 $$';
        }
    }
}

// Llamamos a la función al cargar la página
window.addEventListener('DOMContentLoaded', actualizarDinero);

// Event listener para escuchar resultados de la ruleta
document.addEventListener('rouletteResult', (event) => {
    const { number, color, wasTargeted } = event.detail;
    console.log(`🎯 Resultado de la ruleta:`);
    console.log(`   Número: ${number}`);
    console.log(`   Color: ${color}`);
    console.log(`   Predeterminado: ${wasTargeted ? 'Sí' : 'No'}`);

    // Aquí puedes agregar lógica adicional cuando termine la ruleta
    // Por ejemplo: actualizar puntuaciones, mostrar animaciones, etc.
});