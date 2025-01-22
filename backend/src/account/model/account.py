from typing import Optional
from pydantic import BaseModel


class OpenAccount(BaseModel):
    name: str
    type: str
