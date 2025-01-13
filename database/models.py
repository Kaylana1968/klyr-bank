from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    password: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True, foreign_key=User.id)
    name: Optional[str] = Field()
    is_activated: bool = Field()
    amount: float = Field()
    open_at: datetime = Field(default_factory=datetime.utcnow)
    is_main: bool = Field()
    closed_at: Optional[datetime] = Field()


class Transaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_account_id: UUID = Field(foreign_key=Account.id, index=True)
    receiver_account_id: UUID = Field(foreign_key=Account.id, index=True)
    amount: float = Field()
    status: str = Field()
    sent_at: datetime = Field(default_factory=datetime.utcnow)
