document.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado correctamente');
    const botonesAlerta = document.querySelectorAll('.boton-alerta');
    botonesAlerta.forEach(boton => {
        boton.addEventListener('click', () => {
            alert('¡Haz hecho clic en un botón!');
        });
    });
});