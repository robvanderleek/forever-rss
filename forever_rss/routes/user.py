from uuid import uuid4

from fastapi import APIRouter

from forever_rss.schemas.FeedSchema import FeedSchema
from forever_rss.schemas.UserSchema import UserSchema
from forever_rss.security import get_request_access_token
from forever_rss.services import github

router = APIRouter()


@router.get("/user/current")
def get_current_user() -> UserSchema:
    token = get_request_access_token()
    return github.get_current_user(token)


@router.get("/user/feeds")
def get_feeds() -> list[FeedSchema]:
    return [FeedSchema(id=uuid4(), title='The Daily WTF', url='http://syndication.thedailywtf.com/TheDailyWtf'), ]
