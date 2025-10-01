""" Endpoints para auth """
# FastAPI
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field

# Ruleta
from app.constants import USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH

# Router
router = APIRouter(tags=["auth"])

# Schemas
class UserCredentials(BaseModel):
    username: str = Field(min_length=USERNAME_MIN_LENGTH, max_length=USERNAME_MAX_LENGTH)
    password: str = Field(min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)


# Endpoints
@router.post("/login", name="Inicio de sesión", description="Inicia sesión con unas credenciales y devuelve un access token")
async def login(credentials: UserCredentials):
    pass


@router.post("/logout", name="Cerrar sesión", description="Cierra la sesión abierta")
async def logout(request: Request):
    pass


@router.post("/register", name="Registrar un usuario", description="Crea un nuevo usuario en la base de datos con un saldo inicial")
async def register(credentials: UserCredentials):
    pass
