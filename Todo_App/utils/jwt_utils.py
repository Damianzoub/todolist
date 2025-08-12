import jwt 
from flask import current_app
from datetime import datetime,timedelta
from functools import wraps

def generate_jwt(user_id):
    #generate a jwt token for authentication
    payload={
        "user_id":user_id,
        "exp":datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }

    return jwt.encode(payload,current_app.config['JWT_SECRET_KEY'],algorithm='HS256')

def verify_jwt(token):
    #user sends token here and it checks if it exists in the payload
    try:
        payload = jwt.decode(token,current_app.config['JWT_SECRET_KEY'],algorithms=['HS256'])
        return payload['user_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None