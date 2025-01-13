from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt

from database.user import User
from main import app

secret_key = "very_secret_key"
algorithm = "HS256"

bearer_scheme = HTTPBearer()


def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])


def generate_token(user: User):
    return jwt.encode(user.dict(), secret_key, algorithm=algorithm)


@app.post("/login")
def login(user: User):
    return {"token": generate_token(user)}


@app.get("/me")
def me(user=Depends(get_user)):
    return user
