from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import select, or_, and_
from database.init import get_session
from database.models import Account, Transaction
from src.auth.controller.utils import get_user
from ..model.transaction import AddTransaction

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

    if receiver_account.closed_at != None:
        return {"message": "Receiver account is closed"}

    if sender_account.closed_at != None:
        return {"message": "Your account is closed"}

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


@router.post("/my-transactions/{account_id}")
def my_transactions(
    account_id: str, user=Depends(get_user), session=Depends(get_session)
):
    account = session.get(Account, UUID(account_id))

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
                "status": transaction.status,
            }
            if transaction.sender_account_id != account.id
            else {
                "receiver_account_id": transaction.receiver_account_id,
                "amount": transaction.amount,
                "sent_at": transaction.sent_at,
                "status": transaction.status,
            }
        )

    return toReturn


@router.post("/cancel-transaction/{transaction_id}")
def cancel_transaction(
    transaction_id: str, user=Depends(get_user), session=Depends(get_session)
):
    transaction = session.get(Transaction, UUID(transaction_id))

    if str(transaction.sender_account.user_id) != user["id"]:
        return {"message": "The account is not yours!"}

    if transaction.status == "PENDING":
        transaction.status = "CANCELED"
        transaction.sender_account.amount += transaction.amount

        session.add(transaction)
        session.commit()
        session.refresh(transaction)

        return {"message": "The transaction has been canceled !"}

    else:
        return {"message": "The transaction is already received !"}


@router.post("/transaction/{transaction_id}")
def get_transaction(
    transaction_id: str, user=Depends(get_user), session=Depends(get_session)
):
    transaction = session.get(Transaction, UUID(transaction_id))
    user_id = UUID(user["id"])

    # transaction = session.exec(select(Transaction).where(Transaction.id == UUID(transaction_id))).first()
    account: Account = (
        transaction.sender_account
        if transaction.sender_account.user_id == user_id
        else (
            transaction.receiver_account
            if transaction.receiver_account.user_id == user_id
            else None
        )
    )

    if not account :
        return {"message": "It's not your transaction"}
    
    return transaction
