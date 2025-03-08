from pydantic import BaseModel

from forever_rss.schemas.UserSchema import UserSchema


class AuthSchema(BaseModel):
    token: str
    user: UserSchema
