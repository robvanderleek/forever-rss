from pydantic import BaseModel


class UserSchema(BaseModel):
    login: str
    avatar_url: str
    name: str