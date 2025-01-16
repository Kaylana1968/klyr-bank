from sqlmodel import Session, select
from random import randint

from .init import engine


def iban_generator():
    from .models import Account

    with Session(engine) as session:
        start = "FR7692649"

        while True:
            end = str(randint(0, 999_999_999_999_999_999))

            iban = start + (18 - len(end)) * "0" + end

            existingAccount = session.exec(
                select(Account).where(Account.iban == iban)
            ).first()

            if existingAccount == None:
                break

        return iban
