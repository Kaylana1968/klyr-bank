from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from database.init import get_session
from database.models import User
from ..model.user import CreateUser
from .utils import verify_password, generate_token

router = APIRouter()


# Log to an account with password and email
@router.get("/login")
def login(body: CreateUser, session=Depends(get_session)):
    user = session.exec(select(User).where(User.email == body.email)).first()

    if user == None:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password=body.password, hashed_password=user.password):
        raise HTTPException(status_code=400, detail="Password mismatch")

    return generate_token(user)
