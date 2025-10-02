from psycopg import AsyncCursor
from app.db.schemas import User
from app.utils.passwords import make_password, check_password
import uuid
from datetime import datetime, timezone

async def get_user(cur: AsyncCursor, username: str) -> User | None:
    rows = await cur.execute(
        "SELECT id, username, password, credit FROM user_roulette WHERE username = %s",
        (username,)
    )
    data = await rows.fetchone()
    if data is None:
        return None
    return User(*data)


async def register_user(cur: AsyncCursor, username: str, password: str) -> None:
    _ = await cur.execute(
        "INSERT INTO user_roulette(username, password) VALUES (%s, %s)",
        (username, make_password(password))
    )


async def login_user(cur: AsyncCursor, username: str, password: str) -> str | None:
    user = await get_user(cur, username)
    if not user or not check_password(password, user.password):
        return None

    token = uuid.uuid4().hex
    current_date = datetime.now(timezone.utc)

    _ = await cur.execute(
        "INSERT INTO auth_token(user_id, token, expiration_date) VALUES (%s, %s, %s)",
        (user.id, token, current_date)
    )

    return token


async def logout_user(cur: AsyncCursor, token: str) -> None:
    _ = await cur.execute(
        "DELETE FROM auth_token WHERE token = %s",
        (token,)
    )
