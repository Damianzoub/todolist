from flask import Blueprint, render_template , redirect , url_for , flash , request #flash is for putting succesfull messages or dangers
from Todo_App.forms import RegistrationForm , LoginForm , CreateProfile , UseCaseOption
from flask_login import current_user , login_user
from flask_bcrypt import bcrypt
from Todo_App.models import User
from Todo_App import db, bcrypt
from Todo_App.utils.jwt_utils import generate_jwt


start = Blueprint("start",__name__)



@start.route("/")
@start.route("/home")
def home():
    return render_template('home.html')

@start.route('/auth/login',methods=['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user and bcrypt.check_password_hash(user.password,form.password.data):
                token = generate_jwt(user.user_id)
                return redirect(f'http://localhost:5173/app/?token={token}')
    return render_template('login.html',form=form)


@start.route('/prices', methods=['GET'])
def prices():
    return render_template('prices.html')

@start.route("/auth/register",methods=['GET','POST'])
def register():
    
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('UTF-8')
        user = User(email=form.email.data,password=hashed_password)
        db.session.add(user)
        db.session.commit()

        return redirect(url_for("start.create_profile",email=form.email.data))
    return render_template('register.html',form=form)

@start.route("/app/onboard/create-profile", methods=['GET','POST'])
def create_profile():
    get_email = request.args.get('email')
    print(get_email)
    form = CreateProfile()
    if form.validate_on_submit():
        user = User.query.filter_by(email=get_email).first()
        print(f"User was found: {user}")
        if user:
            #Update value
            User.query.filter_by(email = get_email).update({User.username: form.username.data})
            #Commit Changes
            db.session.commit()
        else:
            flash("User Not Found","warning")
        return redirect(url_for("start.use_cases"))
    return render_template("create_profile.html",form=form)

@start.route("/app/onboard/use-case",methods=['GET','POST'])
def use_cases():
    form = UseCaseOption()
    if form.validate_on_submit():
        return redirect(url_for("start.login"))

    return render_template("use_case.html",form=form)



