from flask_wtf import FlaskForm
from wtforms import StringField,EmailField,PasswordField,SubmitField, FileField , SelectMultipleField,widgets
from wtforms.validators import DataRequired , Email , Length , ValidationError
from flask_wtf.file import FileAllowed
from Todo_App.models import User
class RegistrationForm(FlaskForm):
    email = EmailField("Email",validators=[DataRequired(),Email()])
    password = PasswordField("Password",validators=[DataRequired(),Length(min=6,max=30)])
    submit = SubmitField("Register")

    def validate_email(self,email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("This email already exist")
        
class LoginForm(FlaskForm):
    email = EmailField("Email",validators=[DataRequired(),Email()])
    password = PasswordField('Password',validators=[DataRequired(),Length(min=6,max=30)])
    submit = SubmitField("Login")


class CreateProfile(FlaskForm):
    username = StringField('Username',validators=[DataRequired(),Length(min=4,max=30)])
    image = FileField('photo',validators=[FileAllowed(['jpg','jpeg','png'])])
    submit = SubmitField('Create Profile')

    def validate_username(self,username):
        user  = User.query.filter_by(username = username.data).first()
        if user:
            return ValidationError("This username already exists")

class UseCaseOption(FlaskForm):
    use_type = SelectMultipleField(
        "How do you plan to use Todoist?",
        choices=[
            ('personal',"Personal Use"),
            ("work","Work Use"),
            ("study","Study Use")
        ],
        option_widget=widgets.CheckboxInput(),
        widget=widgets.ListWidget(prefix_label=False)
    )
    submit = SubmitField('Open Todoist')