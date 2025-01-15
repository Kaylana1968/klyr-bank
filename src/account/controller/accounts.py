from fastapi import APIRouter, Depends
from uuid import UUID

from database.init import get_session
from database.models import User
from src.auth.controller.utils import get_user

router = APIRouter()


@router.post("/my-accounts")
def get_accounts(user=Depends(get_user), session=Depends(get_session)):
    user_data = session.get(User, UUID(user["id"]))

    return user_data.accounts
