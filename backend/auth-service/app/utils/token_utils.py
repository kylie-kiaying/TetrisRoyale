# utils/token_utils.py
import os
import jwt
import datetime
from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def create_access_token(username: str, role: str):
    payload = {
        "username": username,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

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

    with SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(from_email, from_password)
        server.sendmail(from_email, to_email, msg.as_string())
