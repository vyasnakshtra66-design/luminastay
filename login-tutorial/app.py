"""
=============================================================================
LOGIN SYSTEM - COMPLETE BACKEND (Flask + MySQL + JWT)
=============================================================================

HOW THE ENTIRE SYSTEM FITS TOGETHER:

  ┌─────────────────────────────────────────────────────────┐
  │                     YOUR BROWSER                         │
  │  ┌──────────┐   ┌──────────┐   ┌─────────────────────┐  │
  │  │ Login    │   │ Register │   │ Dashboard/Profile   │  │
  │  │ Page     │   │ Page     │   │ Page (Protected)    │  │
  │  └────┬─────┘   └────┬─────┘   └──────────┬──────────┘  │
  │       │              │                     │             │
  │       └──────┬───────┘                     │             │
  │              │                             │             │
  │              ▼                             │             │
  │       ┌──────────────┐                    │             │
  │       │ JavaScript   │                    │             │
  │       │ (fetch API)  │                    │             │
  │       └──────┬───────┘                    │             │
  │              │                            │             │
  └──────────────┼────────────────────────────┼─────────────┘
                 │ HTTP Requests              │
                 ▼                            ▼
  ┌─────────────────────────────────────────────────────────┐
  │                    FLASK SERVER (app.py)                  │
  │                                                          │
  │  /api/register ──> api_register() ──> INSERT INTO users │
  │  /api/login    ──> api_login()    ──> SELECT + JWT      │
  │  /api/profile  ──> @token_required ──> SELECT user data │
  │  /api/logout   ──> api_logout()   ──> Clear cookie      │
  │                                                          │
  │  @token_required decorator:                              │
  │    1. Read JWT from Cookie or Authorization header       │
  │    2. Decode + verify signature                          │
  │    3. Extract user_id                                    │
  │    4. Pass user_id to the route function                  │
  └──────────────────────┬──────────────────────────────────┘
                         │ SQL Queries
                         ▼
  ┌─────────────────────────────────────────────────────────┐
  │              MySQL DATABASE (login_app)                  │
  │                                                          │
  │  ┌──────────────────────────────────────────────────┐   │
  │  │  users                                           │   │
  │  ├──────────┬─────────────┬────────────┬───────────┤   │
  │  │ id (PK)  │ username    │ email      │ pass_hash │   │
  │  ├──────────┼─────────────┼────────────┼───────────┤   │
  │  │ 1        │ john        │ j@e.com    │ $2b$12... │   │
  │  │ 2        │ alice       │ a@e.com    │ $2b$12... │   │
  │  └──────────┴─────────────┴────────────┴───────────┘   │
  └─────────────────────────────────────────────────────────┘

=============================================================================
Now let's understand EVERY import below:
=============================================================================
"""

import os
import re
from datetime import datetime, timedelta
from functools import wraps

import mysql.connector
import jwt
from flask import (
    Flask, render_template, request,
    jsonify, redirect, url_for
)
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv

# ─── WHAT EACH IMPORT DOES ───
# os:              Read environment variables from .env file
# re:              Regular expressions (validate email format)
# datetime:        Get current time for token timestamps
# timedelta:       Add hours/days to current time (token expiry)
# functools.wraps: Preserve function name when using decorators
#
# mysql.connector: Talk to MySQL database
# jwt:             Create and verify JSON Web Tokens
# Flask:           The web framework itself
# render_template: Serve HTML files from templates/ folder
# request:         Read incoming HTTP request data
# jsonify:         Convert Python dict to JSON response
# redirect:        Send browser to another URL
# url_for:         Build URLs from route names
#
# Bcrypt:          Hash and verify passwords
# CORS:            Allow requests from different domains
# load_dotenv:     Read .env file into os.environ

# ─── LOAD ENVIRONMENT VARIABLES ───
load_dotenv()  # Reads .env file, makes keys available via os.getenv()

