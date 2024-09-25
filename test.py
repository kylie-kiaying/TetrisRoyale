import secrets

# Generate a secure 32-byte key
secret_key = secrets.token_urlsafe(32)
print(secret_key)