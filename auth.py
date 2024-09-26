from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import psycopg2
import bcrypt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from dotenv import load_dotenv
import os
import datetime
import jwt

# Initialize FastAPI app
app = FastAPI()
load_dotenv()

# Database connection setup (change according to your setup)
def get_db_connection():
    connection = psycopg2.connect(
        host="localhost",
        database="mydatabase",
        user="postgres",
        password=os.getenv("db_password")
    )
    return connection

# Pydantic model for input validation for registration
class UserReg(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: str = "player"

# Pydantic model for input validation for login
class UserLogin(BaseModel):
    username: str
    password: str

# Hashing the password
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Hash a password using bcrypt
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def send_verification_email(to_email, token):
    from_email = os.getenv("from_email")
    from_password = os.getenv("from_password")
    
    subject = "Verify Your Email Address"
    body = f"Please verify your email by clicking the following link: http://localhost:8000/verify/{token}"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_email, msg.as_string())

# Endpoint to verify username and password
@app.post("/login/")
async def verify_user(auth_data: UserLogin):

    connection = get_db_connection()
    cursor = connection.cursor()

    # Query the database for the username
    cursor.execute("SELECT password_hash, email_verified, role FROM users WHERE username = %s", (auth_data.username,))
    user_record = cursor.fetchone()
    try:
        if user_record:
            stored_password_hash, email_verified, role = user_record

            if not email_verified:
                raise HTTPException(status_code=403, detail="Email not verified")


            # Verify the password
            if verify_password(auth_data.password, stored_password_hash):

                SECRET_KEY = os.getenv("SECRET_KEY")
                ALGORITHM = os.getenv("ALGORITHM", "HS256")
                ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

                payload = {
                    "username": auth_data.username,
                    "role": role,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
                }

                token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

                return {"access_token": token, "token_type": "bearer"}
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")
    
        else:
            raise HTTPException(status_code=401, detail="User not found")
    finally:
        # Clean up
        cursor.close()
        connection.close()


# Registration endpoint
@app.post("/register/")
async def register_user(auth_data: UserReg):

    if auth_data.role not in ["player", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Choose either 'player' or 'admin'.")
    
    connection = get_db_connection()
    cursor = connection.cursor()    

    # Check if username or email already exists
    cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (auth_data.username, auth_data.email))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Hash the password
    password_hash = hash_password(auth_data.password)
    
    # Generate verification token
    verification_token = str(uuid.uuid4())
    
    # Insert the new user into the database with verification token
    cursor.execute(
        "INSERT INTO users (username, password_hash, email, verification_token, role) VALUES (%s, %s, %s, %s, %s)",
        (auth_data.username, password_hash, auth_data.email, verification_token, auth_data.role)
    )
    connection.commit()

    # Send verification email
    send_verification_email(auth_data.email, verification_token)

    cursor.close()
    connection.close()

    return {"message": "User registered successfully. Please check your email to verify your account."}

@app.get("/verify/{token}")
async def verify_email(token: str):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Check if token is valid
    cursor.execute("SELECT id FROM users WHERE verification_token = %s", (token,))
    user = cursor.fetchone()

    if user:
        # Mark email as verified
        cursor.execute("UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = %s", (token,))
        connection.commit()
        cursor.close()
        connection.close()
        return {"message": "Email verified successfully"}
    else:
        cursor.close()
        connection.close()
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

#uvicorn auth:app --reload

# curl -X POST "http://127.0.0.1:8000/login/" -H "Content-Type: application/json" -d "{\"username\": \"player1\", \"password\": \"password123\"}"

# curl -X POST http://localhost:8000/register/ -H "Content-Type: application/json" -d "{\"username\": \"player2\", \"email\": \"dominicyeo42@gmail.com\", \"password\": \"password123\", \"role\": \"admin\"}"


# curl -X POST "http://127.0.0.1:8000/register/" ^
# -H "Content-Type: application/json" ^
# -d "{\"username\": \"newuser2\", \"password\": \"password123\", \"email\": \"skiesarered123@gmail.com\"}"