app = Flask(__name__)
# Flask needs a SECRET_KEY for signing session cookies
# and flashing messages. We get it from .env or use a fallback
# (never use the fallback in production!)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-this-in-production')

bcrypt = Bcrypt(app)   # Initialize bcrypt - provides hash/verify methods
CORS(app)              # Allow frontend from different port/domain to call API

# ─── DATABASE CONFIGURATION ───
# These values come from .env file
# mysql.connector.connect(**DB_CONFIG) uses these as keyword arguments
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'login_app'),
}

# ─── JWT CONFIGURATION ───
JWT_SECRET = os.getenv('JWT_SECRET', 'change-this-in-production')
JWT_ALGORITHM = 'HS256'           # HMAC with SHA-256 (symmetric)
JWT_EXPIRATION_HOURS = 24         # Token valid for 24 hours


# ================================================================
# HELPER FUNCTION: Get Database Connection
# ================================================================
def get_db():
    """
    Create and return a MySQL database connection.

    Every time we need to talk to the database, we call this function.
    It opens a NEW connection, we use it, then CLOSE it.

    WHY NOT reuse one connection?
    - Web servers handle multiple users simultaneously
    - Each request needs its own connection (thread safety)
    - MySQL connections can time out if idle too long
    """
    return mysql.connector.connect(**DB_CONFIG)


# ================================================================
# DECORATOR: Token Required (THE GATEKEEPER)
# ================================================================
def token_required(f):
    """
    PROTECTED ROUTE DECORATOR

    What is a decorator?
    ┌──────────────────────────────────────────────────────────┐
    │  A decorator is a function that WRAPS another function    │
    │  to add behavior BEFORE and AFTER the wrapped function.   │
    │                                                           │
    │  @token_required         ┌────────────────────────────┐  │
    │  def dashboard(user_id): │  token_required runs FIRST │  │
    │      ...                 │  → validates token         │  │
    │                          │  → extracts user_id        │  │
    │                          │  → CALLS dashboard(id)    │  │
    │                          └────────────────────────────┘  │
    └──────────────────────────────────────────────────────────┘

    HOW THIS WORKS:
    Step 1: Read token from Cookie or Authorization header
    Step 2: Try to decode it using our JWT_SECRET
    Step 3: If valid → pass user_id to the route function
    Step 4: If invalid/expired → return 401 error immediately
    """
    @wraps(f)  # Preserves the original function's name and metadata
    def decorated(*args, **kwargs):
        token = None

        # ── METHOD 1: Read from HTTP-Only Cookie ──
        # This is the most secure method.
        # The browser automatically sends cookies with every request.
        # JavaScript CANNOT read HttpOnly cookies (prevents XSS theft).
        token = request.cookies.get('auth_token')

        # ── METHOD 2: Read from Authorization Header ──
        # Used by mobile apps, Postman, or when cookies aren't available.
        # Format: "Authorization: Bearer <token>"
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        # ── NO TOKEN FOUND ──
        if not token:
            return jsonify({
                'message': 'Authentication required! Please login.'
            }), 401  # 401 = Unauthorized

        # ── VERIFY THE TOKEN ──
        try:
            # jwt.decode() does THREE things:
            # 1. Splits token into header.payload.signature
            # 2. Re-computes signature using JWT_SECRET
            # 3. Compares computed vs provided signature
            #    (if they don't match → token was TAMPERED with)
            # 4. Checks if 'exp' is in the past
            #    (if expired → ExpiredSignatureError)
            data = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=[JWT_ALGORITHM]
            )
            current_user_id = data['user_id']

        except jwt.ExpiredSignatureError:
            return jsonify({
                'message': 'Session expired! Please login again.'
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                'message': 'Invalid token! Please login again.'
            }), 401

        # ── TOKEN IS VALID ──
        # Call the original route function with user_id
        # The `f` here is the function being decorated
        # We inject user_id as the FIRST argument
        return f(current_user_id, *args, **kwargs)

    return decorated


