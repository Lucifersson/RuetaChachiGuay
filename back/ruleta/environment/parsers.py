""" Conversores de str a otros tipos de dato """

from types import MappingProxyType
from typing import Type
from collections.abc import Callable


__STR_BOOL_VALUES: MappingProxyType[str, bool] = MappingProxyType({
    # Verdadero
    "yes": True,
    "true": True,
    "y": True,
    "si": True,

    # Falso
    "no": False,
    "false": False,
    "n": False,
})


def __str_to_bool(text: str) -> bool:
    return __STR_BOOL_VALUES.get(text, False)


PARSERS: MappingProxyType[Type, Callable[[str], object]] = MappingProxyType({
    bool: __str_to_bool,
})


__all__ = ('PARSERS',)
