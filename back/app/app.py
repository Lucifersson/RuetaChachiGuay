""" Punto de entrada de FastAPI """
# FastAPI
from fastapi import FastAPI


app = FastAPI()


@app.get("/")
async def root():
    return "hola"
