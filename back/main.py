""" Punto de entrada del backend """

import ruleta.db
import argparse


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser("backend-cfg", description="Configura el backend")
    parser.add_argument("--create-tables", "-c", type=bool, default=True, help="Crea las tablas de la base de datos.")
    parser.add_argument("--drop-tables", "-d", type=bool, default=False, help="Elimina las tablas de la base de datos.")
    return parser.parse_args()


def main() -> None:
    arguments = parse_args()

    if arguments.drop_tables:
        print("Eliminando tablas...")
        ruleta.db.drop_models()

    if arguments.create_tables:
        print("Creando tablas...")
        ruleta.db.create_models()


if __name__ == "__main__":
    main()
else:
    import ruleta.app

    app = ruleta.app.app
