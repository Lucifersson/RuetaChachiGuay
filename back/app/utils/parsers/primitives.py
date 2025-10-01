""" Conversores de datos entre tipos primitivos. """
# Python
from typing import Type
from collections.abc import Callable

__STR_BOOL_VALUES = {
    # True
    "yes": True,
    "y": True,
    "1": True,
    "si": True,
    "s": True,
    "true": True,
    "t": True,

    # False
    "no": False,
    "n": False,
    "0": False,
    "false": False,
    "f": False
}

def str_to_bool(value: str) -> bool:
    rval: bool | None = __STR_BOOL_VALUES.get(value.lower())
    if rval is None:
        raise ValueError(f"No se puede convertir el valor {value} a bool")
    return rval


STR_PARSERS: dict[Type, Callable[[str], object]] = {
    bool: str_to_bool,
    int: int,
}
