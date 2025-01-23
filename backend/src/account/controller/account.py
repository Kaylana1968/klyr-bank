from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlalchemy import and_, or_
from ..model.account import OpenAccount, CloseAccount
from src.auth.controller.utils import get_user, verify_password
from database.init import get_session
from database.models import Account, Transaction, User
from uuid import UUID
import datetime

router = APIRouter()


# Show one account from user by account id
@router.get("/account/{account_id}")
def show_account(account_id: str, session=Depends(get_session), user=Depends(get_user)):
    account: Account = session.exec(
        select(Account).where(Account.id == UUID(account_id))
    ).first()

    if account.user_id != UUID(user["id"]):
        raise HTTPException(status_code=403, detail="It s not your account!")

    if account == None:
        raise HTTPException(status_code=404, detail="Account not found")

    elif account.is_activated == False:
        raise HTTPException(
            status_code=403, detail="Account closed since " + str(account.closed_at)
        )

    else:
        return account
    
    # Show one account from user by account id
@router.get("/account/iban/{iban}")
def show_account(iban: str, session=Depends(get_session), user=Depends(get_user)):
    account: Account = session.exec(
        select(Account).where(Account.iban == iban)
    ).first()

    if account == None:
        raise HTTPException(status_code=404, detail="Account not found")

    elif account.is_activated == False:
        raise HTTPException(
            status_code=403, detail="Account closed since " + str(account.closed_at)
        )

    else:
        return account


# Show all accounts from user with user token
@router.get("/my-accounts")
def get_accounts(user=Depends(get_user), session=Depends(get_session)):
    accounts = session.exec(
        select(Account)
        .where(Account.user_id == UUID(user["id"]), Account.is_activated)
        .order_by(Account.open_at.desc())
    ).all()

    return accounts


# Open bank account by user id
@router.post("/open-account")
def open_account(
    body: OpenAccount, user=Depends(get_user), session=Depends(get_session)
):

    name = body.name if body.name != "" else None

    account = Account(
        user_id=UUID(user["id"]), is_main=False, name=name, type=body.type
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    raise HTTPException(status_code=200, detail="Le compte à bien été créé")


# Close bank account by account id
@router.put("/close-account/{account_id}")
def close_account(
    body: CloseAccount,
    account_id: str,
    user=Depends(get_user),
    session=Depends(get_session),
):
    account: Account = session.get(Account, UUID(account_id))
    user: User = session.get(User, UUID(user["id"]))

    if not verify_password(body.password, user.password):
        raise HTTPException(status_code=403, detail="Password is incorrect")

    if account.is_main == True:
        raise HTTPException(status_code=403, detail="You can't close the main account")

    transaction: Transaction = session.exec(
        select(Transaction).where(
            or_(
                Transaction.sender_account_id == account.id,
                Transaction.receiver_account_id == account.id,
                Transaction.status == "PENDING",
            )
        )
    ).first()

    if transaction != None and transaction.status == "PENDING":
        raise HTTPException(
            status_code=403,
            detail="You can't close the account because a transaction is pending",
        )

    mainAccount: Account = None

    if account.amount > 0:
        mainAccount: Account = session.exec(
            select(Account).where(
                and_(Account.user_id == user.id, Account.is_main == True)
            )
        ).first()

        mainAccount.amount += account.amount
        account.amount = 0
        session.add(mainAccount)
        session.commit()
        session.refresh(mainAccount)

    account.closed_at = datetime.datetime.now()
    account.is_activated = False

    session.add(account)
    session.commit()
    session.refresh(account)

    raise HTTPException(status_code=200, detail="The account has been closed")
