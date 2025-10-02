# Python
from typing import NamedTuple
from decimal import Decimal

# Postgres
from psycopg import AsyncCursor


class User(NamedTuple):
    id: int
    username: str
    password: str
    credit: Decimal


async def get_user(db: AsyncCursor, username: str) -> User | None:
    query = await db.execute(
        "SELECT id, username, password, credit FROM user_roulette WHERE username = %s",
        (username,)
    )

    row = await query.fetchone()
    if not row:
        return None

    return User(*row)


def generate_token():
    import uuid
    return uuid.uuid4().hex


async def write_user_token(db: AsyncCursor, user_id: int, token: str) -> None:
    _ = await db.execute(
        "INSERT INTO auth_token(user_id, token) VALUES (%s, %s)",
        (user_id, token)
    )
