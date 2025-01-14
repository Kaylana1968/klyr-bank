from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import os
from dotenv import load_dotenv
from sqlmodel import select
from passlib.context import CryptContext

from database.init import get_session
from database.models import User
from ..model.user import CreateUser

router = APIRouter()

load_dotenv()
secret_key = os.getenv("SECRET_KEY")

bearer_scheme = HTTPBearer()
algorithm = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])


def generate_token(user: User):
    return jwt.encode({"id": str(user.id)}, secret_key, algorithm=algorithm)


def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)


def hash_password(password: str):
    return pwd_context.hash(password)


@router.post("/login")
def login(body: CreateUser, session=Depends(get_session)):
    user = session.exec(select(User).where(User.email == body.email)).first()

    if user == None:
        return {"message": "User not found"}
    elif not verify_password(password=body.password, hashed_password=user.password):
        return {"message": "Password mismatch"}

    return {"token": generate_token(user)}


@router.post("/register")
def register(body: CreateUser, session=Depends(get_session)) -> User:
    user = User(email=body.email, password=hash_password(body.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"token": generate_token(user)}


@router.post("/get-users")
def get_users(session=Depends(get_session)):
    users = session.exec(select(User)).all()

    return users


# @app.get("/me")
# def me(user=Depends(get_user)):
#     return user
