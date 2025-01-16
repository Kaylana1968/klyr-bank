from uuid import UUID
from sqlmodel import select
from fastapi import APIRouter, Depends, HTTPException
from database.init import get_session
from database.models import User
from .utils import get_user
from ..model.user import UserData

router = APIRouter()

# Show user who s logged in 
@router.get("/me")
def me(user=Depends(get_user), session=Depends(get_session)):
    user_data = session.get(User, UUID(user["id"]))
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return UserData(
        email=user_data.email,
        id=user_data.id,
        created_at=user_data.created_at,
        accounts=user_data.accounts,
    )
