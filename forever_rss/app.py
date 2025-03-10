from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from forever_rss.database.db import upgrade_database
from forever_rss.routes import user, oauth
from forever_rss.security import RequestMiddleware


@asynccontextmanager
async def app_lifespan(_: FastAPI):
    upgrade_database()
    yield


app = FastAPI(title='Forever RSS Web', lifespan=app_lifespan)
app_api = FastAPI(title='Forever RSS API')
app_api.add_middleware(RequestMiddleware)

app.mount('/api/v1', app_api, name='api')


@app.get("/oauth/redirect")
def read_index():
    return FileResponse(Path(__file__).resolve().parent.joinpath('web', 'dist', 'index.html'))


app.mount('/', StaticFiles(directory=Path(__file__).resolve().parent.joinpath('web', 'dist'), html=True),
          name='static')

app_api.include_router(user.router)
app_api.include_router(oauth.router)
