
from fastapi import APIRouter, Depends
from sqlmodel import select 
from src.auth.controller.utils import get_user
from database.init import get_session
from database.models import Account
from uuid import UUID

router = APIRouter()

@router.post("/account/open")
def open_account(user=Depends(get_user), session=Depends(get_session)) -> Account:
    account = Account(
        user_id= UUID(user["id"]),
        is_activated=True,
        amount= 0,
        is_main=True
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    return {"message": "Le compte à bien été créer"}


# @router.post("/account/close")

@router.get("/account/{account_id}")
def show_account(account_id:str, session=Depends(get_session)) -> Account:
    account = session.exec(select(Account).where(Account.id == UUID(account_id))).first()

    if account == None:
        return {"message":"Account not found"}
    
    if account.closed_at:
        return {"message":"Account closed since "+ account.closed_at}
    
    return account
    #return {"name":account.name,"amount":account.amount,"open_at":account.open_at,"is_main":account.is_main,}
    