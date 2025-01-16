from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlalchemy import and_, or_
from src.auth.controller.utils import get_user
from database.init import get_session
from database.models import Account, Transaction
from uuid import UUID
import datetime


router = APIRouter()


# Show one account from user by account id
@router.get("/account/{account_id}")
def show_account(account_id: str, session=Depends(get_session)):
    account: Account = session.exec(
        select(Account).where(Account.id == UUID(account_id))
    ).first()

    if account == None:
        return {"message": "Account not found"}

    elif account.closed_at != None:
        return {"message": "Account closed since " + str(account.closed_at)}

    else:
        return account


# Show all accounts from user with user token
@router.post("/my-accounts")
def get_accounts(user=Depends(get_user), session=Depends(get_session)):
    accounts = session.exec(
        select(Account)
        .where(Account.user_id == UUID(user["id"]), Account.is_activated)
        .order_by(Account.open_at.desc())
    ).all()

    return accounts


# Open bank account by user id
@router.post("/open-account")
def open_account(user=Depends(get_user), session=Depends(get_session)) -> Account:
    statement = select(Account).where(
        Account.user_id == UUID(user["id"]), Account.is_main
    )
    existing_main_account = session.exec(statement).first()

    is_main_verif = existing_main_account is None
    account = Account(
        user_id=UUID(user["id"]), is_activated=True, amount=0, is_main=is_main_verif
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    return {"message": "Le compte à bien été créer"}


# Close bank account by account id
@router.put("/close-account/{account_id}")
def close_account(
    account_id: str, user=Depends(get_user), session=Depends(get_session)
):

    account: Account = session.exec(
        select(Account).where(Account.id == UUID(account_id))
    ).first()

    if account.is_main == True:
        return {"message": "You can't close the main account"}

    transaction: Transaction = session.exec(
        select(Transaction).where(
            or_(
                Transaction.sender_account_id == UUID(account_id),
                Transaction.receiver_account_id == UUID(account_id),
                Transaction.status == "PENDING",
            )
        )
    ).first()

    if transaction != None and transaction.status == "PENDING":
        return {
            "message": "You can't close the account because a transaction is pending"
        }

    mainAccount: Account = None

    if account.amount > 0:
        mainAccount: Account = session.exec(
            select(Account).where(
                and_(Account.user_id == UUID(user["id"]), Account.closed_at == None)
            )
        ).first()
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

    if mainAccount:
        return {
            "message": "The account has been closed and his amount has been transferred to your main account"
        }
    return {"message": "The account has been closed"}
