""" Variables de entorno """

from typing import NamedTuple
from . import core


class EnvironmentVars(NamedTuple):
    PRUEBAS: str


env_vars: EnvironmentVars = core.load_environment_args(EnvironmentVars)


__all__ = ('env_vars', 'EnvironmentVars')
