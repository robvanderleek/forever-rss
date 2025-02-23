from enum import Enum

from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(Enum):
    LOCAL = 'local'
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', case_sensitive=False, env_file_encoding='utf-8')
    environment: Environment = Environment.PRODUCTION


config = Settings()
