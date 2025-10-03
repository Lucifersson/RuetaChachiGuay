# Python
from dataclasses import dataclass
import uuid
import random
import itertools

# FastAPI
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

# Ruleta
from app.utils.passwords import make_password, check_password

# Modelos
@dataclass
class User:
    username: str
    password: str
    credits: float


@dataclass
class Tirada:
    id: int
    username: str
    numero: int
tirada_id_gen = itertools.count()


@dataclass
class Apuesta:
    id: int
    tirada_id: int
    username: str
    casilla: int
    apuesta: float
apuesta_id_gen = itertools.count()


usuarios_existentes: dict[str, User] = {}
auth_tokens: dict[str, User] = {}
tiradas: dict[int, Tirada] = {}
apuestas: dict[int, Apuesta] = {}


# Schemas
class UserCredentials(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=5, max_length=80)


class ApuestaCasilla(BaseModel):
    casilla: int
    dinero: float


class ApuestaData(BaseModel):
    apuestas: list[ApuestaCasilla]


def check_valid_token(token: str) -> bool: return token in auth_tokens
def get_user(token: str) -> User: return auth_tokens[token]

# Rutas de AUTH
auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", name="User Login", description="Inica sesión en una cuenta de usuario")
async def login_user(credentials: UserCredentials):
    user = usuarios_existentes.get(credentials.username)
    if user is None or not check_password(credentials.password, user.password):
        return HTTPException(status_code=401, detail="Credencials no válidas")

    token = uuid.uuid4().hex
    auth_tokens[token] = user

    return { "token": token }


@auth_router.post("/register", name="Registrar Usuario", description="Crea una nueva cuenta de usuario")
async def register_user(credentials: UserCredentials):
    username = credentials.username

    if username in usuarios_existentes:
        raise HTTPException(status_code=401, detail="El usuario ya existe.")
    usuarios_existentes[username] = User(username, make_password(credentials.password), 1000)
    return { "status": "Usuario creado" }


@auth_router.delete("/logout/{token}", name="Cerrar sesión", description="Elimina el token de autenticación")
async def logout_user(token: str):
    if token in auth_tokens:
        del auth_tokens[token]


@auth_router.get("/check/{token}", name="Check", description="Comprueba si el token de inicio de sesión es válido")
async def check_token(token: str):
    return { "status": token in auth_tokens }


# Router Ruleta
ruleta_router = APIRouter(prefix="/ruleta", tags=["ruleta"])


@ruleta_router.post("/girar", name="Girar Ruleta", description="Gira la ruleta, realiza una apuesta y devuelve el nuevo saldo.")
async def girar_ruleta(datos_apuestas: ApuestaData, request: Request):
    user: User = request.state.user
    saldo = user.credits

    total_apuesta = sum(
        apuesta.dinero
        for apuesta in datos_apuestas.apuestas
    )
    if total_apuesta > saldo:
        raise HTTPException(status_code=401, detail="No hay suficiente saldo")

    bets = { apuesta.casilla: apuesta.dinero for apuesta in datos_apuestas.apuestas }

    numero = random.randint(0, 36)

    tirada = Tirada(next(tirada_id_gen), user.username, numero)
    tiradas[tirada.id] = tirada

    for apuesta in (
        Apuesta(next(apuesta_id_gen), tirada.id, user.username, a.casilla, a.dinero)
        for a in datos_apuestas.apuestas
    ):
        apuestas[apuesta.id] = apuesta

    if num_apuesta := bets.get(numero, 0):
        user.credits += num_apuesta * 37

    if numero != 0:
        user.credits += bets.get(40 if numero < 19 else 45, 0) * 2
        user.credits += bets.get(37 if numero < 13 else 38 if numero < 25 else 39, 0) * 3
        user.credits += bets.get(41 if numero % 2 == 0 else 44, 0) * 2
        user.credits += bets.get(42 if numero % 2 == 1 else 43, 0) * 2

    user.credits -= total_apuesta

    return { "numero": numero, "saldo": user.credits }


# Routers
routers = (auth_router, ruleta_router)
