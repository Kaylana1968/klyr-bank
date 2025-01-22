from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from database.init import get_session
from database.models import Account, Deposit, User
from ..model.user import CreateUser
from .utils import hash_password, generate_token

router = APIRouter()

# Register to an account by email and password
@router.post("/register")
def register(body: CreateUser, session=Depends(get_session)):
    user_exist = session.exec(select(User).where(User.email == body.email)).first()

    if user_exist:
        raise HTTPException(status_code=404, detail="Email already exist!")

    user: User = User(email=body.email, password=hash_password(body.password))
    account: Account = Account(user_id=user.id, amount=100, is_main=True, name="Main account", type="Current account")
    deposit: Deposit = Deposit(account_id=account.id, amount=100)
    
    session.add(user)
    session.add(account)
    session.add(deposit)
    session.commit()
    session.refresh(user)
    session.refresh(account)
    session.refresh(deposit)

    return generate_token(user)

     