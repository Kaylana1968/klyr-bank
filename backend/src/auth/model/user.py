from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List


class CreateUser(BaseModel):
    email: str
    password: str


class UserData(BaseModel):
    email: str
    id: UUID
    created_at: datetime
    accounts: List

class ChangePassword(BaseModel):
    password : str
    new_password: str
    confirm_new_password: str
