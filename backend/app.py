from flask import Flask, render_template
from config import Config
from models import db
from routes import api_routes
from flask_cors import CORS

# Inicializar la aplicación Flask
app = Flask(__name__)
app.config.from_object(Config)

# Habilitar CORS para todas las rutas
CORS(app)

# Inicializa la base de datos con la app
db.init_app(app)

# Registra las rutas del blueprint (API)
app.register_blueprint(api_routes)

# Ruta principal (opcional)
@app.route('/')
def index():
    return render_template('index.html')  # Asegúrate de que el archivo index.html está en la carpeta 'templates'

# Crea las tablas si no existen
with app.app_context():
    db.create_all()  # Asegúrate de que las tablas están creadas (esto solo debe ejecutarse en desarrollo)

# Ejecuta la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)
