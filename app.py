from flask import Flask, render_template, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ICS_IntelliCraft_Studios.db'
app.secret_key = 'ICS_IntelliCraft_Studios'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    security_question = db.Column(db.String(100), nullable=False)
    security_answer = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

# ********************************** Creates all DB tables **********************************
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/sign_in')
def sign_in():
    return render_template('sign_in.html')
@app.route('/sign_up')
def sign_up():
    return render_template('sign_up.html')
@app.route('/home')
def home():
    return render_template('home.html')
@app.route('/upload')
def upload():
    return render_template('upload.html')
@app.route('/edit')
def edit():
    return render_template('edit.html')
@app.route('/customization')
def customization():
    return render_template('customization.html')
@app.route('/download')
def download():
    return render_template('download.html')
@app.route('/contact_us')
def contact_us():
    return render_template('contact_us.html')
@app.route('/about_us')
def about_us():
    return render_template('about_us.html')

if __name__ == "__main__":
    app.run(debug=True)