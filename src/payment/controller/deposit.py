from fastapi import APIRouter, Depends, HTTPException

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
        raise HTTPException(status_code=400, detail="can't deposit negative money")

    if str(account.user_id) != user["id"]:
        raise HTTPException(status_code=403, detail="The account is not yours!")

    if account.is_activated == False:
        raise HTTPException(status_code=400, detail="Your account is closed.")

    deposit = Deposit(account_id=account.id, amount=body.amount)
    account.amount += amount

    session.add(deposit)
    session.add(account)
    session.commit()
    session.refresh(deposit)
    session.refresh(account)

    raise HTTPException(status_code=200, detail="The deposit is done")
