from functools import wraps
from flask import request,jsonify
from Todo_App.utils.jwt_utils import verify_jwt
from Todo_App.models import User

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        auth_header = request.headers.get('Authorization',None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message':'Unauthorized'}),401
        
        token = auth_header.split(' ')[1]
        user_id = verify_jwt(token)
        if not user_id:
            return jsonify({"message": "Invalid or expired token"}),401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message':"User not found"}),404
        #Attach user to request context
        request.user = user 
        return f(*args,**kwargs)
    return decorated_function