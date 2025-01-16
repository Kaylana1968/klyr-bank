from fastapi import APIRouter, Depends

from database.init import get_session
from database.models import Account, Deposit
from src.auth.controller.utils import get_user
from ..model.deposit import AddDeposit

router = APIRouter()

# Add money in a bank account with account id
@router.post("/deposit")
def deposit(body: AddDeposit, user=Depends(get_user), session=Depends(get_session)):
    account = session.get(Account, body.account_id)
    amount = body.amount

    if amount <= 0:
        return {"message": "can't deposit negative money"}

    if str(account.user_id) != user["id"]:
        return {"message": "The account is not yours!"}

    deposit = Deposit(account_id=account.id, amount=body.amount)
    account.amount += amount

    session.add(deposit)
    session.add(account)
    session.commit()
    session.refresh(deposit)
    session.refresh(account)

    return {"message": "The deposit is done"}
