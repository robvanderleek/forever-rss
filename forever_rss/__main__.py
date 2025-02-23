import uvicorn

from forever_rss.config import config, Environment


def main():
    local_app = config.environment == Environment.LOCAL
    uvicorn.run('forever_rss.app:app', host='0.0.0.0', port=8080, reload=local_app, reload_dirs=['forever_rss'])
