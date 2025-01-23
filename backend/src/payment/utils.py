from database.models import Account, Transaction, Withdrawal
from sqlmodel import select
from datetime import datetime, timedelta, date


# If amount of secondary bank account > 50 000 money is redirected to main account
def limit_account_amount(session):
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


# Set status to received if status is pending and five seconds
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


# Send withdrawals if interval of time is exceeded
def send_withdrawal(session):
    withdrawals = session.exec(select(Withdrawal).where(Withdrawal.is_active)).all()
    today = date.today()

    for withdrawal in withdrawals:
        is_first_withdraw = withdrawal.last_sent_at == None

        if is_first_withdraw and withdrawal.starting_on != today:
            continue

        if not is_first_withdraw:
            month_in_interval = "month" in withdrawal.interval
            year_in_interval = "year" in withdrawal.interval

            if not month_in_interval and not year_in_interval:
                continue

            if month_in_interval:
                year = withdrawal.last_sent_at.year
                month = withdrawal.last_sent_at.month + int(withdrawal.interval[0])

                if month > 12:
                    year += 1
                    month = month % 12

                new_date = date(year, month, withdrawal.starting_on.day)
            elif year_in_interval:
                year = withdrawal.last_sent_at.year + int(withdrawal.interval[0])

                new_date = date(
                    year, withdrawal.starting_on.month, withdrawal.starting_on.day
                )

            if new_date > today:
                continue

        if withdrawal.sender_account.amount - withdrawal.amount < 0:
            continue

        transaction = Transaction(
            sender_account_id=withdrawal.sender_account_id,
            receiver_account_id=withdrawal.receiver_account_id,
            amount=withdrawal.amount,
            status="RECEIVED",
        )


        session.add(transaction)
        session.commit()
        session.refresh(transaction)

        transaction.sender_account.amount -= transaction.amount
        transaction.receiver_account.amount += transaction.amount

        withdrawal.last_sent_at = today

        session.add(transaction)
        session.add(withdrawal)
        session.commit()
