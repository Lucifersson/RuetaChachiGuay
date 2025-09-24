""" Módulo de autenticación para permitir inicio de sesión """

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(tags=["auth"])


class User(BaseModel):
    username: str
    password: str


@router.post("/register")
async def crear_cuenta(user: User) -> dict[str, str]:
    return { "status": "error", "info": "en construccion" }


@router.post("/login")
async def inicio_sesion(user: User) -> dict[str, str]:
    return { "status": "ok" }
