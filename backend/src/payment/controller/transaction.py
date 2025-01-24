from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, or_, and_
from database.init import get_session
from database.models import Account, Transaction
from src.auth.controller.utils import get_user
from ..model.transaction import AddTransaction

router = APIRouter()


# Transfer money to another account with account id
@router.post("/transaction")
def transaction(
    body: AddTransaction, user=Depends(get_user), session=Depends(get_session)
):
    sender_account = session.get(Account, body.sender_account_id)
    receiver_account = session.get(Account, body.receiver_account_id)
    amount = body.amount

    if amount <= 0:
        raise HTTPException(
            status_code=400, detail="You cannot send a negative amount of money."
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

    if sender_account.amount < amount:
        raise HTTPException(
            status_code=400, detail="Insufficient funds in your account."
        )

    if receiver_account.is_activated == False:
        raise HTTPException(status_code=400, detail="The receiver's account is closed.")

    if sender_account.is_activated == False:
        raise HTTPException(status_code=400, detail="Your account is closed.")

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

    return transaction


# Show all transactions and deposits from user by id
@router.get("/my-transactions/{account_id}")
def my_transactions( account_id: str, user=Depends(get_user), session=Depends(get_session)):
    account = session.get(Account, UUID(account_id))

    if str(account.user_id) != user["id"]:
        raise HTTPException(status_code=403, detail="The account is not yours!")

    transactions = account.sent_transactions + account.received_transactions
    deposits = account.deposits

    toReturn = []
    for transaction in transactions:
        # add an element with a sender if selected account is receiver
        # and with a receiver if selected account is sender
        toReturn.append(
            {
                "sender_account_id": transaction.sender_account_id,
                "amount": transaction.amount,
                "done_at": transaction.sent_at,
                "status": transaction.status,
                "is_deposit": False,
            }
            if transaction.sender_account_id != account.id
            else {
                "receiver_account_id": transaction.receiver_account_id,
                "amount": transaction.amount,
                "done_at": transaction.sent_at,
                "status": transaction.status,
                "is_deposit": False,
            }
        )

    for deposit in deposits:
        toReturn.append(
            {
                "amount": deposit.amount,
                "done_at": deposit.deposited_at,
                "is_deposit": True,
            }
        )

    return sorted(toReturn, key=lambda x: x["done_at"], reverse=True)


# Cancel a pending transaction by id
@router.put("/cancel-transaction/{transaction_id}")
def cancel_transaction(
    transaction_id: str, user=Depends(get_user), session=Depends(get_session)
):
    transaction = session.get(Transaction, UUID(transaction_id))

    if str(transaction.sender_account.user_id) != user["id"]:
        raise HTTPException(status_code=403, detail="The account is not yours!")

    if transaction.status == "PENDING":
        transaction.status = "CANCELED"
        transaction.sender_account.amount += transaction.amount

        session.add(transaction)
        session.commit()
        session.refresh(transaction)

        raise HTTPException(
            status_code=200, detail="The transaction has been canceled !"
        )
    else:
        raise HTTPException(
            status_code=200, detail="The transaction is already received"
        )


@router.get("/transaction/{transaction_id}")
def get_transaction(
    transaction_id: str, user=Depends(get_user), session=Depends(get_session)
):
    transaction = session.get(Transaction, UUID(transaction_id))
    user_id = UUID(user["id"])

    if (
        transaction.sender_account.user_id == user_id
        or transaction.receiver_account.user_id == user_id
    ):
        return transaction

    raise HTTPException(status_code=403, detail="It's not your transaction")
