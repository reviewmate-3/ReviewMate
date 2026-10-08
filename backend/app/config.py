from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = 'development'
    DATABASE_URL: str = 'sqlite:///./reviewmate.db'
    REDIS_URL: str = 'redis://localhost:6379/0'
    JWT_SECRET_KEY: str = 'dev-secret-key'
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    OPENAI_API_KEY: str = ''
    GROQ_API_KEY: str = ''
    AI_PROVIDER: str = 'openai'
    AI_MODEL: str = 'gpt-4o-mini'
    FRONTEND_URL: str = 'http://localhost:3000'
    BACKEND_URL: str = 'http://localhost:8000'
    CORS_ORIGINS: str = 'http://localhost:3000'
    STORAGE_PROVIDER: str = 'local'
    RATE_LIMIT_ENABLED: bool = True
    GOOGLE_REVIEW_PLACEHOLDER: str = 'https://example.com/review'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    @model_validator(mode='after')
    def validate_production_configuration(self):
        if self.APP_ENV.lower() != 'production':
            return self
        if self.DATABASE_URL.startswith('sqlite'):
            raise ValueError('Production requires a PostgreSQL DATABASE_URL.')
        if self.JWT_SECRET_KEY in {'', 'dev-secret-key', 'change-me-in-production'}:
            raise ValueError('Production requires a unique JWT_SECRET_KEY.')
        if self.AI_PROVIDER.lower() == 'openai' and not self.OPENAI_API_KEY:
            raise ValueError('Production OpenAI configuration requires OPENAI_API_KEY.')
        if self.AI_PROVIDER.lower() == 'groq' and not self.GROQ_API_KEY:
            raise ValueError('Production Groq configuration requires GROQ_API_KEY.')
        if not self.CORS_ORIGINS.strip() or '*' in self.CORS_ORIGINS:
            raise ValueError('Production CORS_ORIGINS must list trusted frontend origins.')
        return self


settings = Settings()
