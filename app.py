from flask import Flask, render_template, redirect, url_for, flash
from flask_wtf import FlaskForm
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_required, login_user, current_user, logout_user
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import InputRequired, Length, Email
from werkzeug.security import generate_password_hash, check_password_hash

import os

dbdir = "sqlite:///" + os.path.abspath(os.getcwd()) + "/database.db"

app = Flask(__name__)
app.config["SECRET_KEY"] = "SomeSecret"
app.config["SQLALCHEMY_DATABASE_URI"] = dbdir
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

class RegisterForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired(), Length(min=5, max=50)])
    email = StringField("Email", validators=[InputRequired(), Length(min=5, max=50), Email()])
    password = PasswordField("Password", validators=[InputRequired(), Length(min=6, max=80)])
    submit = SubmitField("Sign Up")

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired(), Length(min=5, max=50)])
    password = PasswordField("Password", validators=[InputRequired(), Length(min=6, max=80)])
    remember = BooleanField("Remember Me")
    submit = SubmitField("Log In")

@app.route("/")
def index():
    coin1 = ['ava.png','아발란체','100.1239','AVA']
    coin2 = ['dot.png','폴카닷','0','DOT']
    coin3 = ['apc.jpeg','앱토스','12','APC']
    coin4 = ['ijc.jpeg','인젝티브','12','IJC']
    coins = [coin1,coin2,coin3,coin4]
    return render_template("select.html",coins=coins)

@app.route("/deposit/<coin>", methods=["GET", "POST"])
def signup(coin):
    amount = 0
    coin_name = 'AVAX'
    if coin == 'AVA':
        amount = 100.1239
        coin_name = 'AVAX'
    if coin == 'DOT':
        amount = 0
        coin_name = 'DOT'
    if coin == 'APC':
        amount = 12
        coin_name = 'APC'
    if coin == 'IJC':
        amount = 12
        coin_name = 'IJC'

    return render_template("deposit.html" ,amount=amount, coin_name=coin_name)

@app.route("/select", methods=["GET", "POST"])
def login():
    coins = ['AVA','DOT','APC','IJC']
    return render_template("select.html", coins=coins)


@app.route("/nextstep/<coin>/<amount>", methods=["GET", "POST"])
def nextstep(coin,amount):
    return render_template("nextstep.html", coin=coin,amount=amount)

@app.route("/finish/<coin>/<amount>")
def finish(coin,amount):
    return render_template("finish.html",coin=coin,amount=amount)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You were logged out. See you soon!")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)
