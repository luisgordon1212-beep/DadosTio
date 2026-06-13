const colores = ['azul', 'amarillo', 'verde', 'morado', 'naranja', 'rojo'];
const selector = document.getElementById('dice-selector');
const achievementBox = document.getElementById('achievement-box');

const estadisticas = {
    azul: 0,
    amarillo: 0,
    verde: 0,
    morado: 0,
    naranja: 0,
    rojo: 0
};

const sonidoDadosReales = new Audio('dados.mp3');

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
    
    // Reseteamos el texto de logros mientras gira
    achievementBox.textContent = "Good Luck...";
    achievementBox.style.color = "#aaa";
    achievementBox.style.textShadow = "none";
    achievementBox.classList.remove('achievement-pop');

    sonidoDadosReales.currentTime = 0; 
    sonidoDadosReales.play().catch(error => {
        console.log("Audio play blocked");
    });

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

            // Guardamos los colores que salieron en esta tirada específica para analizarlos
            let coloresObtenidos = [];

            for (let i = 1; i <= cantidadDadosActivos; i++) {
                const diceElement = document.getElementById(`dice-${i}`);
                
                diceElement.classList.remove('spinning');
                document.getElementById(`status-${i}`).classList.remove('active');
                
                const colorFinal = colores[Math.floor(Math.random() * colores.length)];
                diceElement.className = 'dice ' + colorFinal;
                
                coloresObtenidos.push(colorFinal); // Guardamos para el logro
                
                estadisticas[colorFinal]++;
                document.getElementById(`count-${colorFinal}`).textContent = estadisticas[colorFinal];
                
                diceElement.style.transform = 'scale(1.12)';
                setTimeout(() => { diceElement.style.transform = 'scale(1)'; }, 150);
            }

            // --- LÓGICA DE DETECCIÓN DE LOGROS ---
            // Contamos las repeticiones de cada color en esta tirada
            let conteoTirada = {};
            coloresObtenidos.forEach(c => { conteoTirada[c] = (conteoTirada[c] || 0) + 1; });
            
            let maxRepetidos = Math.max(...Object.values(conteoTirada));
            let coloresDiferentes = Object.keys(conteoTirada).length;

            // Decidimos qué logro mostrar
            let textoLogro = "Just Ordinary... 🎲";
            let colorLogro = "#e74c3c"; // Rojo para tiradas comunes
            let glowLogro = "rgba(231, 76, 60, 0.5)";

            if (cantidadDadosActivos === 4 && coloresDiferentes === 4) {
                textoLogro = "Perfect Rainbow! 🌈";
                colorLogro = "#3498db";
                glowLogro = "rgba(52, 152, 219, 0.8)";
            } else if (maxRepetidos === 4) {
                textoLogro = "Quadruple Threat! 👑";
                colorLogro = "#f1c40f"; // Dorado neón
                glowLogro = "rgba(241, 196, 15, 0.9)";
            } else if (maxRepetidos === 3) {
                textoLogro = "Triple Luck! 🔥";
                colorLogro = "#e67e22"; // Naranja fuego
                glowLogro = "rgba(230, 126, 34, 0.8)";
            } else if (maxRepetidos === 2) {
                textoLogro = "Lucky Pair! 🍀";
                colorLogro = "#2ecc71"; // Verde suerte
                glowLogro = "rgba(46, 204, 113, 0.8)";
            }

            // Si solo se tira 1 dado, no hay combos disponibles
            if (cantidadDadosActivos === 1) {
                textoLogro = "Single Roll! 🎯";
                colorLogro = "#9b59b6";
                glowLogro = "rgba(155, 89, 182, 0.6)";
            }

            // Aplicamos el logro en la interfaz con animación
            achievementBox.textContent = textoLogro;
            achievementBox.style.color = colorLogro;
            achievementBox.style.textShadow = `0 0 12px ${glowLogro}`;
            achievementBox.classList.add('achievement-pop');

            button.disabled = false;
            selector.disabled = false;
            button.textContent = 'Roll Dice';
        }
    }, 1000); 
});

actualizarCantidadDados();

function dispararEfectoEspecial() {
    const contenedor = document.querySelector('.game-container');
    const cuerpo = document.body;

    contenedor.classList.add('shake-efecto');
    cuerpo.classList.add('flash-efecto');

    setTimeout(() => { contenedor.classList.remove('shake-efecto'); }, 300);
    setTimeout(() => { cuerpo.classList.remove('flash-efecto'); }, 400);
}
