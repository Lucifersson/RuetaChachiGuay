""" Punto de entrada de la API """

# FastAPI
from fastapi import FastAPI

# Python
import random

# Ruleta
from ruleta.environment import env_vars


app = FastAPI()


@app.get("/")
async def root() -> str:
    return "Funciona"


@app.get("/saldo")
async def generar_saldo_aleatorio() -> float:
    return random.uniform(1000.0, 3000.0)
