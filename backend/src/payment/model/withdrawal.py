from datetime import date
from uuid import UUID
from pydantic import BaseModel


class AddWithdrawal(BaseModel):
    account_id: UUID
    iban: str
    amount: float
    starting_on: date
    interval: str
