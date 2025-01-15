from fastapi import APIRouter, Depends
from sqlmodel import select, or_

from database.init import get_session
from database.models import Account, Transaction
from src.auth.controller.utils import get_user
from ..model.transaction import AddTransaction, MyTransactions

router = APIRouter()


@router.post("/transaction")
def transaction(
    body: AddTransaction, user=Depends(get_user), session=Depends(get_session)
):
    sender_account = session.get(Account, body.sender_account_id)
    receiver_account = session.get(Account, body.receiver_account_id)
    amount = body.amount

    if amount <= 0:
        return {"message": "can't send negative money"}

    if str(sender_account.user_id) != user["id"]:
        return {"message": "The account is not yours!"}

    if receiver_account == None:
        return {"message": "Receiver does not exist!"}

    if sender_account == receiver_account:
        return {"message": "Can t send to the same account!"}

    if sender_account.amount < amount:
        return {"message": "You dont have enough money!"}

    transaction = Transaction(
        sender_account_id=body.sender_account_id,
        receiver_account_id=body.receiver_account_id,
        amount=body.amount,
        status="PENDING",
    )
    sender_account.amount -= amount

    session.add(transaction)
    session.add(sender_account)
    session.commit()
    session.refresh(transaction)
    session.refresh(sender_account)

    return {"message": "The transaction is done"}


@router.post("/my-transactions")
def my_transactions(
    body: MyTransactions, user=Depends(get_user), session=Depends(get_session)
):
    account = session.get(Account, body.account_id)

    if str(account.user_id) != user["id"]:
        return {"message": "The account is not yours!"}

    transactions = session.exec(
        select(Transaction)
        .where(
            or_(
                account.id == Transaction.sender_account_id,
                account.id == Transaction.receiver_account_id,
            )
        )
        .order_by(Transaction.sent_at.desc())
    ).all()

    toReturn = []
    for transaction in transactions:
        # add a transactions response element with a sender if selected account is receiver
        # and with a receiver if selected account is sender
        toReturn.append(
            {
                "sender_account_id": transaction.sender_account_id,
                "amount": transaction.amount,
                "sent_at": transaction.sent_at,
            }
            if transaction.sender_account_id != account.id
            else {
                "receiver_account_id": transaction.receiver_account_id,
                "amount": transaction.amount,
                "sent_at": transaction.sent_at,
            }
        )

    return toReturn
