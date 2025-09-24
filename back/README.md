# ruleta-backend
Backend para el proyecto de Proyecto Intermodular

# Guía de arranque del proyecto

## 1. Variables de entorno

Antes de arrancar el servidor, es necesario crear un fichero **.env** en la raíz del proyecto.
En este fichero debes **definir todas las variables** que aparecen en `env.example`, respetando los tipos que ahí se indican.
Ajusta los valores según tu entorno.

---

## 2. Arrancar el servidor

Una vez configurado el `.env` hay que comprobar que los paquetes esten instalados correctamnente.
```bash
$ pipenv install -d
```
Una vez que los paquetes están instalados tienes varias opcioens para arrancar el servidor:

### Opción 1: Entrar al shell de Pipenv

```bash
$ pipenv shell
$ fastapi dev ruleta/main.py
```

### Opción 2: Arrancar el servidor sin entrar a la shell de Pipenv
```bash
$ pipenv run fastapi dev ruleta/main.py
```
