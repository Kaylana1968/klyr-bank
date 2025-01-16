from random import randint


def iban_generator():
    start = "FR7692649"
    end = str(randint(0, 999_999_999_999_999_999))

    iban = start + (18 - len(end)) * "0" + end

    return iban
