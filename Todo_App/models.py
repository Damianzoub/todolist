from flask_login import UserMixin
from itsdangerous import URLSafeSerializer as Serializer
from Todo_App import db,login_manager
from flask import current_app



@login_manager.user_loader 
def load_user(user_id):
    return User.query.get(int(user_id))


class User (db.Model,UserMixin):
    user_id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String(255),unique=True,nullable=True)
    email = db.Column(db.String(255),unique=True,nullable=False)
    image = db.Column(db.String(20),nullable = False, default ='blank_picture.png')
    password = db.Column(db.String(30),nullable = False)
    task = db.relationship('Task',backref='author',lazy=True)


    def get_id(self):
        return str(self.user_id)
    #serialize and signs data
    def reset_token(self):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dump({"user_id":self.user_id})   

    def __repr__(self):
        return f"User: {self.username}, {self.email}, {self.image} "
    
    #verifies signature and returns original data
    @staticmethod
    def verify_reset_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)


class Task (db.Model):
    task_id = db.Column(db.Integer,primary_key=True)
    task_name = db.Column(db.String(255),nullable=False)
    description = db.Column(db.String(255),nullable=True)
    due_date = db.Column(db.Date,nullable=True)
    priority = db.Column(db.Integer,default=4)
    user_id = db.Column(db.Integer,db.ForeignKey('user.user_id'),nullable=False)

    def __repr__(self):
        return f"Name: {self.task_name} \nDescription: {self.description} \n"
