""" Conexión a la BBDD """
# Python
import os
from collections.abc import AsyncIterator

# Ruleta
from app import env

# 3rd Party
from psycopg import AsyncConnection, AsyncCursor
from psycopg_pool import AsyncConnectionPool


URL = "postgresql+psycopg://{}:{}@{}:{}/{}".format(
    env.POSTGRES_USER,
    env.POSTGRES_PASSWORD,
    env.POSTGRES_HOST,
    env.POSTGRES_PORT,
    env.POSTGRES_DB
)

pool = AsyncConnectionPool(
    conninfo=URL,
    num_workers=os.cpu_count() or 3,
    min_size=1,
    max_size=5,
)


async def get_connection() -> AsyncIterator[AsyncConnection]:
    async with pool.connection() as con:
        yield con


async def get_cursor() -> AsyncIterator[AsyncCursor]:
    async with pool.connection() as con, con.cursor() as cur:
        yield cur
