from fastapi import APIRouter
from fastapi_utilities import repeat_every
from sqlmodel import Session

from database.init import engine
from .payment.utils import limit_account_amount, update_transaction_status

router = APIRouter()

# Repeat every 5 seconds the verification of limits accounts amount
@router.on_event("startup")
@repeat_every(seconds=5)
async def limit_account_amount_cron_job():
    with Session(engine) as session:
        limit_account_amount(session)

# Repeat every second update of transactions status
@router.on_event("startup")
@repeat_every(seconds=10000)
async def update_transaction_status_cron_job():
    with Session(engine) as session:
        update_transaction_status(session)
