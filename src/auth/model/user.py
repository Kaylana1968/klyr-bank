from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class User(BaseModel):
    id: UUID
    email: str
    password: str
    created_at: datetime


class CreateUser(BaseModel):
    email: str
    password: str
