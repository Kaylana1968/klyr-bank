from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class AddBeneficiary(BaseModel):
    account_id: UUID
    iban: str



class CloseAccount(BaseModel):
    password: str
