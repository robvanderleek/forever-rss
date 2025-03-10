from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserCreateSchema(BaseModel):
    githubLogin: str
    avatarUrl: str
    name: str
    email: str


class UserSchema(UserCreateSchema):
    model_config = ConfigDict(from_attributes=True)
    uuid: UUID
