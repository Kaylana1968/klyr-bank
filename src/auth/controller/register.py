from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import select
from database.init import get_session
from database.models import Account, User
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

    currentUser = session.exec(select(User).where(User.email == body.email)).first()
    
    account = Account(
        user_id=currentUser.id, is_activated=True, amount=100, is_main=True
    )

    session.add(account)
    session.commit()
    session.refresh(account)

    return {
        "message": "Your account has been created and your main bank acount has opened with 100€ ", 
        "token": generate_token(user)
    }
