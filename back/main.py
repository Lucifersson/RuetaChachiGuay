""" Punto de entrada del backend """

import ruleta.db

def main() -> None:
    print("Eliminando tablas...")
    ruleta.db.drop_models()

    print("Creando tablas...")
    ruleta.db.create_models()


if __name__ == "__main__":
    main()
else:
    import ruleta.app

    app = ruleta.app.app
