from fastapi import APIRouter
from fastapi_utilities import repeat_every
from .payment.utils import limit_amount_transaction

router = APIRouter()

@router.on_event("startup")
@repeat_every(seconds=5)
async def limit_amount_transaction_cron_job():
    limit_amount_transaction()
