from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime, date
from .utils import iban_generator


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    password: str = Field()
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relation
    accounts: List["Account"] = Relationship(back_populates="user")


class Account(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True, foreign_key="user.id")
    name: Optional[str] = Field()
    type: str = Field()
    is_activated: bool = Field(default=True)
    amount: float = Field(default=0)
    open_at: datetime = Field(default_factory=datetime.utcnow)
    is_main: bool = Field()
    closed_at: Optional[datetime] = Field()
    iban: str = Field(default_factory=iban_generator, unique=True)

    # Relations
    user: "User" = Relationship(back_populates="accounts")
    sent_transactions: List["Transaction"] = Relationship(
        back_populates="sender_account",
        sa_relationship_kwargs={"foreign_keys": "Transaction.sender_account_id"},
    )
    received_transactions: List["Transaction"] = Relationship(
        back_populates="receiver_account",
        sa_relationship_kwargs={"foreign_keys": "Transaction.receiver_account_id"},
    )
    deposits: List["Deposit"] = Relationship(back_populates="account")
    beneficiaries: List["Beneficiary"] = Relationship(
        back_populates="beneficiary_account",
        sa_relationship_kwargs={"foreign_keys": "Beneficiary.beneficiary_account_id"},
    )
    sending_withdrawals: List["Withdrawal"] = Relationship(
        back_populates="sender_account",
        sa_relationship_kwargs={"foreign_keys": "Withdrawal.sender_account_id"},
    )
    receiving_withdrawals: List["Withdrawal"] = Relationship(
        back_populates="receiver_account",
        sa_relationship_kwargs={"foreign_keys": "Withdrawal.receiver_account_id"},
    )


class Transaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_account_id: UUID = Field(foreign_key="account.id", index=True)
    receiver_account_id: UUID = Field(foreign_key="account.id", index=True)
    amount: float = Field()
    status: str = Field(default="PENDING")
    sent_at: datetime = Field(default_factory=datetime.utcnow)

    # Relations
    sender_account: "Account" = Relationship(
        back_populates="sent_transactions",
        sa_relationship_kwargs={"foreign_keys": "Transaction.sender_account_id"},
    )
    receiver_account: "Account" = Relationship(
        back_populates="received_transactions",
        sa_relationship_kwargs={"foreign_keys": "Transaction.receiver_account_id"},
    )


class Deposit(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    account_id: UUID = Field(foreign_key="account.id", index=True)
    amount: float = Field()
    deposited_at: datetime = Field(default_factory=datetime.utcnow)

    # Relations
    account: "Account" = Relationship(back_populates="deposits")


class Beneficiary(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    account_id: UUID = Field(foreign_key="account.id", index=True)
    beneficiary_account_id: UUID = Field(foreign_key="account.id")

    # Relation
    beneficiary_account: Account = Relationship(
        back_populates="beneficiaries",
        sa_relationship_kwargs={"foreign_keys": "Beneficiary.beneficiary_account_id"},
    )


class Withdrawal(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_account_id: UUID = Field(foreign_key="account.id", index=True)
    receiver_account_id: UUID = Field(foreign_key="account.id")
    amount: float = Field()
    interval: str = Field()
    starting_on: date = Field()
    last_sent_at: date | None = Field()
    is_active: bool = Field(default=True)

    # Relations
    sender_account: "Account" = Relationship(
        back_populates="sending_withdrawals",
        sa_relationship_kwargs={"foreign_keys": "Withdrawal.sender_account_id"},
    )
    receiver_account: "Account" = Relationship(
        back_populates="receiving_withdrawals",
        sa_relationship_kwargs={"foreign_keys": "Withdrawal.receiver_account_id"},
    )
