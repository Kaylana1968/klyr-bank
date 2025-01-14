from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import os
from dotenv import load_dotenv
from sqlmodel import select

from database.init import get_session
from database.models import User
from src.auth.model.user import CreateUser

router = APIRouter()

load_dotenv()
secret_key = os.getenv("SECRET_KEY")

bearer_scheme = HTTPBearer()
algorithm = "HS256"


def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])


def generate_token(user: User):
    return jwt.encode(user.dict(), secret_key, algorithm=algorithm)


@router.post("/login")
def login(user: User):
    return {"token": generate_token(user)}


@router.post("/register")
def register(body: CreateUser, session=Depends(get_session)) -> User:
    user = User(email=body.email, password=body.password)
    session.add(user)
    session.commit()
    session.refresh(user)

    return user

    return {"token": generate_token(user)}


@router.post("/get-users")
def get_users(session=Depends(get_session)):
    users = session.exec(select(User)).all()

    return users


# @app.get("/me")
# def me(user=Depends(get_user)):
#     return user
