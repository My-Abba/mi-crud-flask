let tareas = [];

// Manejador del formulario
document.getElementById("form-tarea").addEventListener("submit", function(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const prioridad = document.getElementById("prioridad").value;
    const fecha = document.getElementById("fecha").value;

    const nuevaTarea = {
        id: Date.now(),
        titulo,
        prioridad,
        fecha
    };

    tareas.push(nuevaTarea);
    renderTareas();
    this.reset();
});

function renderTareas() {
    const tbody = document.getElementById("tareas-body");
    tbody.innerHTML = "";

    tareas.forEach(tarea => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${tarea.titulo}</td>
            <td>${tarea.prioridad}</td>
            <td>${tarea.fecha}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarTarea(${tarea.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    renderTareas();
}

function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        document.getElementById("titulo").value = tarea.titulo;
        document.getElementById("prioridad").value = tarea.prioridad;
        document.getElementById("fecha").value = tarea.fecha;

        eliminarTarea(id);
    }
}
