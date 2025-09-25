# ruleta-backend
Backend para el proyecto de Proyecto Intermodular

# Instrucciones para ejecutar el proyecto

## Fichero .env

Pirmero tenemos que definir un fichero **.env** para la configuracion.
Todas las variables necesarias están en **.env.example**

## Base de datos

Levantar la base de datos se hace de la siguiente forma:

```bash
$ docker compose -f docker-compose.dev.yml up -d
```

Para parar la base de datos se hace asi:

```bash
$ docker compose -f docker-compose.dev.yml down
```

## Servidor

A la hora de levantar el servidor es recomendable actualizar los paquetes:

```bash
$ pipenv install -d
```

Una vez tengas los paquetes actualizados, es recomendalbe actualizar las tablas de la BBDD:

```bash
$ pipenv run python main.py -c -d
```

> Ten en cuenta que esto borra todas las tablas con su contenido y vuelve a crear las tablas vacías.

> Esto se hace así por que no van a haber muchos cambios en la BBDD y utilizar
> una herramienta de migraciones es más costoso. Si el proyecto crece habrá que
> configurar una herramienta para las migraciones.

Una vez creada los modelos de la base de datos, se ejecuta el servidor así:

```bash
$ pipenv run fastapi dev main.py
```

## Resumen

Crear las variables de entorno en el fichero **.env** y ejecutar lo siguiente:

```bash
$ docker compose -f docker-compose.dev.yml up -d
$ pipenv install -d
$ # pipenv run python main.py -c -d
$ # Si se añade la opcion -d elimina las tablas de la BBDD
$ pipenv run python main.py -c
$ pipenv run fastapi dev main.py
```
