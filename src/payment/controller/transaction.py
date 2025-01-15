from fastapi import APIRouter, Depends

from database.init import get_session
from database.models import Account, Transaction
from src.auth.controller.utils import get_user
from ..model.transaction import AddTransaction

router = APIRouter()


@router.post("/transaction")
def transaction(body: AddTransaction, user=Depends(get_user), session=Depends(get_session)):
    sender_account = session.get(Account, body.sender_account_id)
    receiver_account = session.get(Account, body.receiver_account_id)
    amount = body.amount

    if amount <= 0:
        return {"message": "can't send negative money"}

    if str(sender_account.user_id) != user["id"]:
        return {"message": "The account is not yours!"}
    
    if (receiver_account == None):
        return {"message": "Receiver does not exist!"}
    
    if sender_account == receiver_account : 
        return {"message": "Can t send to the same account!"}
    
    if sender_account.amount < amount :
        return {"message": "You dont have enough money!"}

    transaction = Transaction(sender_account_id=body.sender_account_id, receiver_account_id=body.receiver_account_id, amount=body.amount, status="PENDING")
    sender_account.amount -= amount
    receiver_account.amount += amount

    session.add(transaction)
    session.add(sender_account)
    session.add(receiver_account)
    session.commit()
    session.refresh(transaction)
    session.refresh(sender_account)    
    session.refresh(receiver_account) 

    return {"message": "The transaction is done"}
