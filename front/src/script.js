// src/grid.js
const authCtx = {
  username: undefined,
  token: undefined,
};

// ============ CONFIGURACIÓN DE APUESTAS ============
const BET_AMOUNT = 100; // Cantidad fija de apuesta
const BACKEND_URL = 'http://localhost:8000'; // URL del backend
let apuestasActuales = []; // Array de todas las apuestas realizadas
const apuestasToSend = {}
let saldoActual = 0; // Saldo actual del jugador

// Mapeo de tipos de apuesta a valores numéricos para el backend
const APUESTA_VALORES = {
    'docena-1': 37,
    'docena-2': 38,
    'docena-3': 39,
    'mitad-baja': 40,
    'paridad-par': 41,
    'color-rojo': 42,
    'color-negro': 43,
    'paridad-impar': 44,
    'mitad-alta': 45
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    const response = await fetch(
        `${BACKEND_URL}/auth/check/${token}`,
        {
            method: 'GET',
        }
    );
    if (!response.ok) {
        throw new Error("Errar al realizar una petición")
    }

    const data = await response.json();
    if (!data["status"]) {
        window.location.href = "/login.html";
        return;
    }
    authCtx.token = token;

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
                cursor-pointer relative
            `;

            // Alternancia de degradado por impar/par
            if (numero % 2 === 0) {
                div.classList.add('bg-gradient-to-b', 'from-gray-700', 'to-gray-900');
                div.classList.remove('from-red-600', 'to-orange-500');
            }

            div.textContent = numero;
            div.setAttribute('data-number', numero);
            div.setAttribute('data-bet-type', 'numero');
            div.setAttribute('data-bet-value', numero);

            // Agregar event listeners
            div.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Clicked on number: ${numero}`);
                if (!isSpinning) {
                    agregarApuesta(numero, div);
                }
            });

            // Click derecho para quitar apuesta
            div.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!isSpinning) {
                    quitarApuesta(numero, div);
                }
            });

            grid.appendChild(div);
            numero++;
        }
    }

    console.log(`Grid generado con ${numero - 1} números`);

    // Inicializar listeners para apuestas especiales
    initializeBetListeners();

    await actualizarDinero();
});

// ============ SISTEMA DE APUESTAS ============

/**
 * Inicializa los event listeners para todas las casillas de apuesta
 */
function initializeBetListeners() {
    // Obtener todas las casillas con data-bet-type
    const betElements = document.querySelectorAll('[data-bet-type]');

    betElements.forEach(element => {
        // Si ya es un número del grid, ya tiene listener
        if (element.hasAttribute('data-number')) {
            return;
        }

        const betType = element.getAttribute('data-bet-type');
        const betValue = element.getAttribute('data-bet-value');
        const betKey = `${betType}-${betValue}`;

        // Click izquierdo para agregar apuesta
        element.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isSpinning) {
                agregarApuesta(betKey, element);
            }
        });

        // Click derecho para quitar apuesta
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!isSpinning) {
                quitarApuesta(betKey, element);
            }
        });
    });

    console.log('Listeners de apuestas inicializados');
}

/**
 * Agrega una ficha de apuesta visual y la registra
 */
function agregarApuesta(valorApuesta, elemento) {
    // Verificar si hay suficiente saldo
    if (saldoActual < BET_AMOUNT) {
        mostrarNotificacion('error', '¡Saldo insuficiente!');
        return;
    }

    // Convertir el valor de apuesta al formato para backend
    let valorBackend;
    if (typeof valorApuesta === 'number' || !isNaN(Number(valorApuesta))) {
        // Es un número del 0-36
        valorBackend = Number(valorApuesta);
    } else {
        // Es una apuesta especial
        valorBackend = APUESTA_VALORES[valorApuesta];
        if (valorBackend === undefined) {
            console.error('Tipo de apuesta no reconocido:', valorApuesta);
            return;
        }
    }

    // Agregar la apuesta al array
    apuestasActuales.push(valorBackend);
    if (!(valorBackend in apuestasToSend)) {
        apuestasToSend[valorBackend] = 0;
    }
    apuestasToSend[valorBackend] += BET_AMOUNT;

    // Actualizar saldo local
    saldoActual -= BET_AMOUNT;
    actualizarSaldoVisual();

    // Crear o actualizar la ficha visual
    crearFichaVisual(elemento, valorApuesta);

    console.log('Apuesta agregada:', valorBackend);
    console.log('Total apuestas:', apuestasActuales);
}

/**
 * Quita una apuesta (click derecho)
 */
function quitarApuesta(valorApuesta, elemento) {
    // Convertir el valor de apuesta al formato para backend
    let valorBackend;
    if (typeof valorApuesta === 'number' || !isNaN(Number(valorApuesta))) {
        valorBackend = Number(valorApuesta);
    } else {
        valorBackend = APUESTA_VALORES[valorApuesta];
        if (valorBackend === undefined) return;
    }
    if (valorBackend in apuestasToSend) {
        apuestasToSend[valorBackend] -= BET_AMOUNT;
        if (apuestasToSend[valorBackend] < 0) {
            delete apuestasToSend[valorBackend];
        }
    }

    // Buscar y eliminar una instancia de esta apuesta
    const index = apuestasActuales.indexOf(valorBackend);
    if (index === -1) {
        console.log('No hay apuestas para quitar en esta posición');
        return;
    }

    // Quitar la apuesta del array
    apuestasActuales.splice(index, 1);

    // Devolver el dinero al saldo
    saldoActual += BET_AMOUNT;
    actualizarSaldoVisual();

    // Actualizar la ficha visual
    actualizarFichaVisual(elemento, valorApuesta);

    console.log('Apuesta quitada:', valorBackend);
    console.log('Total apuestas:', apuestasActuales);
}

