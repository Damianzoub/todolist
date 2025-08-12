from flask import Blueprint 
from Todo_App.users_api import users_bp
from Todo_App.tasks_api import tasks_bp
#--------------IMPORTS ABOVE -------------------------------------

api_blueprint = Blueprint('api',__name__,url_prefix='/api')

#REGISTER BLUEPRINTS FOR USERS AND TASKS APIs
api_blueprint.register_blueprint(users_bp,url_prefix='/users')
api_blueprint.register_blueprint(tasks_bp,url_prefix='/tasks')



