# ==============================================
#  HEALTHIE · backend/app.py
#  Main Flask server — handles all API routes
# ==============================================

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import sqlite3
import os
import hashlib    # for hashing passwords safely
import secrets    # for generating session tokens

# Load our .env file so we can access GEMINI_API_KEY etc.
load_dotenv()

# Create the Flask app
app = Flask(__name__)

# Secret key for sessions — reads from .env, falls back to a random string
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))

# Allow requests from our frontend (running on a different port with Live Server)
CORS(app, supports_credentials=True, origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "null"   # for when files are opened directly
])

# ── DATABASE SETUP ────────────────────────────
# This is the path to our SQLite database file
DB_PATH = os.path.join(os.path.dirname(__file__), 'healthie.db')

def get_db():
    """Opens a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # lets us access columns by name
    return conn

def init_db():
    """Creates all the database tables if they don't exist yet."""
    conn = get_db()
    cursor = conn.cursor()

    # Users table — stores login credentials
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            username  TEXT    UNIQUE NOT NULL,
            password  TEXT    NOT NULL,
            email     TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Food logs table — stores every meal entry
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS food_logs (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id      INTEGER NOT NULL,
            food_name    TEXT,
            meal_type    TEXT,    -- breakfast / lunch / dinner / snack
            calories     REAL,
            carbs_g      REAL,
            protein_g    REAL,
            fats_g       REAL,
            fiber_g      REAL,
            sugar_g      REAL,
            sodium_mg    REAL,
            ai_analysis  TEXT,    -- full AI response stored as text
            image_path   TEXT,    -- path to uploaded image
            logged_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    conn.commit()
    conn.close()
    print("✅ Database initialised")

# ── HELPER FUNCTIONS ──────────────────────────
def hash_password(password):
    """Hashes a password using SHA-256 so we never store plain text."""
    return hashlib.sha256(password.encode()).hexdigest()

def get_meal_type():
    """
    Automatically decides meal type based on current hour.
    Breakfast: 5am-10am · Lunch: 11am-3pm · Dinner: 5pm-9pm · Snack: other
    """
    from datetime import datetime
    hour = datetime.now().hour
    if 5  <= hour < 10: return 'breakfast'
    if 10 <= hour < 15: return 'lunch'
    if 17 <= hour < 21: return 'dinner'
    return 'snack'

# ── AUTH ROUTES ───────────────────────────────

@app.route('/api/signup', methods=['POST'])
def signup():
    """Creates a new user account."""
    data = request.get_json()

    # Validate that both fields are present
    username = data.get('username', '').strip().lower()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    if len(username) < 3:
        return jsonify({'error': 'Username must be at least 3 characters.'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters.'}), 400

    conn = get_db()
    try:
        # Try to insert the new user
        conn.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            (username, hash_password(password))
        )
        conn.commit()
        return jsonify({'message': 'Account created! Please sign in.'}), 201

    except sqlite3.IntegrityError:
        # This error means the username already exists (UNIQUE constraint)
        return jsonify({'error': 'Username already taken. Try another.'}), 409

    finally:
        conn.close()


@app.route('/api/login', methods=['POST'])
def login():
    """Logs in an existing user."""
    data = request.get_json()

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

    # Save user info in the session
    session['user_id']  = user['id']
    session['username'] = user['username']

    return jsonify({
        'message':  'Login successful!',
        'username': user['username'],
        'user_id':  user['id']
    }), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    """Clears the user session."""
    session.clear()
    return jsonify({'message': 'Logged out.'}), 200


@app.route('/api/me', methods=['GET'])
def me():
    """Returns the currently logged-in user (used to check session)."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in.'}), 401
    return jsonify({
        'username': session['username'],
        'user_id':  session['user_id']
    }), 200


# ── TEST ROUTE ────────────────────────────────
@app.route('/api/ping', methods=['GET'])
def ping():
    """Simple test route — visit this to check the server is running."""
    return jsonify({'message': 'Healthie backend is running! 🥗'}), 200


# ── START THE SERVER ──────────────────────────
if __name__ == '__main__':
    init_db()        # create tables if they don't exist
    print("🚀 Starting Healthie backend on http://localhost:5000")
    app.run(debug=True, port=5000)python backend/app.py 2>&1