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
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)


# ********************************** Creates all DB tables **********************************
with app.app_context():
    db.create_all()

# **********************************  **********************************
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign_in_sign_up', methods=['GET', 'POST'])
def sign_in_sign_up():
    if request.method == 'POST':
        if 'username' in request.form and 'password' in request.form:
            # Attempting sign-in
            username = request.form['username']
            password = request.form['password']
            print(f"Attempting sign-in with username: {username} and password: {password}")

            user = User.query.filter_by(username=username, password=password).first()
            if user:
                return f'Logged in as {username}'
            else:
                print("Sign-in failed. Invalid username or password.")
                return 'Invalid username or password. Please sign up if you are a new user.'
        elif 'email' in request.form and 'username' in request.form and 'password' in request.form:
            # Attempting sign-up
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            print(f"Attempting sign-up with username: {username}, email: {email}, and password: {password}")

            existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
            if existing_user:
                print("Sign-up failed. Username or email already exists.")
                return 'Username or email already exists!'
            
            new_user = User(username=username, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()
            print("User signed up successfully!")
            return 'User signed up successfully!'
        
    return render_template('sign_in_sign_up.html')

@app.route('/sign_in', methods=['POST', 'GET'])
def sign_in():
    if request.method == 'POST':
        # Assuming you want to handle the form submission here
        username = request.form['username']
        password = request.form['password']
        
        # Here you can check the username and password
        # For simplicity, let's assume any non-empty username/password combination is valid
        if username and password:
            # Redirect to home page upon successful login
            return redirect(url_for('home'))
        else:
            # Handle invalid login, maybe return to login page with an error message
            return render_template('sign_in.html')  # Render sign-in page again upon unsuccessful login
    else:
        # If accessed via GET method, just render the sign-in page
        return render_template('sign_in.html')


@app.route('/sign_up', methods=['POST', 'GET'])
def sign_up():
    if request.method == 'POST':
        # Assuming you want to handle the form submission here
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Here you can perform any validation or save the user data to a database
        # For simplicity, let's just print the received data
        print(f"Username: {username}, Email: {email}, Password: {password}")
        
        # Redirect to sign-in page upon successful sign-up
        return redirect(url_for('/sign_in'))
    else:
        # If accessed via GET method, just render the sign-up page
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