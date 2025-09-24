""" Punto de entrada de la API """

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root() -> str:
    return "Funciona"
