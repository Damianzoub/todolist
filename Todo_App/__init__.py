from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from Todo_App.config  import Config
from flask_migrate import Migrate
from flask_cors import CORS
import jwt
import datetime
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view='start.login'
login_manager.login_message_category='info'
migrate = Migrate()
cors = CORS()
def create_app(config_class=Config):

    app = Flask(__name__,template_folder='templates',static_folder='static')
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app)
    app.app_context().push()
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True, resources={
        r"/api/*": {"origins": ["http://localhost:5173"]}
    })
    
    login_manager.init_app(app)

    from Todo_App.starting import start
    from Todo_App.app import app_bp
    from Todo_App.api import api_blueprint
    from Todo_App.errors.handlers import errors
    from Todo_App.users_api import users_bp
    from Todo_App.tasks_api import tasks_bp
    app.register_blueprint(start)
    app.register_blueprint(app_bp)
    app.register_blueprint(api_blueprint,url_prefix='/api')
    app.register_blueprint(users_bp,url_prefix='/api/users')
    app.register_blueprint(tasks_bp,url_prefix='/api/tasks')
    app.register_blueprint(errors)
    return app
