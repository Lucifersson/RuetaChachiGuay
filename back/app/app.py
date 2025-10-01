""" Punto de entrada de FastAPI """
# FastAPI
from fastapi import FastAPI

# Ruleta
from app import env, api


# Crear el punto de entrada de FastAPI
app = FastAPI(
    debug=env.DEBUG,
    title="Ruleta Backend",
    description="Backend para el frontend de la ruleta",
)

# Crear las rutas
app.include_router(api.auth, prefix="/auth")

# Crear los middlewares


@app.get("/")
async def root():
    return "hola"
