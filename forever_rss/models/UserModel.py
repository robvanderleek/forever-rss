from uuid import uuid4

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from forever_rss.models.base_class import Base


class UserModel(Base):
    __tablename__ = 'user'
    uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    githubLogin = Column(String(128), unique=True, primary_key=True)
    email = Column(String(128))
    name = Column(String(128))
    avatarUrl = Column(String(128))
