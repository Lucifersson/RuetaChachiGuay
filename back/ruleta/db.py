""" Inicializa el ORM y crea las tablas """

# Ruleta
from .environment import env_vars as env
# Importar los modelos para que se carguen en la metadata de SQLModel
# y se puedan crear las tablas en la BBDD
from . import models as _

# Python
from collections.abc import Iterator

# FastAPI
from sqlmodel import SQLModel, create_engine, Session


engine = create_engine(
    f"postgresql+psycopg://{env.POSTGRES_USER}:{env.POSTGRES_PASSWORD}@{env.POSTGRES_HOST}:{env.POSTGRES_PORT}/{env.POSTGRES_DB}",
    echo=env.DEBUG
)

SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session

__all__ = ('get_session',)