# ================================================================
# ROUTE: Home Page
# ================================================================
@app.route('/')
def home():
    """
    When user visits http://localhost:5000/
    → Serve the index.html template
    → This page shows Login/Register buttons
    """
    return render_template('index.html')


# ================================================================
# ROUTE: Page Routes (Serve HTML)
# ================================================================
@app.route('/register')
def register_page():
    """Serve the registration form page."""
    return render_template('register.html')


@app.route('/login')
def login_page():
    """Serve the login form page."""
    return render_template('login.html')


@app.route('/dashboard')
def dashboard_page():
    """Serve the dashboard (profile) page."""
    return render_template('dashboard.html')


# ================================================================
# API: REGISTER — POST /api/register
# ================================================================
@app.route('/api/register', methods=['POST'])
def api_register():
    """
    ┌─────────────────────────────────────────────────────────────┐
    │  REGISTRATION FLOW                                          │
    │                                                             │
    │  Browser                      Server                        │
    │    │                            │                           │
    │    │  POST /api/register        │                           │
    │    │  {username, email, pass}   │                           │
    │    │ ─────────────────────────> │                           │
    │    │                            │  1. Validate inputs       │
    │    │                            │  2. Check existing user   │
    │    │                            │  3. Hash password         │
    │    │                            │     with bcrypt           │
    │    │                            │  4. INSERT into database  │
    │    │  {"message":"success!"}    │                           │
    │    │ <───────────────────────── │  5. Return success        │
    │    │                            │                           │
    │  User is redirected to login    │                           │
    │  page to sign in.               │                           │
    └─────────────────────────────────────────────────────────────┘
    """

    # ── STEP 1: Extract JSON data from request body ──
    data = request.get_json()
    # request.get_json() parses the JSON string from the request body
    # into a Python dictionary.
    # Example: '{"username":"john","email":"j@e.com","password":"secret123"}'
    # becomes → {'username': 'john', 'email': 'j@e.com', 'password': 'secret123'}

    # ── STEP 2: Get individual fields with defaults ──
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    # .strip() removes whitespace from both ends
    # .lower() converts email to lowercase (so John@Gmail.com → john@gmail.com)
    password = data.get('password', '')

    # ── STEP 3: Validate ALL fields are present ──
    if not username or not email or not password:
        return jsonify({'message': 'All fields are required!'}), 400
    # 400 = Bad Request (client error)

    # ── STEP 4: Validate username length ──
    if len(username) < 3:
        return jsonify({'message': 'Username must be at least 3 characters!'}), 400

    # ── STEP 5: Validate password strength ──
    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters!'}), 400

    # ── STEP 6: Validate email format using REGEX ──
    # Regular Expression (regex) breakdown:
    # ^                   Start of string
    # [a-zA-Z0-9._%+-]+  One or more allowed characters (username part)
    # @                   Literal @ symbol
    # [a-zA-Z0-9.-]+     Domain name (letters, numbers, dots, hyphens)
    # \.                  Literal dot before TLD
    # [a-zA-Z]{2,}$      Top-level domain (com, org, in, etc.), 2+ chars
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return jsonify({'message': 'Invalid email format!'}), 400

    # ── STEP 7: Connect to database ──
    connection = get_db()
    cursor = connection.cursor(dictionary=True)
    # cursor(dictionary=True) means each row is returned as a Python dict
    # instead of a tuple. So user['email'] works instead of user[1].

    try:
        # ── STEP 8: Check if user already exists ──
        # Parameterized query (%s placeholders) prevents SQL injection
        # NEVER do: f"SELECT * FROM users WHERE email = '{email}'"
        # That allows: email = "'; DROP TABLE users; --"
        cursor.execute(
            "SELECT id FROM users WHERE username = %s OR email = %s",
            (username, email)
        )
        existing = cursor.fetchone()
        # fetchone() returns one row or None

        if existing:
            return jsonify({'message': 'Username or email already exists!'}), 409
            # 409 = Conflict (resource already exists)

        # ── STEP 9: Hash the password ──
        # generate_password_hash(password) does:
        #   1. Generate random salt (22 chars)
        #   2. Hash password + salt using Blowfish cipher
        #   3. Return combined string: $2b$12$salt$hash
        #
        # .decode('utf-8') converts bytes to string for MySQL storage
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        # ── STEP 10: Insert new user ──
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )
        connection.commit()
        # commit() SAVES the changes permanently to the database
        # Without commit(), the INSERT is lost when connection closes

        return jsonify({'message': 'Registration successful! Please login.'}), 201
        # 201 = Created

    # ── ERROR HANDLING ──
    except mysql.connector.Error as err:
        # Catch database errors (connection failed, duplicate entry, etc.)
        return jsonify({'message': f'Database error: {err}'}), 500
    # 500 = Internal Server Error

    # ── ALWAYS CLEAN UP ──
    finally:
        cursor.close()
        connection.close()
    # Always close connection, even if an error occurred.
    # Leaving connections open = database runs out of connections
    # → new users can't register = BAD


