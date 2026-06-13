// Lista completa de tus colores
const colores = ['azul', 'amarillo', 'verde', 'morado', 'naranja', 'rojo'];

document.getElementById('roll-btn').addEventListener('click', function() {
    const button = document.getElementById('roll-btn');
    let tiempoRestante = 3; // Segundos de delay
    
    // 1. Desactivamos el botón para que no puedan darle clic repetidamente
    button.disabled = true;
    button.textContent = `Esperando... ${tiempoRestante}s`;
    
    // 2. Iniciamos el contador que baja segundo a segundo
    const contador = setInterval(() => {
        tiempoRestante--;
        
        if (tiempoRestante > 0) {
            button.textContent = `Esperando... ${tiempoRestante}s`;
        } else {
            // Cuando llega a 0, detenemos el contador
            clearInterval(contador);
            
            // 3. ¡Aquí es donde los dados finalmente giran!
            lanzarDados();
            
            // 4. Reactivamos el botón para la siguiente tirada
            button.disabled = false;
            button.textContent = 'Tirar Dados';
        }
    }, 1000); // Se ejecuta cada 1 segundo (1000 milisegundos)
});

// Movemos la lógica de los dados a su propia función para ordenarla mejor
function lanzarDados() {
    for (let i = 1; i <= 4; i++) {
        const diceElement = document.getElementById(`dice-${i}`);
        
        // Generamos números aleatorios del 1 al 6
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        diceElement.textContent = randomNumber;
        
        // Elegimos el color al azar
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        
        // Cambiamos la clase para aplicar el color
        diceElement.className = 'dice ' + colorAleatorio;
        
        // Efecto visual de salto al detenerse
        diceElement.style.transform = 'scale(1.08)';
        setTimeout(() => {
            diceElement.style.transform = 'scale(1)';
        }, 150);
    }
}
