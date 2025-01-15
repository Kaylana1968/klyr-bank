from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

class AddTransaction(BaseModel) :
    sender_account_id: UUID
    receiver_account_id: UUID
    amount: float

class MyTransactions(BaseModel) :
    account_id: UUID

class CancelTransaction(BaseModel) :
    id : UUID 
