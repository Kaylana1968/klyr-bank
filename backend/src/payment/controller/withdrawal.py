from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from database.init import get_session
from database.models import Account, Withdrawal
from src.auth.controller.utils import get_user
from ..model.withdrawal import AddWithdrawal

router = APIRouter()


# Add a withdrawal
@router.post("/add-withdrawal")
def add_withdrawal(
    body: AddWithdrawal, user=Depends(get_user), session=Depends(get_session)
):
    sender_account = session.get(Account, body.sender_account_id)
    receiver_account = session.get(Account, body.receiver_account_id)
    amount = body.amount

    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="You cannot send a negative amount of money."
        )

    if sender_account == None:
        raise HTTPException(
            status_code=404, detail="The sender account has not been found."
        )

    if str(sender_account.user_id) != user.get("id"):
        raise HTTPException(
            status_code=403, detail="The account does not belong to you."
        )

    if receiver_account is None:
        raise HTTPException(status_code=404, detail="Receiver account does not exist.")

    if sender_account == receiver_account:
        raise HTTPException(
            status_code=400, detail="You cannot send money to the same account."
        )

    if receiver_account.is_activated == False:
        raise HTTPException(status_code=400, detail="The receiver's account is closed.")

    if sender_account.is_activated == False:
        raise HTTPException(status_code=400, detail="Your account is closed.")

    withdrawal = Withdrawal(
        sender_account_id=body.sender_account_id,
        receiver_account_id=body.receiver_account_id,
        amount=amount,
        starting_on=body.starting_on,
        interval=body.interval,
    )

    session.add(withdrawal)
    session.commit()

    return {"detail": "The withdrawal is saved"}
