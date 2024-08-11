"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/token', methods=['POST', 'GET'])
def create_token():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "Bad email or password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({'token': token, 'user': user.serialize()}), 200

@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    id_user = get_jwt_identity()
    user = User.query.get(id_user)
    user=user.serialize()
    return jsonify({ 'user': user })

@api.route('/register', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    # Verifica que el email y la contraseña no estén vacíos
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    # Verifica si el usuario ya existe
    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"msg": "User already exists"}), 400

    # Crea un nuevo usuario
    new_user = User(email=email, password=password, is_active=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to add user to the database", "error": str(e)}), 500

    # Serializa el usuario y crea un token de acceso
    user = new_user.serialize()
    token = create_access_token(identity=user['id'])

    return jsonify({'token': token, 'user': user}), 201




