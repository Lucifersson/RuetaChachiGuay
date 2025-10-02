from typing import NamedTuple
from decimal import Decimal


class User(NamedTuple):
    id: int
    username: str
    password: str
    credit: Decimal