# ================================================================
# API: LOGIN — POST /api/login
# ================================================================
@app.route('/api/login', methods=['POST'])
def api_login():
    """
    ┌─────────────────────────────────────────────────────────────┐
    │  LOGIN FLOW                                                 │
    │                                                             │
    │  Browser                      Server                        │
    │    │                            │                           │
    │    │  POST /api/login           │                           │
    │    │  {login:"j@e.com",        │                           │
    │    │   password:"secret"}       │                           │
    │    │ ─────────────────────────> │                           │
    │    │                            │  1. Find user by          │
    │    │                            │     email OR username      │
    │    │                            │  2. bcrypt.               │
    │    │                            │     check_password_hash() │
    │    │                            │  3. Create JWT token      │
    │    │                            │  4. Set cookie in         │
    │    │                            │     HTTP response         │
    │    │  Set-Cookie: auth_token=   │                           │
    │    │  <JWT>                     │                           │
    │    │  {"user":{id,name,email}}  │                           │
    │    │ <───────────────────────── │                           │
    │    │                            │                           │
    │    │  Browser stores cookie     │                           │
    │    │  Automatically sent with   │                           │
    │    │  every future request      │                           │
    │    │                            │                           │
    │    │  JS redirects to /dashboard│                           │
    └─────────────────────────────────────────────────────────────┘
    """

    data = request.get_json()
    login_input = data.get('login', '').strip().lower()
    # 'login' can be EITHER email or username (user's choice)
    password = data.get('password', '')

    # ── Validate inputs ──
    if not login_input or not password:
        return jsonify({'message': 'All fields are required!'}), 400

    # ── Find user in database ──
    connection = get_db()
    cursor = connection.cursor(dictionary=True)

    try:
        # Search by BOTH email and username using OR
        # This allows users to login with either field
        cursor.execute(
            "SELECT id, username, email, password_hash, created_at "
            "FROM users WHERE email = %s OR username = %s",
            (login_input, login_input)
        )
        user = cursor.fetchone()

        # ── Verify password ──
        if not user:
            # User not found — use generic message for security
            # Never say "User not found" vs "Wrong password"
            # because hackers can use that to FIND valid usernames
            return jsonify({'message': 'Invalid credentials!'}), 401

        # check_password_hash(hash, password) does:
        #   1. Parse stored hash to extract algorithm, cost, salt
        #   2. Hash INPUT password with same salt
        #   3. Compare new hash with stored hash
        # Returns True if match, False if not
        if not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid credentials!'}), 401

        # ── Create JWT Token ──
        # Payload = data stored INSIDE the token
        # The user can see the payload (it's base64-encoded, not encrypted)
        # but they CANNOT change it without knowing JWT_SECRET
        payload = {
            'user_id': user['id'],       # Identify the user
            'username': user['username'], # Convenience (avoid DB lookup)
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            # exp = expiration time (Unix timestamp)
            # If current time > exp, token is rejected
            'iat': datetime.utcnow()
            # iat = issued at time (when token was created)
        }

        # jwt.encode() creates the token string:
        #   1. Base64url encode header → eyJ...
        #   2. Base64url encode payload → eyJ...
        #   3. Create signature: HMACSHA256(base64header.base64payload, JWT_SECRET)
        #   4. Combine: header.payload.signature
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        # ── Prepare Response ──
        response = jsonify({
            'message': 'Login successful!',
            'token': token,   # Also return in body for mobile/localStorage usage
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        })

        # ── Set HTTP-Only Cookie ──
        # This is the KEY security mechanism:
        #
        # httponly=True    → JavaScript CANNOT read this cookie using
        #                    document.cookie. Even if XSS attack injects
        #                    malicious JS, it can't steal the token.
        #
        # secure=False     → Set True in production (HTTPS only).
        #                    On localhost (HTTP), set to False.
        #
        # samesite='Lax'   → Cookie is only sent for same-site requests,
        #                    not for cross-site requests (prevents CSRF).
        #                    'Lax' allows top-level navigation (user clicks link).
        #
        # max_age=seconds  → Cookie automatically deleted after N seconds.
        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=JWT_EXPIRATION_HOURS * 3600
        )

        return response

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        cursor.close()
        connection.close()


