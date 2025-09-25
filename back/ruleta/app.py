""" Punto de entrada de la API """

# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ruleta
from ruleta.environment import env_vars as env
from ruleta.api import auth


# Configurar la app
app = FastAPI(debug=env.DEBUG, title="Ruleta")

# Configurar las rutas
app.include_router(auth.router, prefix="/auth")

# Configurar middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        "http://localhost",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ),
    allow_credentials=True,
    allow_methods=("*",),
    allow_headers=("*",),
)


__all__ = ('app',)
