from uuid import uuid4

from fastapi import APIRouter

from forever_rss.schemas.FeedSchema import FeedSchema

router = APIRouter()


@router.get("/user/feeds")
def get_feeds() -> list[FeedSchema]:
    return [FeedSchema(id=uuid4(), title='The Daily WTF', url='http://syndication.thedailywtf.com/TheDailyWtf'), ]
