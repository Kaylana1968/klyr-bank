from database.models import Account, Transaction
from sqlmodel import select
from datetime import datetime, timedelta


def limit_amount_transaction(session):
    secondary_accounts = session.exec(
        select(Account).where(Account.is_main == False)
    ).all()
    for secondary_account in secondary_accounts:
        if secondary_account.amount > 50_000:
            main_account = session.exec(
                select(Account).where(
                    Account.user_id == secondary_account.user_id,
                    Account.is_main == True,
                )
            ).first()

            if main_account:
                amount_diff = secondary_account.amount - 50_000

                transaction = Transaction(
                    sender_account_id=secondary_account.id,
                    receiver_account_id=main_account.id,
                    amount=amount_diff,
                )
                secondary_account.amount -= amount_diff
                main_account.amount += amount_diff

                session.add(transaction)
                session.add(secondary_account)
                session.add(main_account)
                session.commit()
                session.refresh(transaction)
                session.refresh(secondary_account)
                session.refresh(main_account)


def update_transaction_status(session):
    pending_transactions = session.exec(
        select(Transaction).where(Transaction.status == "PENDING")
    ).all()

    for transaction in pending_transactions:
        if datetime.utcnow() - timedelta(seconds=5) >= transaction.sent_at:
            receiver_account = session.exec(
                select(Account).where(Account.id == transaction.receiver_account_id)
            ).first()

            transaction.status = "RECEIVED"
            receiver_account.amount += transaction.amount

            session.add(transaction)
            session.add(receiver_account)
            session.commit()
            session.refresh(transaction)
            session.refresh(receiver_account)
