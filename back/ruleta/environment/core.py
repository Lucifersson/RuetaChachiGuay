""" Módulo para almacenar lo importante sobre las variables de entorno. """

import os
from typing import get_type_hints, TypeVar, Type
from .parsers import PARSERS


T = TypeVar('T')


def load_environment_args(vars_class: Type[T]) -> T:
    vars_dict: dict[str, object] = {}
    vars_type_hints: dict[str, Type] = get_type_hints(vars_class)

    for var_name, var_type in vars_type_hints.items():
        raw_val: str | None = os.getenv(var_name)
        if raw_val is None:
            raise RuntimeError(f'Falta la variable de entorno {var_name} de tipo {var_type.__name__}')

        try:
            vars_dict[var_name] = (PARSERS.get(var_type) or var_type)(raw_val)
        except ValueError as err:
            raise RuntimeError(f'No se pudo convertir el valor de {var_name} a {var_type.__name__}: {str(err)}')

    return vars_class(**vars_dict)

__all__ = ('load_environment_args', )
