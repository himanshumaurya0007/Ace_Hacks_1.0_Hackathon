from flask import Flask, render_template, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ICS_IntelliCraft_Studios.db'
app.secret_key = 'ICS_IntelliCraft_Studios'
db = SQLAlchemy(app)

# ********************************** Creates all DB tables **********************************
with app.app_context():
    db.create_all()

# ********************************** **********************************
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign_in_sign_up')
def sign_in_sign_up():
    return render_template('sign_in_sign_up.html')

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

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/team')
def team():
    return render_template('team.html')

if __name__ == "__main__":
    app.run(debug=True)