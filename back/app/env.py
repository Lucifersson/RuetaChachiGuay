""" Variables de entorno """
# Configuracion postgres
POSTGRES_USER: str
POSTGRES_PASSWORD: str
POSTGRES_DB: str
POSTGRES_HOST: str
POSTGRES_PORT: int

# Configuracion del proyecto
DEBUG: bool

def __load_vars() -> None:
    from app.utils.parsers import STR_PARSERS
    from typing import cast, Type
    import os

    global_vars = globals()

    for vname, vtype in cast(dict[str, Type], __annotations__).items():
        vvalue: str | None = os.getenv(vname)
        if vvalue is None:
            raise RuntimeError(f"No está declarada la variable de entorno {vname} de tipo {vtype.__name__}")

        if vtype == str:
            global_vars[vname] = vvalue
            continue

        parser = STR_PARSERS.get(vtype)
        if parser is None:
            raise RuntimeError(f"Falta un conversor de str a {vtype.__name__}")

        global_vars[vname] = parser(vvalue)

__load_vars()
