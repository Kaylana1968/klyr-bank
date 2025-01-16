from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import select
from database.init import get_session
from database.models import Account, Deposit, User
from ..model.user import CreateUser
from .utils import hash_password, generate_token


router = APIRouter()

# Register to an account by email and password
@router.post("/register")
def register(body: CreateUser, session=Depends(get_session)):
    user: User = User(email=body.email, password=hash_password(body.password))

    account: Account = Account(
        user_id=user.id, amount=100, is_main=True
    )

    deposit: Deposit = Deposit(
        account_id=account.id, amount=100
    )

    session.add(user)
    session.add(account)
    session.add(deposit)
    session.commit()
    session.refresh(user)
    session.refresh(account)
    session.refresh(deposit)

    return {
        "message": "Your account has been created and your main bank acount has opened with 100€ ", 
        "token": generate_token(user)
    }
