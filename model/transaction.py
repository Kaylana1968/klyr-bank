from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from account import Account

class Transaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_account_id: UUID = Field(foreign_key=Account.id, index=True)
    receiver_account_id: UUID = Field(foreign_key=Account.id, index=True)
    amount: float = Field()
    status: str = Field()
    sent_at: datetime = Field(default_factory=datetime.utcnow)
