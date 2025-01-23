from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
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
    sender_account = session.get(Account, body.account_id)
    receiver_account = session.exec(
        select(Account).where(Account.iban == body.iban)
    ).first()
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
        sender_account_id=sender_account.id,
        receiver_account_id=receiver_account.id,
        amount=amount,
        starting_on=body.starting_on,
        interval=body.interval,
    )

    session.add(withdrawal)
    session.commit()

    return {"detail": "The withdrawal is saved"}


@router.get("/my-withdrawals/{account_id}")
def get_withdrawals(
    account_id: str, user=Depends(get_user), session=Depends(get_session)
):
    account: Account = session.get(Account, UUID(account_id))

    if account.user_id != UUID(user["id"]):
        raise HTTPException(status_code=403, detail="It s not your account!")

    if account == None:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.is_activated == False:
        raise HTTPException(
            status_code=403, detail="Account closed since " + str(account.closed_at)
        )

    withdrawals: Withdrawal = session.exec(
        select(Withdrawal).where(Withdrawal.sender_account_id == account.id)
    ).all()

    to_return = []
    for withdrawal in withdrawals:
        sender_account: Account = session.get(Account, withdrawal.sender_account_id)
        receiver_account: Account = session.get(Account, withdrawal.receiver_account_id)

        to_return.append(
            {
                "sender_account": sender_account,
                "receiver_account": receiver_account,
                "amount": withdrawal.amount,
                "starting_on": withdrawal.starting_on,
                "interval": withdrawal.interval,
            }
        )

    return to_return
