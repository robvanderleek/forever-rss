from enum import Enum

from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(Enum):
    LOCAL = 'local'
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', case_sensitive=False, env_file_encoding='utf-8')
    environment: Environment = Environment.PRODUCTION
    client_id: str
    client_secret: str
    jwt_secret: str
    database_url: str = "postgresql://admin:s3cr3t@localhost/foreverrss"


config = Settings()
