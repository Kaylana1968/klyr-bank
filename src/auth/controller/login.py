from fastapi import APIRouter, Depends
from sqlmodel import select

from database.init import get_session
from database.models import User
from ..model.user import CreateUser
from .utils import verify_password, generate_token

router = APIRouter()


# Log to an account with password and email
@router.post("/login")
def login(body: CreateUser, session=Depends(get_session)):
    user = session.exec(select(User).where(User.email == body.email)).first()

    if user == None:
        return {"message": "User not found"}

    if not verify_password(password=body.password, hashed_password=user.password):
        return {"message": "Password mismatch"}

    return {"token": generate_token(user)}
