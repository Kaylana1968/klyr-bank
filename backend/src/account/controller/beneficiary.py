from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlalchemy import and_, or_
from ..model.beneficiary import AddBeneficiary
from src.auth.controller.utils import get_user, verify_password
from database.init import get_session
from database.models import Account, Beneficiary
from uuid import UUID

router = APIRouter()


# Show one account from user by account id
@router.get("/my-beneficiaries/{account_id}")
def get_beneficiaries(
    account_id: str, session=Depends(get_session), user=Depends(get_user)
):
    account: Account = session.get(Account, UUID(account_id))

    beneficiaries: Beneficiary = session.exec(
        select(Beneficiary).where(Beneficiary.account_id == account.id)
    ).all()

    if account.user_id != UUID(user["id"]):
        raise HTTPException(status_code=403, detail="It s not your account!")

    if account == None:
        raise HTTPException(status_code=404, detail="Account not found")

    if account.is_activated == False:
        raise HTTPException(
            status_code=403, detail="Account closed since " + str(account.closed_at)
        )

    to_return = []
    for beneficiary in beneficiaries:
        beneficiary_account: Account = session.get(
            Account, beneficiary.beneficiary_account_id
        )

        to_return.append(beneficiary_account)

    return to_return


# Show one account from user by account id
@router.post("/add-beneficiary")
def add_beneficiary(
    body: AddBeneficiary, session=Depends(get_session), user=Depends(get_user)
):
    account: Account = session.get(Account, body.account_id)

    if account.user_id != UUID(user["id"]):
        raise HTTPException(status_code=403, detail="It s not your account!")

    beneficiary_account: Account = session.exec(
        select(Account).where(Account.iban == body.iban)
    ).first()

    if beneficiary_account == None:
        raise HTTPException(status_code=404, detail="Account not found")

    existingBeneficiary: Beneficiary = session.exec(
        select(Beneficiary).where(
            Beneficiary.account_id == account.id,
            Beneficiary.beneficiary_account_id == beneficiary_account.id,
        )
    ).first()

    if existingBeneficiary != None:
        raise HTTPException(
            status_code=400, detail="It is already one of your beneficiary"
        )

    beneficiary: Beneficiary = Beneficiary(
        account_id=account.id, beneficiary_account_id=beneficiary_account.id
    )

    session.add(beneficiary)
    session.commit()

    return {"detail": "The beneficiary has been added"}
