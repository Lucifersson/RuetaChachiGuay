""" Punto de entrada de la API """

# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Python
import random

# Ruleta
from ruleta.environment import env_vars


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        "http://localhost",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ),
    allow_credentials=True,
    allow_methods=("*",),
    allow_headers=("*",),
)


@app.get("/")
async def root() -> str:
    return "Funciona"


@app.get("/saldo")
async def generar_saldo_aleatorio() -> float:
    return random.uniform(1000.0, 3000.0)
