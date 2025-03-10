from uuid import uuid4

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from forever_rss.database.crud_user import db_get_user
from forever_rss.database.db import get_session
from forever_rss.schemas.FeedSchema import FeedSchema
from forever_rss.schemas.UserSchema import UserSchema
from forever_rss.security import get_request_sub

router = APIRouter()


@router.get("/user/current", response_model=UserSchema)
def get_current_user(session: Session = Depends(get_session)):
    uuid = get_request_sub()
    return db_get_user(session, uuid)


@router.get("/user/feeds")
def get_feeds() -> list[FeedSchema]:
    return [FeedSchema(id=uuid4(), title='The Daily WTF', url='http://syndication.thedailywtf.com/TheDailyWtf'), ]
