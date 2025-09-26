""" Endpoints del juego """

from fastapi import APIRouter, Query
import random

router = APIRouter(tags=["game"])

@router.get("/rng")
async def numero_aleatorio(
    min_range: int = Query(0, description="Valor mínimo a devolver"),
    max_range: int = Query(100, description="Valor máximo a devolver")
):
    return { "number": random.randint(min(min_range, max_range), max(min_range, max_range)) }
