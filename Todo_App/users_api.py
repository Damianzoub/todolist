from flask import Flask, Blueprint, request,jsonify 
from flask_login import current_user, logout_user
from Todo_App import db
from Todo_App.models import User,Task
from Todo_App import bcrypt
from Todo_App.middleware.jwt_required import jwt_required
#---------------Import Libraries -----------------

users_bp = Blueprint('users',__name__,url_prefix='/users')



@users_bp.route("/me",methods=['GET'])
@jwt_required
def get_current_user():
    user = request.user
    if not user:
        return jsonify({
            "success":False,
            "message":"Something went wrong"
        }) ,400
    return jsonify({
        "username":user.username,
        "email":user.email,
        "photoUrl":user.image or None
    }),200

#LOOK WHY USE_EMAIL & USER_USERNAME RETURN "UNKNOWN"  
#WORKS BUT WITH THE ABOVE ERROR FOR NOW
@users_bp.route('/logout',methods=['POST'])
def logout():
    try:
        user = request.user
        print(f"User {user.user_id} logged out")
        return jsonify(
            {
                "success":True,
                "message":"Logged Out successfully"
            }
        ),200

    except Exception as e:
        print(f"Log out error: {e}")
        return jsonify({
            "success":False,
            "message": "An error occured: " + str(e)
        }),503
    

@users_bp.route('/updateEmail',methods=['POST'])
@jwt_required
def update_Email():
    try:    
        data = request.get_json()
        new_Email = data.get('newEmail')
        if not new_Email:
            return jsonify({
                "success":False,
                "message":"New email not provided"
            }) ,400
        
        user = request.user 
        if not user:
            return jsonify({
                "success":False,
                "message":"User not authenticated"
            }),401
        
        existing_user = User.query.filter_by(email=new_Email).first()
        if existing_user and existing_user.user_id != user.user_id:
            return jsonify({
                "success":False,
                "message":"This Email already exists" 
            }),409
        
        User.query.filter_by(user_id=user.user_id).update({User.email:new_Email})
        db.session.commit()

        return jsonify({
            "success":True,
            "message":"Email Updated successfully"
        }),200
    
    except Exception as e:
        return jsonify({
            "success":False,
            "message":"Username wasn't updated"
        }),503


@users_bp.route('/updateUsername',methods=['POST'])
@jwt_required
def update_surname():
    try:
        data = request.get_json()
        new_username = data.get("newUsername")
        if not new_username:
            return jsonify({
                "success":False,
                "message":"No new username provided"
            }),400
        
        if User.query.filter_by(username=new_username).first():
            return jsonify({
                "success":False,
                "message":"Username already exists"
            }),409
        
        user = request.user
        if not user:
            return jsonify({
                "success":False,
                "message":"User dont exist"
            }),404
        User.query.filter_by(user_id = user.user_id).update({User.username: new_username})
        db.session.commit()

        return jsonify({
            "success":True,
            "message":"Username updated succesfully"
        }),200
        
    except Exception as e:
        return jsonify({
            "success":False,
            "message":f"Username did not change: {e}"
        }),503


@users_bp.route('/updatePassword',methods=['POST'])
@jwt_required
def update_password():
    try:
        data = request.get_json()
        new_password = data.get('newPassword')
        print(data)
        if not new_password:
            return jsonify({
                "success":False,
                "message":"No new password provided"
            }),400
        
        user = request.user
         
        if not user:
            return jsonify({
                "success":False,
                "message":'User dont exist'
            }),404

        encrypted_password = bcrypt.generate_password_hash(new_password)
        print(encrypted_password)
        User.query.filter_by(user_id = user.user_id).update({User.password:encrypted_password})
        print(encrypted_password)
        db.session.commit()
        print(data)
        return jsonify({
            "success":True,
            "message":"Password changed successfully"
        }),200
    except Exception as e:
        
        return jsonify({
            "success":False,
            "message":f"An error ocurred: {e}"
        }),503