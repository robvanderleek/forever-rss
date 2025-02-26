from pydantic import BaseModel
from uuid import UUID

class FeedSchema(BaseModel):
    id: UUID
    title: str
    url: str
