from fastapi import APIRouter
from fastapi_utilities import repeat_every
from sqlmodel import Session

from database.init import engine
from .payment.utils import limit_amount_transaction

router = APIRouter()

@router.on_event("startup")
@repeat_every(seconds=5)
async def limit_amount_transaction_cron_job():
    with Session(engine) as session:
        limit_amount_transaction(session)
