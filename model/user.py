from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    password: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)
