""" Endpoints del juego """

from fastapi import APIRouter
import random

router = APIRouter(tags=["game"])

@router.get("/rng")
async def numero_aleatorio(min_range: float | None, max_range: float | None):
    min_range, max_range = min_range or 0.0, max_range or 100.0

    return { "number": random.uniform(min(min_range, max_range), max(min_range, max_range)) }
