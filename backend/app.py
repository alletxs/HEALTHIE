from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import sqlite3, os, hashlib, secrets
from datetime import datetime

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))

CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_PATH = os.path.join(os.path.dirname(__file__), 'healthie.db')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS food_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        food_name TEXT,
        meal_type TEXT,
        calories REAL,
        carbs_g REAL,
        protein_g REAL,
        fats_g REAL,
        fiber_g REAL,
        sugar_g REAL,
        sodium_mg REAL,
        ai_analysis TEXT,
        image_path TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()
    print("Database initialised")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def get_meal_type():
    hour = datetime.now().hour
    if 5  <= hour < 10: return 'breakfast'
    if 10 <= hour < 15: return 'lunch'
    if 17 <= hour < 21: return 'dinner'
    return 'snack'

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Healthie backend is running!'}), 200

@app.route('/api/signup', methods=['POST'])
def signup():
    data     = request.get_json()
    username = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': 'Both fields are required.'}), 400
    if len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters.'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400
    conn = get_db()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                     (username, hash_password(password)))
        conn.commit()
        return jsonify({'message': 'Account created! Please sign in.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already taken.'}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data     = request.get_json()
    username = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': 'Please fill in both fields.'}), 400
    conn = get_db()
    user = conn.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        (username, hash_password(password))
    ).fetchone()
    conn.close()
    if not user:
        return jsonify({'error': 'Incorrect username or password.'}), 401
    session['user_id']  = user['id']
    session['username'] = user['username']
    return jsonify({'message': 'Login successful!', 'username': user['username'], 'user_id': user['id']}), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out.'}), 200

@app.route('/api/me', methods=['GET'])
def me():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in.'}), 401
    return jsonify({'username': session['username'], 'user_id': session['user_id']}), 200

if __name__ == '__main__':
    init_db()
    print("Starting Healthie backend on http://localhost:5000")
    app.run(debug=True, port=5000)
