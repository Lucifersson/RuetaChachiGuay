""" Punto de entrada de FastAPI """
# FastAPI
from fastapi import FastAPI

# Ruleta
from app import env


# Crear el punto de entrada de FastAPI
app = FastAPI(
    debug=env.DEBUG,
    title="Ruleta Backend",
    description="Backend para el frontend de la ruleta",
)

# Crear las rutas
# Crear los middlewares


@app.get("/")
async def root():
    return "hola"
