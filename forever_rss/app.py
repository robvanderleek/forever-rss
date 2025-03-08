from pathlib import Path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from forever_rss.routes import user, oauth
from forever_rss.security import RequestMiddleware

app = FastAPI(title='Forever RSS Web')
app_api = FastAPI(title='Forever RSS API')
app_api.add_middleware(RequestMiddleware)

app.mount('/api/v1', app_api, name='api')
app.mount('/', StaticFiles(directory=Path(__file__).resolve().parent.joinpath('web', 'dist'), html=True),
          name='static')

app_api.include_router(user.router)
app_api.include_router(oauth.router)
