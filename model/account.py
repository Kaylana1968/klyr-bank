from typing import Optional
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from user import User


class Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True, foreign_key=User.id)
    name: Optional[str] = Field()
    is_activated: bool = Field()
    amount: float = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_main: bool = Field()
    desactivated_at: Optional[datetime] = Field()
