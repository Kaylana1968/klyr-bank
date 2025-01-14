from pydantic import BaseModel
from uuid import UUID


class AddDeposit(BaseModel):
    account_id: UUID
    amount: float
