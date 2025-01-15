from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class Account(BaseModel):
    id: UUID
    user_id: UUID
    name: Optional[str]
    is_activated: bool
    amount: float
    open_at: datetime
    is_main: bool
    closed_at: Optional[datetime]


class OpenAccount(BaseModel):
    user_id: UUID