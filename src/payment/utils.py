from database.models import Account, Transaction
from sqlmodel import select, Session
from database.init import engine


def limit_amount_transaction():
    with Session(engine) as session:
        secondary_accounts = session.exec(select(Account).where(Account.is_main == False)).all()
        for secondary_account in secondary_accounts:
            if secondary_account.amount > 50_000:
                main_account = session.exec(
                    select(Account).where(
                        Account.user_id == secondary_account.user_id,
                        Account.is_main == True
                    )
                ).first()

                if main_account:
                    amount_diff = secondary_account.amount - 50_000

                    transaction = Transaction(
                        sender_account_id=secondary_account.id,
                        receiver_account_id=main_account.id,
                        amount=amount_diff
                    )
                    secondary_account.amount -= amount_diff
                    main_account.amount += amount_diff

                    session.add(transaction)
                    session.add(secondary_account)
                    session.add(main_account)
                    session.commit()
