
// Seleccionamos los elementos del HTML
const seleccionarLenguaje = document.getElementById("seleccionar-lenguaje");
const resultado = document.getElementById("resultado");
const botonActualizar = document.getElementById("boton-actualizar");


// Función para buscar repositorios en GitHub
async function buscarRepositorio() {

    // Obtenemos el lenguaje seleccionado
    const lenguaje = seleccionarLenguaje.value;

    // Comprobamos que se haya seleccionado un lenguaje
    if (lenguaje === "") {

        resultado.innerHTML = `
            <p id="mensaje-estado">
                Por favor, selecciona un lenguaje.
            </p>
        `;

        botonActualizar.hidden = true;
        return;
    }

    // Mostramos el mensaje de carga
    resultado.innerHTML = `
        <p id="mensaje-estado" class="cargando">
            Cargando, por favor espera...
        </p>
    `;

    botonActualizar.hidden = true;

    try {

        // Construimos la URL para consultar GitHub
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent("language:" + lenguaje)}&sort=stars&order=desc&per_page=100`;

        // Realizamos la solicitud a la API
        const respuesta = await fetch(url);

        // Comprobamos si la solicitud fue exitosa
        if (!respuesta.ok) {
            throw new Error("No fue posible obtener los repositorios.");
        }

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // Comprobamos si encontramos repositorios
        if (datos.items.length === 0) {
            throw new Error("No se encontraron repositorios.");
        }

        // Seleccionamos un repositorio aleatorio
        const posicionAleatoria = Math.floor(
            Math.random() * datos.items.length
        );

        const repositorio = datos.items[posicionAleatoria];

        // Limpiamos el resultado anterior
        resultado.innerHTML = "";

        // Creamos la tarjeta del repositorio
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-repositorio");

        // Creamos el nombre y el enlace del repositorio
        const nombre = document.createElement("h2");
        const enlace = document.createElement("a");

        enlace.href = repositorio.html_url;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = repositorio.full_name;

        nombre.appendChild(enlace);

        // Creamos la descripción del repositorio
        const descripcion = document.createElement("p");

        descripcion.textContent =
            repositorio.description || "Este repositorio no tiene descripción.";

        // Creamos la sección de estadísticas
        const informacion = document.createElement("div");
        informacion.classList.add("informacion-repositorio");

        informacion.innerHTML = `
            <span>⭐ ${repositorio.stargazers_count.toLocaleString("es-CO")}</span>
            <span>🍴 ${repositorio.forks_count.toLocaleString("es-CO")}</span>
            <span>❗ ${repositorio.open_issues_count.toLocaleString("es-CO")}</span>
        `;

        // Agregamos los elementos a la tarjeta
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(informacion);

        // Mostramos la tarjeta en pantalla
        resultado.appendChild(tarjeta);

        // Mostramos el botón para buscar otro repositorio
        botonActualizar.hidden = false;

    } catch (error) {

        // Mostramos el mensaje de error
        resultado.innerHTML = `
            <p id="mensaje-estado" class="error">
                ${error.message}
            </p>
        `;

        botonActualizar.hidden = false;

        console.error("Error al buscar repositorios:", error);
    }
}


// Detectamos cuando el usuario selecciona un lenguaje
seleccionarLenguaje.addEventListener("change", function () {
    buscarRepositorio();
});


// Buscamos otro repositorio cuando se presiona el botón
botonActualizar.addEventListener("click", function () {
    buscarRepositorio();
});
