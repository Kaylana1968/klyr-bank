
from fastapi import APIRouter, Depends

from database.init import get_session
from database.models import Account
from ..model.account import OpenAccount

router = APIRouter()

@router.post("/account/open")
def open_account(body: OpenAccount, session=Depends(get_session)) -> Account:
    account = Account(
        user_id= body.user_id,
        is_activated=True,
        amount= 0,
        is_main=True
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    return {"message": "Le compte à bien été créer"}


# @router.post("/account/close")

