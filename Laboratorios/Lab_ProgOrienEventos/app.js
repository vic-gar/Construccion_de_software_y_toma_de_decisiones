// Seleccionar elementos con getElementById()
const titulo = document.getElementById("titulo");
console.log(titulo);
console.log(titulo.textContent);

// Seleccionar elementos con querySelector()
const descripcion = document.querySelector("#descripcion");
console.log(descripcion.textContent);

// Seleccionar varios elementos con querySelectorAll()
const peliculas = document.querySelectorAll(".lista-peliculas li");

peliculas.forEach((pelicula) => {
  console.log(pelicula.textContent);
});

// Modificar contenido con textContent
titulo.textContent = "Práctica de JavaScript y DOM";

// Modificar estilos con style
titulo.style.color = "blue";
titulo.style.textAlign = "center";

descripcion.style.backgroundColor = "#f1f1f1";
descripcion.style.padding = "10px";
descripcion.style.borderRadius = "8px";

// Crear una lista dinámicamente con createElement()
const listaTecnologias = document.createElement("ul");

// Agregar la lista al body con appendChild()
document.body.appendChild(listaTecnologias);

// Crear elementos li dinámicamente
const elemento1 = document.createElement("li");
elemento1.textContent = "HTML";
listaTecnologias.appendChild(elemento1);

const elemento2 = document.createElement("li");
elemento2.textContent = "CSS";
listaTecnologias.appendChild(elemento2);

const elemento3 = document.createElement("li");
elemento3.textContent = "JavaScript";
listaTecnologias.appendChild(elemento3);

// Crear un botón dinámicamente
const boton = document.createElement("button");
boton.textContent = "Mostrar mensaje";
boton.setAttribute("id", "btnMensaje");

// Agregar el botón al body
document.body.appendChild(boton);

// Agregar evento click con addEventListener()
boton.addEventListener("click", () => {
  alert("Gracias por hacer click");

  descripcion.textContent = "El texto fue modificado después de presionar el botón.";
  descripcion.style.color = "green";
});