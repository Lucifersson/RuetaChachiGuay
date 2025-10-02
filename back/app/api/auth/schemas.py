""" Esquemas para peticiones a los endpoints """
# FastAPI
from pydantic import BaseModel, Field

# Ruleta
from app import constants


# Modelos de Requests
class UserCredentials(BaseModel):
    username: str = Field(min_length=constants.USERNAME_MIN_LENGTH, max_length=constants.USERNAME_MAX_LENGTH)
    password: str = Field(min_length=constants.PASSWORD_MIN_LENGTH, max_length=constants.PASSWORD_MAX_LENGTH)


class UserToken(BaseModel):
    token: str
