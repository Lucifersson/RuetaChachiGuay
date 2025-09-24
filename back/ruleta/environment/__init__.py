""" Variables de entorno """

from typing import NamedTuple
from . import core


class EnvironmentVars(NamedTuple):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int

    DEBUG: bool


env_vars: EnvironmentVars = core.load_environment_args(EnvironmentVars)


__all__ = ('env_vars', 'EnvironmentVars')