# ================================================================
# API: PROFILE — GET /api/profile (PROTECTED ROUTE)
# ================================================================
@app.route('/api/profile', methods=['GET'])
@token_required  # ← THIS IS THE GATEKEEPER
def api_profile(current_user_id):
    """
    PROTECTED ROUTE

    HOW THE USER IS IDENTIFIED:
                           ┌──────────────────┐
                           │  Browser sends    │
                           │  request          │
                           └────────┬─────────┘
                                    │ Cookie: auth_token=<JWT>
                                    ▼
                           ┌──────────────────┐
                           │  @token_required  │
                           │  reads cookie     │
                           │  decodes JWT      │
                           │  extracts user_id │
                           └────────┬─────────┘
                                    │ current_user_id = 42
                                    ▼
                           ┌──────────────────┐
                           │  api_profile(42)  │
                           │  SELECT * FROM    │
                           │  users WHERE id=42│
                           └────────┬─────────┘
                                    │ User data
                                    ▼
                           ┌──────────────────┐
                           │  Response sent    │
                           │  to browser       │
                           └──────────────────┘

    HOW THE PROFILE PAGE OPENS AUTOMATICALLY:
    1. User visits /dashboard in browser
    2. Frontend JavaScript (dashboard.html) calls GET /api/profile
    3. The browser AUTOMATICALLY includes the auth_token cookie
    4. Server decodes JWT → knows which user → returns user data
    5. Frontend displays user data on the page

    KEY INSIGHT: The server never asks "Who are you?"
    The server reads the JWT and says "Ah, user #42!"
    """

    connection = get_db()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch latest user data (may have changed since login)
        cursor.execute(
            "SELECT id, username, email, created_at FROM users WHERE id = %s",
            (current_user_id,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'User not found!'}), 404

        # Convert datetime to readable format
        # created_at is a datetime object like datetime(2026, 6, 30, 12, 0, 0)
        # .strftime() formats it as string: "June 30, 2026"
        user['created_at'] = user['created_at'].strftime('%B %d, %Y')

        return jsonify({'user': user}), 200

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        cursor.close()
        connection.close()


