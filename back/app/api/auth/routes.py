""" Endpoints para autenticación """
# FastAPI
from fastapi import APIRouter, Depends
from fastapi.responses import Response

# Ruleta Auth Schemas
from app.api.auth.schemas import UserCredentials, UserToken

# Ruleta Auth Services
from app.api.auth.services import generate_token, get_user, write_user_token

# Ruleta
from app.db import get_cursor
from app.utils.passwords import check_password

# Router
router = APIRouter(tags=["auth"])


# Endpoints
@router.post("/login")
async def user_login(credentials: UserCredentials, db_cur = Depends(get_cursor)):
    error_response = Response({"error": "Credenciales no válidas"}, 401)

    user = await get_user(db_cur, credentials.username)
    if not user:
        return error_response

    if not check_password(credentials.password, user.password):
        return error_response

    token = generate_token()
    await write_user_token(db_cur, user.id, token)

    return Response({ "token": token }, 200)


@router.post("/logout")
async def user_logout(token: UserToken, db_cur = Depends(get_cursor)):
    pass


@router.post("/register")
async def user_register(credentials: UserCredentials, db_cur = Depends(get_cursor)):
    pass
