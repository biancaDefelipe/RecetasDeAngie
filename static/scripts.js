document.addEventListener('DOMContentLoaded', function() {
    console.log('El script se cargó correctamente');
});

// Cargar recetas desde un archivo JSON
fetch('/static/data/recetas.json')
    .then(response => response.json())
    .then(data => {
        const recetas = data.recetas;
        const recetasContainer = document.getElementById('recetas-container');

        // Función para renderizar recetas según la categoría seleccionada
        function renderRecetas(filtroCategoria = 'all') {
            
            recetasContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar
            
            recetas.forEach(receta => {
                const perteneceCategoria = filtroCategoria === 'all' || receta.categoria.includes(filtroCategoria);

                if (perteneceCategoria) {
                    const recetaDiv = document.createElement('div');
                    recetaDiv.className = 'receta';
                    recetaDiv.setAttribute('data-receta', receta.id);
                    recetaDiv.setAttribute('id', `receta-${receta.id}`); // Añadir ID único para cada receta

                    // Crear un atributo con los nombres de ingredientes para la búsqueda
                    const ingredientesTexto = receta.ingredientes.map(ing => ing.nombre.toLowerCase()).join(' ');
                    recetaDiv.setAttribute('data-ingredientes', ingredientesTexto);

                    recetaDiv.innerHTML = `
                        <h3>${receta.titulo}</h3>
                        <p><img src="/static/img/icon.png" class="img-icon">Ver Receta Completa.</p>
                    `;

                    recetasContainer.appendChild(recetaDiv);

                    // Añadir evento de clic para mostrar el modal con los detalles de la receta
                    recetaDiv.addEventListener('click', () => {
                        document.getElementById('receta-titulo').innerText = receta.titulo;

                        // Mostrar ingredientes con cantidades
                        const ingredientesLista = receta.ingredientes.map(ing => `<li>${ing.cantidad} de ${ing.nombre}</li>`).join('');
                        document.getElementById('ingredientes-lista').innerHTML = ingredientesLista;

                        document.getElementById('instrucciones').innerText = receta.instrucciones;
                        document.getElementById('modal').style.display = 'block';

                                // Asignar evento de compartir
            document.getElementById('share-button').onclick = function() {
                // Generar un enlace a la página `receta.html` con el ID en la URL
                const recipePageUrl = `${window.location.origin}/static/receta.html?id=${receta.id}`;
                console.log('link ', recipePageUrl)
                console.log('windowlocation origin ', window.location.origin)
                // Copiar el enlace al portapapeles
                navigator.clipboard.writeText(recipePageUrl).then(() => {
                    document.getElementById('copied-message').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('copied-message').style.display = 'none';
                    }, 2000);
                });
            };


                    });
                }
            });
        }

        // Renderizar todas las recetas al cargar la página
        renderRecetas();

        // Añadir eventos a los botones de filtro
        document.querySelectorAll('.filter-buttons button').forEach(button => {
            button.addEventListener('click', () => {
                const categoria = button.getAttribute('data-category');
                renderRecetas(categoria);
            });
        });

        // Función de búsqueda
        document.getElementById('search').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const recetasDivs = document.querySelectorAll('.receta');

            recetasDivs.forEach(recetaDiv => {
                const nombre = recetaDiv.querySelector('h3').innerText.toLowerCase();
                const ingredientes = recetaDiv.getAttribute('data-ingredientes');

                if (nombre.includes(searchTerm) || ingredientes.includes(searchTerm)) {
                    recetaDiv.style.display = "block";
                } else {
                    recetaDiv.style.display = "none";
                }
            });
        });
    });

// Cerrar modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});

// Abrir nueva pestaña con mi git 
function abrirMiGit() {
    window.open("https://github.com/biancaDefelipe", "_blank");
}
