from flask import Blueprint, request, jsonify
from models import db, Item  # Asegúrate de importar db y Item desde models.py

api_routes = Blueprint('api_routes', __name__)

# Ruta para obtener todos los items
@api_routes.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()  # Consulta todos los items en la base de datos
    return jsonify([item.to_dict() for item in items])

# Ruta para crear un nuevo item
@api_routes.route('/api/items', methods=['POST'])
def create_item():
    data = request.get_json()  # Obtiene los datos del cuerpo de la solicitud
    item = Item(nombre=data['nombre'], descripcion=data.get('descripcion', ''))
    db.session.add(item)
    db.session.commit()  # Guarda el nuevo item en la base de datos
    return jsonify(item.to_dict()), 201

# Ruta para actualizar un item existente
@api_routes.route('/api/items/<int:id>', methods=['PUT'])
def update_item(id):
    item = Item.query.get_or_404(id)  # Busca el item por su ID, si no lo encuentra, devuelve un error 404
    data = request.get_json()  # Obtiene los datos para actualizar
    item.nombre = data.get('nombre', item.nombre)
    item.descripcion = data.get('descripcion', item.descripcion)
    db.session.commit()  # Guarda los cambios
    return jsonify(item.to_dict())  # Devuelve el item actualizado

# Ruta para eliminar un item
@api_routes.route('/api/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    item = Item.query.get_or_404(id)  # Busca el item por su ID
    db.session.delete(item)  # Elimina el item de la base de datos
    db.session.commit()  # Guarda los cambios
    return '', 204  # Responde con un código 204 (sin contenido) para indicar que la eliminación fue exitosa
