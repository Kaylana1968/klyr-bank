from fastapi import APIRouter
from fastapi_utilities import repeat_every
from sqlmodel import Session

from database.init import engine
from .payment.utils import limit_amount_transaction, update_transaction_status

router = APIRouter()


@router.on_event("startup")
@repeat_every(seconds=5)
async def limit_amount_transaction_cron_job():
    with Session(engine) as session:
        limit_amount_transaction(session)


@router.on_event("startup")
@repeat_every(seconds=1)
async def update_transaction_status_cron_job():
    with Session(engine) as session:
        update_transaction_status(session)
