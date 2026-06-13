const colores = ['azul', 'amarillo', 'verde', 'morado', 'naranja', 'rojo'];
const selector = document.getElementById('dice-selector');

// Objeto para guardar el conteo total de cada color
const estadisticas = {
    azul: 0,
    amarillo: 0,
    verde: 0,
    morado: 0,
    naranja: 0,
    rojo: 0
};

function actualizarCantidadDados() {
    const cantidadSelect = parseInt(selector.value);
    for (let i = 1; i <= 4; i++) {
        const wrapper = document.getElementById(`wrapper-${i}`);
        if (i <= cantidadSelect) {
            wrapper.classList.remove('hidden');
        } else {
            wrapper.classList.add('hidden');
        }
    }
}

selector.addEventListener('change', actualizarCantidadDados);

document.getElementById('roll-btn').addEventListener('click', function() {
    const button = document.getElementById('roll-btn');
    const cantidadDadosActivos = parseInt(selector.value);
    
    button.disabled = true;
    selector.disabled = true;
    button.textContent = '¡Girando!';

    let tiempoRestante = 2; // Sazón calibrado a 2 segundos

    // 1. Iniciamos los textos y la animación en los dados activos
    for (let i = 1; i <= cantidadDadosActivos; i++) {
        const statusElement = document.getElementById(`status-${i}`);
        statusElement.textContent = `ROLLING... ${tiempoRestante}s`;
        statusElement.classList.add('active');
        
        document.getElementById(`dice-${i}`).classList.add('spinning');
    }

    // 2. Fiesta rápida de colores cada 70ms mientras gira
    const fiestaColores = setInterval(() => {
        for (let i = 1; i <= cantidadDadosActivos; i++) {
            const diceElement = document.getElementById(`dice-${i}`);
            const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
            diceElement.className = 'dice spinning ' + colorAleatorio;
        }
    }, 70);

    // 3. Cuenta regresiva que corre segundo a segundo
    const cuentaRegresiva = setInterval(() => {
        tiempoRestante--;
        
        if (tiempoRestante > 0) {
            for (let i = 1; i <= cantidadDadosActivos; i++) {
                document.getElementById(`status-${i}`).textContent = `ROLLING... ${tiempoRestante}s`;
            }
        } else {
            // Cuando llega a 0 (a los 2 segundos exactos) se detiene todo
            clearInterval(cuentaRegresiva);
            clearInterval(fiestaColores);

            // 4. Frenazo en seco y guardado de estadísticas
            for (let i = 1; i <= cantidadDadosActivos; i++) {
                const diceElement = document.getElementById(`dice-${i}`);
                
                diceElement.classList.remove('spinning');
                document.getElementById(`status-${i}`).classList.remove('active');
                
                const colorFinal = colores[Math.floor(Math.random() * colores.length)];
                diceElement.className = 'dice ' + colorFinal;
                
                // Sumamos al contador del juego
                estadisticas[colorFinal]++;
                document.getElementById(`count-${colorFinal}`).textContent = estadisticas[colorFinal];
                
                // Pequeño efecto de impacto visual al caer
                diceElement.style.transform = 'scale(1.12)';
                setTimeout(() => { diceElement.style.transform = 'scale(1)'; }, 150);
            }

            button.disabled = false;
            selector.disabled = false;
            button.textContent = 'Tirar Dados';
        }
    }, 1000);
});

actualizarCantidadDados();
