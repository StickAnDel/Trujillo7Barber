from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

mongo_uri = "mongodb+srv://projectSIML:V06yecZuBeDcoprF@cmonit.27oid4t.mongodb.net/?retryWrites=true&w=majority&appName=cMonit"
client = MongoClient(mongo_uri)
db = client['barber']
users_collection = db['usuarios']
reservas_collection = db['reservas']

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    role = data.get('role', 'client')
    disability = data.get('disability')

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'El usuario ya existe'}), 400

    users_collection.insert_one({
        'username': username,
        'password': password,
        'name': name,
        'phone': phone,
        'role': role,
        'disability': disability
    })

    return jsonify({'message': 'Usuario registrado exitosamente'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if not user or user['password'] != password:
        return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401

    return jsonify({'message': 'Inicio de sesión exitoso'})

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = list(users_collection.find({}, {'_id': 0}))
    return jsonify(usuarios)

@app.route('/reservas', methods=['POST'])
def crear_reserva():
    data = request.get_json()
    username = data.get('username')
    service_id = data.get('serviceId')
    service_name = data.get('serviceName')
    service_price = data.get('servicePrice')
    service_image = data.get('serviceImage')
    date = data.get('date')
    time = data.get('time')

    reservas_collection.insert_one({
        'username': username,
        'serviceId': service_id,
        'serviceName': service_name,
        'servicePrice': service_price,
        'serviceImage': service_image,
        'date': date,
        'time': time,
        'status': 'pending'
    })

    return jsonify({'message': 'Reserva registrada exitosamente'})

@app.route('/reservas', methods=['PUT'])
def obtener_reservas():
    data = request.get_json()
    username = data.get('username')
    reservas = list(reservas_collection.find({'username': username}, {'_id': 0}))
    return jsonify(reservas)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
