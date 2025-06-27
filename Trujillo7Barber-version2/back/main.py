from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

# Conexión a MongoDB (asegúrate de tener esta URL correcta)
client = MongoClient("mongodb+srv://projectSIML:V06yecZuBeDcoprF@cmonit.27oid4t.mongodb.net/barber?retryWrites=true&w=majority")
db = client['barber']
users_collection = db['usuarios']
reservas_collection = db['reservas']

# Ruta para registro de usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validación básica
    if not all(key in data for key in ['username', 'password', 'name', 'phone']):
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    if users_collection.find_one({'username': data['username']}):
        return jsonify({'error': 'El usuario ya existe'}), 400

    # Crear usuario con contraseña hasheada
    user_data = {
        'username': data['username'],
        'password': generate_password_hash(data['password']),
        'name': data['name'],
        'phone': data['phone'],
        'role': data.get('role', 'client'),
        'disability': data.get('disability')
    }

    users_collection.insert_one(user_data)
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

# Ruta para login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'username': data.get('username')})

    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Comparación de contraseñas (deberías usar check_password_hash en producción)
    if data.get('password') != user['password']:  # Esto es solo para desarrollo!
        return jsonify({'error': 'Contraseña incorrecta'}), 401

    return jsonify({
        'message': 'Login exitoso',
        'user': {
            'username': user['username'],
            'name': user['name'],
            'role': user.get('role', 'client')
        }
    })

# Ruta protegida solo para admin
@app.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    user_role = request.headers.get('X-User-Role')  # Debes enviar esto desde el frontend
    
    if user_role != 'admin':
        return jsonify({'error': 'Acceso no autorizado'}), 403

    return jsonify({'message': 'Bienvenido al panel de administrador'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
