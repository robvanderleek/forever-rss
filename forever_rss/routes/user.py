from fastapi import APIRouter

router = APIRouter()


@router.get("/user/feeds")
def get_feeds():
    return {"feeds": []}
