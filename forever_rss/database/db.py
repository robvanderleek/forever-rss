from pathlib import Path

from alembic import command
from alembic.config import Config as AlembicConfig
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uvicorn.main import logger

from forever_rss.config import config

_SessionLocal = None


def _get_session_local():
    global _SessionLocal
    if _SessionLocal is None:
        engine = create_engine(config.database_url, pool_size=128, max_overflow=128)
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return _SessionLocal()


def get_session():
    db = _get_session_local()
    try:
        yield db
    finally:
        db.close()


def upgrade_database():
    logger.info('Upgrading database... ')
    alembic_config = AlembicConfig()
    alembic_config.set_main_option('script_location',
                                   Path(__file__).parent.parent.parent.resolve().joinpath('migrations').as_posix())
    alembic_config.set_main_option('sqlalchemy.url', config.database_url)
    command.upgrade(alembic_config, 'head')
    logger.info('done!')
