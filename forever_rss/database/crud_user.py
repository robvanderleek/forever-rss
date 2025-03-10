from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from forever_rss.models.UserModel import UserModel
from forever_rss.schemas.UserSchema import UserCreateSchema


def db_create_user(session: Session, user: UserCreateSchema) -> UserModel:
    db_user = UserModel(uuid=uuid4(), githubLogin=user.githubLogin, email=user.email, name=user.name,
                        avatarUrl=user.avatarUrl)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def db_get_user(session: Session, uuid: str) -> Optional[UserModel]:
    return session.query(UserModel).filter(UserModel.uuid == uuid).first()


def db_get_user_by_github_login(session: Session, github_login: str) -> Optional[UserModel]:
    return session.query(UserModel).filter(UserModel.githubLogin == github_login).first()