/**
 * Crea o actualiza la ficha visual en el elemento
 */
function crearFichaVisual(elemento, valorApuesta) {
    // Hacer que el elemento sea relativo para posicionar la ficha
    if (!elemento.style.position) {
        elemento.style.position = 'relative';
    }

    // Buscar si ya existe una ficha
    let ficha = elemento.querySelector('.ficha-apuesta');

    if (!ficha) {
        // Crear nueva ficha
        ficha = document.createElement('div');
        ficha.className = 'ficha-apuesta absolute top-1 right-1 bg-red-600 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white font-bold text-xs sm:text-sm border-2 border-white shadow-lg z-50 pointer-events-none';
        ficha.setAttribute('data-count', '1');
        ficha.textContent = '100';
        elemento.appendChild(ficha);
    } else {
        // Actualizar contador
        let count = parseInt(ficha.getAttribute('data-count') || '0');
        count++;
        ficha.setAttribute('data-count', count);
        ficha.textContent = count > 1 ? `${count}x` : '100';
    }
}

/**
 * Actualiza la ficha visual cuando se quita una apuesta
 */
function actualizarFichaVisual(elemento, valorApuesta) {
    const ficha = elemento.querySelector('.ficha-apuesta');
    if (!ficha) return;

    let count = parseInt(ficha.getAttribute('data-count') || '0');
    count--;

    if (count <= 0) {
        // Eliminar la ficha
        ficha.remove();
    } else {
        // Actualizar el contador
        ficha.setAttribute('data-count', count);
        ficha.textContent = count > 1 ? `${count}x` : '100';
    }
}

/**
 * Actualiza el saldo visual en la interfaz
 */
function actualizarSaldoVisual() {
    const h2 = document.getElementById('dinero');
    if (h2) {
        h2.textContent = `${saldoActual.toFixed(2)} €`;
    }
}

/**
 * Limpia todas las fichas visuales
 */
function limpiarTodasLasFichas() {
    const fichas = document.querySelectorAll('.ficha-apuesta');
    fichas.forEach(ficha => ficha.remove());
}

/**
 * Muestra una notificación al usuario
 */
function mostrarNotificacion(tipo, mensaje) {
    const notification = document.getElementById('bet-notification');
    if (!notification) return;

    // Establecer colores según el tipo
    let bgColor = tipo === 'success' ? 'bg-green-600' : 'bg-red-600';

    notification.className = `fixed top-20 right-2 sm:right-8 w-64 p-4 rounded-lg shadow-lg
                             transform transition-transform duration-300 z-50 ${bgColor} text-white`;
    notification.textContent = mensaje;

    // Mostrar
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
    }, 3000);
}

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

        // Enviar resultado al backend si hay apuestas activas
        if (apuestasActuales.length > 0) {
            //enviarResultado(winningNumber.num, winningNumber.color);
        }

    }, 5000);
}

/**
 * Envía el resultado de la ruleta al backend con todas las apuestas
 */
async function enviarResultado(numero, color) {
    try {
        const response = await fetch(`${BACKEND_URL}/resultado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numero: numero,
                color: color,
                apuestas: apuestasActuales
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar resultado');
        }

        const resultado = await response.json();
        console.log('Resultado procesado:', resultado);

        // Mostrar si ganó o perdió
        if (resultado.gano) {
            mostrarNotificacion('success', `¡GANASTE! +${resultado.ganancia}€`);
        } else {
            mostrarNotificacion('error', `Perdiste -${resultado.perdida}€`);
        }

        // Actualizar saldo desde el backend
        await actualizarDinero();

        // Limpiar apuestas y fichas
        apuestasActuales = [];
        limpiarTodasLasFichas();

    } catch (error) {
        console.error('Error al enviar resultado:', error);
        mostrarNotificacion('error', 'Error al procesar resultado');
    }
}

/**
 * Función para girar la ruleta de forma manual (botón)
 */
function girarRuletaManual() {
    if (apuestasActuales.length === 0) {
        mostrarNotificacion('error', 'Debes realizar al menos una apuesta primero');
        return;
    }

    // Solicitar al backend que genere un número aleatorio y gire
    fetch(`${BACKEND_URL}/ruleta/girar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-token': authCtx.token
        },
        body: JSON.stringify(apuestasToSend)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Número del backend:", data.numero);
            girarHasta(data.numero);
            saldoActual = data.saldo
        })
        .catch(error => {
            console.error('Error al obtener número del backend:', error);
            // Fallback: generar número localmente
            const numeroAleatorio = Math.floor(Math.random() * 37);
            console.log("Giro manual (fallback) hacia el número:", numeroAleatorio);
            girarHasta(numeroAleatorio);
        });
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
    spin: girarHasta,
    isSpinning: isRouletteSpinning
};

// ======== LLAMADA AUTOMÁTICA AL CARGAR LA PÁGINA =========
window.addEventListener("load", () => {
    console.log('Página cargada, inicializando ruleta...');

    // Inicializar la nueva ruleta
    initializeRoulette();
});

async function actualizarDinero() {
    try {
        const response = await fetch(
            `${BACKEND_URL}/ruleta/saldo`,
            {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': true,
                    'x-api-token': authCtx.token
                }
            }
        );
        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const { saldo } = await response.json();

        // Actualizar saldo global
        saldoActual = parseFloat(saldo);

        // Actualizar UI
        const dinero = saldoActual.toFixed(2);
        const h2 = document.getElementById('dinero');
        h2.textContent = `${dinero} €`;

    } catch (err) {
        console.error('No se pudo actualizar el dinero:', err);
        // Mostrar valor por defecto si falla la conexión
        const h2 = document.getElementById('dinero');
        if (h2.textContent === 'test') {
            h2.textContent = `${saldoActual} €`;
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
});
