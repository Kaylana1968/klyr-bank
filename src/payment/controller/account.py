
from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlalchemy import or_, and_
from src.auth.controller.utils import get_user
from database.init import get_session
from database.models import Account, Transaction
from uuid import UUID
import datetime


router = APIRouter()

# Récupérer les informations d'un compte bancaire
@router.get("/account/{account_id}")
def show_account(account_id:str, session=Depends(get_session)):
    account : Account = session.exec(select(Account).where(Account.id == UUID(account_id))).first()

    if account == None:
        return {"message":"Account not found"}
    
    elif account.closed_at != None:
        return {"message":"Account closed since " + str(account.closed_at)}
    
    else: return account
    #return {"name":account.name,"amount":account.amount,"open_at":account.open_at,"is_main":account.is_main,}


# Ouvrir un compte bancaire
@router.post("/account/open")
def open_account(user=Depends(get_user), session=Depends(get_session)):
    account = Account(
        user_id= UUID(user["id"]),
        is_activated=True,
        amount= 0,
        is_main=False
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    return {"message": "Your account has been opened"}

# Fermer un compte bancaire  
@router.put("/account/close/{account_id}")
def close_account(account_id: str, user=Depends(get_user), session=Depends(get_session)):

    account: Account = session.exec(select(Account).where(Account.id == UUID(account_id))).first()

    if account.is_main == True:
        return {"message":"You can't close the main account"}
    
    transaction: Transaction = session.exec(select(Transaction).where(or_(Transaction.sender_account_id == UUID(account_id) , Transaction.receiver_account_id == UUID(account_id), Transaction.status == "PENDING"))).first()

    if transaction == True and transaction.status == "PENDING":
        return {"message":"You can't close the account because a transaction is pending"}
    
    mainAccount: Account = None

    if account.amount > 0 :
        mainAccount: Account = session.exec(select(Account).where(and_(Account.user_id == UUID(user["id"]), Account.closed_at == None ))).first()
        if mainAccount == None:
            return {"message": "Not found your main account for transfer your amount"}
        mainAccount.amount += account.amount
        account.amount = 0
        session.add(mainAccount)
        session.commit()
        session.refresh(mainAccount)

    account.closed_at = datetime.datetime.now()

    session.add(account)
    session.commit()
    session.refresh(account)

    if mainAccount :
        return {"message": "The account has been closed and his amount has been transferred to your main account"}    
    return {"message": "The account has been closed"}