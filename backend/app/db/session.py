from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import settings

connect_args = {'check_same_thread': False} if settings.DATABASE_URL.startswith('sqlite') else {}
engine_kwargs = {
    'pool_pre_ping': not settings.DATABASE_URL.startswith('sqlite'),
    'connect_args': connect_args,
}
if settings.DATABASE_URL.startswith('sqlite'):
    engine_kwargs['poolclass'] = StaticPool
engine = create_engine(settings.DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
