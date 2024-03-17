from flask import Flask, render_template, redirect, request, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ICS_IntelliCraft_Studios.db'
app.secret_key = 'ICS_IntelliCraft_Studios'
db = SQLAlchemy(app)

class ContactForm(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

# ********************************** Creates all DB tables **********************************
with app.app_context():
    db.create_all()

# **********************************  **********************************
@app.route('/')
def index():
    return render_template('index.html')



@app.route('/sign_in', methods=['POST', 'GET'])
def sign_in():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email, password=password).first()

        if user:
            flash("Logged in successfully!", "success")
            return redirect(url_for("index"))
    return render_template("sign_in.html")


@app.route('/sign_up', methods=['POST', 'GET'])
def sign_up():
    pass
    
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

@app.route('/contact', methods=['POST', 'GET'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        message = request.form['message']

        new_contact = ContactForm(name=name, email=email, phone=phone, message=message)
        db.session.add(new_contact)
        db.session.commit()

        return redirect('/contact')
    
    return render_template('contact.html')

@app.route('/contact_2')
def contact_2():
    return render_template('contact_2.html')

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/team_2')
def team_2():
    return render_template('team_2.html')

if __name__ == "__main__":
    app.run(debug=True)