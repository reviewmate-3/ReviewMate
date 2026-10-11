from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = 'development'
    APP_VERSION: str = '1.0.0'
    LOG_LEVEL: str = 'INFO'
    DATABASE_URL: str = 'sqlite:///./reviewmate.db'
    SUPABASE_DATABASE_URL: str = ''
    REDIS_URL: str = 'redis://localhost:6379/0'
    JWT_SECRET_KEY: str = 'dev-secret-key'
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    OPENAI_API_KEY: str = ''
    GROQ_API_KEY: str = ''
    AI_PROVIDER: str = 'groq'
    AI_MODEL: str = 'qwen/qwen3.8-27b'
    FRONTEND_URL: str = 'http://localhost:3000'
    BACKEND_URL: str = 'http://localhost:8000'
    CORS_ORIGINS: str = 'http://localhost:3000'
    STORAGE_PROVIDER: str = 'local'
    RATE_LIMIT_ENABLED: bool = True
    GOOGLE_REVIEW_PLACEHOLDER: str = 'https://example.com/review'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    @property
    def effective_database_url(self) -> str:
        url = self.SUPABASE_DATABASE_URL.strip() or self.DATABASE_URL
        if url.startswith('postgres://'):
            return f'postgresql+psycopg://{url[len("postgres://"):]}'
        if url.startswith('postgresql://'):
            return f'postgresql+psycopg://{url[len("postgresql://"):]}'
        return url

    @model_validator(mode='after')
    def validate_production_configuration(self):
        if self.LOG_LEVEL.upper() not in {'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'}:
            raise ValueError('LOG_LEVEL must be a valid Python logging level.')
        if self.APP_ENV.lower() != 'production':
            return self
        if self.effective_database_url.startswith('sqlite'):
            raise ValueError('Production requires SUPABASE_DATABASE_URL or a PostgreSQL DATABASE_URL.')
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
