""" Endpoints del juego """

from fastapi import APIRouter, Query
import random

router = APIRouter(tags=["game"])

@router.get("/rng")
async def numero_aleatorio():
    return { "number": random.randint(0, 36) }
