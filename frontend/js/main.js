let tareas = [];

// Manejador del formulario
document.getElementById("form-tarea").addEventListener("submit", function(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const prioridad = document.getElementById("prioridad").value;
    const fecha = document.getElementById("fecha").value;

    const nuevaTarea = {
        nombre: titulo,
        descripcion: prioridad, // Asumí que "prioridad" es la descripción de la tarea
    };

    // Crear la tarea en el backend
    fetch('http://127.0.0.1:5000/api/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaTarea),
    })
    .then(response => response.json())
    .then(data => {
        tareas.push(data);
        renderTareas();
        this.reset(); // Limpiar el formulario
    })
    .catch(error => console.error('Error:', error));
});

// Función para obtener las tareas desde el backend
function obtenerTareas() {
    fetch('http://127.0.0.1:5000/api/items') // Asegúrate de que la URL es correcta
        .then(response => response.json())
        .then(data => {
            tareas = data;
            renderTareas();
        })
        .catch(error => console.error('Error:', error));
}

// Función para renderizar las tareas
function renderTareas() {
    const tbody = document.getElementById("tareas-body");
    tbody.innerHTML = ""; // Limpiar las tareas previas

    tareas.forEach(tarea => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${tarea.nombre}</td>
            <td>${tarea.descripcion}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarTarea(${tarea.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Función para eliminar una tarea
function eliminarTarea(id) {
    fetch(`http://127.0.0.1:5000/api/items/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        tareas = tareas.filter(tarea => tarea.id !== id);
        renderTareas();
    })
    .catch(error => console.error('Error:', error));
}

// Función para editar una tarea
function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        document.getElementById("titulo").value = tarea.nombre;
        document.getElementById("prioridad").value = tarea.descripcion;

        // Cuando se edite, la acción de submit actualizará la tarea
        document.getElementById("form-tarea").addEventListener("submit", function(e) {
            e.preventDefault();

            const updatedTarea = {
                nombre: document.getElementById("titulo").value,
                descripcion: document.getElementById("prioridad").value,
            };

            // Enviar la actualización al backend
            fetch(`http://127.0.0.1:5000/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTarea),
            })
            .then(response => response.json())
            .then(data => {
                tareas = tareas.map(t => (t.id === id ? data : t));
                renderTareas();
            })
            .catch(error => console.error('Error:', error));
        });
    }
}

// Obtener las tareas al cargar la página
document.addEventListener("DOMContentLoaded", obtenerTareas);
