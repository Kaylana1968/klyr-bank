from datetime import date
from uuid import UUID
from pydantic import BaseModel


class AddWithdrawal(BaseModel):
    sender_account_id: UUID
    receiver_account_id: UUID
    amount: float
    starting_on: date
    interval: str