# ================================================================
# API: LOGOUT — POST /api/logout
# ================================================================
@app.route('/api/logout', methods=['POST'])
def api_logout():
    """
    LOGOUT PROCESS

    ┌────────────────────────────────────────────────────────┐
    │  Browser                  Server                       │
    │    │                        │                          │
    │    │  POST /api/logout      │                          │
    │    │  (cookie auto-sent)   │                          │
    │    │ ─────────────────────> │                          │
    │    │                        │  Clear cookie by setting  │
    │    │                        │  Max-Age=0               │
    │    │  Set-Cookie:           │                          │
    │    │  auth_token="";        │                          │
    │    │  Max-Age=0             │                          │
    │    │ <───────────────────── │                          │
    │    │                        │                          │
    │    │  Browser deletes       │                          │
    │    │  the cookie            │                          │
    │    │                        │                          │
    │    │  JS redirects to /login│                          │
    │    │  (or home page)        │                          │
    │    │                        │                          │
    │    │  Now: No token →       │                          │
    │    │  /api/profile returns  │                          │
    │    │  401 Unauthorized      │                          │
    └────────────────────────────────────────────────────────┘

    IMPORTANT: With JWT, the server doesn't need to "remember"
    logged-in status. The token itself IS the proof. Logout just
    means the browser throws away the token.

    DOWNSIDE: If someone stole the token before logout, they can
    still use it until it expires. For instant revocation, you'd
    need a token blacklist (Redis) — but that adds complexity.
    """

    response = jsonify({'message': 'Logged out successfully!'})

    # Clear the cookie by setting:
    #   value = '' (empty)
    #   max_age = 0 (browser immediately expires/deletes the cookie)
    response.set_cookie(
        'auth_token',
        '',
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=0
    )

    return response


# ================================================================
# MAIN — Database Setup + Run Server
# ================================================================
if __name__ == '__main__':
    """
    When you run: python app.py
    This block executes FIRST.

    It ensures the database and table exist before starting the server.
    """
    print("=" * 60)
    print("  LOGIN SYSTEM - Setting up database...")
    print("=" * 60)

    try:
        # Step 1: Connect to MySQL without specifying a database
        # (because our database might not exist yet)
        temp_conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        temp_cursor = temp_conn.cursor()

        # Step 2: CREATE DATABASE IF NOT EXISTS
        # This runs the SQL: CREATE DATABASE IF NOT EXISTS login_app
        # IF NOT EXISTS means: if it already exists, don't error
        temp_cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")

        # Step 3: USE our database
        temp_cursor.execute(f"USE {DB_CONFIG['database']}")

        # Step 4: CREATE TABLE IF NOT EXISTS
        # This runs:
        #   CREATE TABLE IF NOT EXISTS users (
        #       id INT AUTO_INCREMENT PRIMARY KEY,
        #       username VARCHAR(50) UNIQUE NOT NULL,
        #       email VARCHAR(100) UNIQUE NOT NULL,
        #       password_hash VARCHAR(255) NOT NULL,
        #       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        #   );
        #
        # ┌──────────────┬─────────────────────────────────────────────┐
        # │  Column       │  Purpose                                    │
        # ├──────────────┼─────────────────────────────────────────────┤
        # │  id           │  Unique number for each user (auto-increment)│
        # │  username     │  Display name, max 50 chars, must be unique │
        # │  email        │  Login identifier, max 100 chars, unique    │
        # │  password_hash│  bcrypt hash, 60 chars but store 255 for   │
        # │              │  future-proofing                             │
        # │  created_at   │  Auto-set when row is inserted              │
        # └──────────────┴─────────────────────────────────────────────┘
        temp_cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        temp_conn.commit()
        print("[✓] Database 'login_app' and table 'users' are ready.")
        print()

        temp_cursor.close()
        temp_conn.close()

    except mysql.connector.Error as err:
        print(f"[✗] Database setup failed: {err}")
        print("[!] Make sure MySQL is installed and running.")
        print("[!] Check .env file for correct credentials.")
        print()
        print("  To install MySQL: https://dev.mysql.com/downloads/")
        print("  Or use XAMPP:      https://www.apachefriends.org/")
        print()

    # Start the Flask development server
    # debug=True  → Auto-reload when code changes
    # port=5000   → Server runs at http://localhost:5000
    print("Starting server at http://localhost:5000")
    print("Press Ctrl+C to stop.")
    app.run(debug=True, port=5000)
