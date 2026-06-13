// Lista de colores permitidos
const colores = ['azul', 'amarillo', 'verde', 'morado', 'naranja', 'rojo'];

document.getElementById('roll-btn').addEventListener('click', function() {
    for (let i = 1; i <= 4; i++) {
        const diceElement = document.getElementById(`dice-${i}`);
        
        // En vez de poner el número aleatorio, ponemos un puntito centrado
        diceElement.textContent = '•';
        
        // Seguimos eligiendo el color de fondo al azar
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        
        // Aplicamos el nuevo color
        diceElement.className = 'dice ' + colorAleatorio;
        
        // Efecto visual de salto
        diceElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            diceElement.style.transform = 'scale(1)';
        }, 100);
    }
});
