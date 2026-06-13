const colores = ['azul', 'amarillo', 'verde', 'morado', 'naranja', 'rojo'];
const selector = document.getElementById('dice-selector');

const estadisticas = {
    azul: 0,
    amarillo: 0,
    verde: 0,
    morado: 0,
    naranja: 0,
    rojo: 0
};

// Función para generar un sonido de dados/retro usando la tarjeta de sonido del navegador
function reproducirSonidoDados() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Creamos un oscilador (el que hace el pitido)
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Tipo de onda retro (ruido de juego de consola vieja)
        oscillator.type = 'triangle'; 
        
        // Hace que el sonido empiece agudo y caiga rápido (efecto de choque/caída)
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        
        // Controlamos el volumen para que disminuya hasta apagarse
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3); // Dura menos de medio segundo, perfecto para ráfagas
    } catch (e) {
        console.log("Audio no soportado o bloqueado por el navegador aún.");
    }
}

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
    button.textContent = 'Rolling!';

    // --- REPRODUCIR SONIDO GENERADO ---
    reproducirSonidoDados();
    // Hacemos un segundo sonido rápido en medio del giro para dar más impacto
    setTimeout(() => { reproducirSonidoDados(); }, 300);

    let tiempoRestante = 1; 

    for (let i = 1; i <= cantidadDadosActivos; i++) {
        const statusElement = document.getElementById(`status-${i}`);
        statusElement.textContent = `ROLLING... ${tiempoRestante}s`;
        statusElement.classList.add('active');
        
        document.getElementById(`dice-${i}`).classList.add('spinning');
    }

    const fiestaColores = setInterval(() => {
        for (let i = 1; i <= cantidadDadosActivos; i++) {
            const diceElement = document.getElementById(`dice-${i}`);
            const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
            diceElement.className = 'dice spinning ' + colorAleatorio;
        }
    }, 70);

    const cuentaRegresiva = setInterval(() => {
        tiempoRestante--;
        
        if (tiempoRestante > 0) {
            for (let i = 1; i <= cantidadDadosActivos; i++) {
                document.getElementById(`status-${i}`).textContent = `ROLLING... ${tiempoRestante}s`;
            }
        } else {
            clearInterval(cuentaRegresiva);
            clearInterval(fiestaColores);

            // Sonido final justo al detenerse los dados
            reproducirSonidoDados();

            for (let i = 1; i <= cantidadDadosActivos; i++) {
                const diceElement = document.getElementById(`dice-${i}`);
                
                diceElement.classList.remove('spinning');
                document.getElementById(`status-${i}`).classList.remove('active');
                
                const colorFinal = colores[Math.floor(Math.random() * colores.length)];
                diceElement.className = 'dice ' + colorFinal;
                
                estadisticas[colorFinal]++;
                document.getElementById(`count-${colorFinal}`).textContent = estadisticas[colorFinal];
                
                diceElement.style.transform = 'scale(1.12)';
                setTimeout(() => { diceElement.style.transform = 'scale(1)'; }, 150);
            }

            button.disabled = false;
            selector.disabled = false;
            button.textContent = 'Roll Dice';
        }
    }, 1000); 
});

actualizarCantidadDados();
