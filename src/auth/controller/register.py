from fastapi import APIRouter, Depends
from database.init import get_session
from database.models import User
from ..model.user import CreateUser
from .utils import hash_password, generate_token


router = APIRouter()

# Register to an account by email and password
@router.post("/register")
def register(body: CreateUser, session=Depends(get_session)):
    user = User(email=body.email, password=hash_password(body.password))
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"token": generate_token(user)}
