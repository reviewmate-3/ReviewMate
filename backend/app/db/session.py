from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import settings

database_url = settings.effective_database_url
connect_args = {'check_same_thread': False} if database_url.startswith('sqlite') else {}
engine_kwargs = {
    'pool_pre_ping': not database_url.startswith('sqlite'),
    'connect_args': connect_args,
}
if database_url.startswith('sqlite'):
    engine_kwargs['poolclass'] = StaticPool
engine = create_engine(database_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
