from pathlib import Path

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from forever_rss.routes import user

app = FastAPI(title='Forever RSS Web')
app_api = FastAPI(title='Forever RSS API')

app.mount('/api/v1', app_api, name='api')
app.mount('/', StaticFiles(directory=Path(__file__).resolve().parent.joinpath('web', 'dist'), html=True),
          name='static')

app_api.include_router(user.router)
