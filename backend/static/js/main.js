let tareas = [];

// Manejador del formulario para crear o editar tarea
document.getElementById("form-tarea").addEventListener("submit", function(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const prioridad = document.getElementById("prioridad").value;
    const fecha = document.getElementById("fecha").value;

    const nuevaTarea = {
        nombre: titulo,
        descripcion: prioridad, // Puedes ajustar este campo si lo necesitas
        fecha_limite: fecha // Asumí que esta es una de las propiedades
    };

    // Verificar si estamos creando una nueva tarea o editando una existente
    if (this.dataset.editarId) {
        // Editando tarea existente
        const id = this.dataset.editarId;
        fetch(`http://127.0.0.1:5000/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaTarea),
        })
        .then(response => response.json())
        .then(data => {
            tareas = tareas.map(t => (t.id === id ? data : t)); // Actualiza la tarea
            renderTareas();
            this.reset(); // Limpiar formulario
            delete this.dataset.editarId; // Eliminar el dato de editar
        })
        .catch(error => console.error('Error al editar tarea:', error));
    } else {
        // Creando nueva tarea
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
            this.reset(); // Limpiar formulario
        })
        .catch(error => console.error('Error al crear tarea:', error));
    }
});

// Función para obtener las tareas desde el backend
function obtenerTareas() {
    fetch('http://127.0.0.1:5000/api/items')
        .then(response => response.json())
        .then(data => {
            tareas = data;
            renderTareas();
        })
        .catch(error => console.error('Error al obtener tareas:', error));
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
            <td>${tarea.fecha_limite}</td>
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
    .catch(error => console.error('Error al eliminar tarea:', error));
}

// Función para editar una tarea
function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        document.getElementById("titulo").value = tarea.nombre;
        document.getElementById("prioridad").value = tarea.descripcion;
        document.getElementById("fecha").value = tarea.fecha_limite;

        // Establece el ID de la tarea a editar en el formulario
        document.getElementById("form-tarea").dataset.editarId = tarea.id;
    }
}

// Obtener las tareas al cargar la página
document.addEventListener("DOMContentLoaded", obtenerTareas);
