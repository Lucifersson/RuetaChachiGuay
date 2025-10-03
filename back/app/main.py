# FastAPI
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

# Ruleta
from app import env, api


# Punto de entrada de FastAPI
app = FastAPI(
    debug=env.DEBUG,
    title="Ruleta Backend",
    description="Backend para la ruleta"
)


@app.middleware("http")
async def user_authorization(request: Request, call_next):
    if request.url.path.startswith(("/auth")):
        return await call_next(request)

    token = request.headers.get("x-api-token")
    if token is None:
        return JSONResponse(status_code=401, content={ "error": "Falta el token" })
    if not api.check_valid_token(token):
        return JSONResponse(status_code=401, content={ "error": "Token no válido" })

    request.state.user = api.auth_tokens[token]

    return await call_next(request)


# Añadir los routers
for router in api.routers:
    app.include_router(router)
