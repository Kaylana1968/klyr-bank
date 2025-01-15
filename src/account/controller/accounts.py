from fastapi import APIRouter, Depends
from uuid import UUID
from sqlmodel import select

from database.init import get_session
from database.models import Account
from src.auth.controller.utils import get_user

router = APIRouter()


@router.post("/my-accounts")
def get_accounts(user=Depends(get_user), session=Depends(get_session)):
    accounts = session.exec(
        select(Account)
        .where(Account.user_id == UUID(user["id"]))
        .order_by(Account.open_at.desc())
    ).all()

    return accounts
