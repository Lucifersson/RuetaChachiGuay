""" Conexion con la base de datos y el pool de conexiones. """
from collections.abc import AsyncIterator
from psycopg_pool import AsyncConnectionPool
from psycopg import AsyncConnection, AsyncCursor
from app import env

URL = "postgres+psycopg://{}:{}@{}:{}/{}".format(
    env.POSTGRES_HOST,
    env.POSTGRES_PASSWORD,
    env.POSTGRES_HOST,
    env.POSTGRES_PORT,
    env.POSTGRES_DB
)

pool = AsyncConnectionPool(
    conninfo=URL,
    min_size=1,
    max_size=5,
)

async def get_session() -> AsyncIterator[AsyncConnection]:
    async with pool.connection() as con:
        yield con


async def get_cursor() -> AsyncIterator[AsyncCursor]:
    async with pool.connection() as con, con.cursor() as cur:
        yield cur
