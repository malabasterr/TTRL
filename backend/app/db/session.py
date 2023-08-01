from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base_class import Base

SQLITE_PATH = Path("ttrl.sqlite")
DATABASE_URL = f"sqlite:///./{SQLITE_PATH.name}"


def get_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()


def yield_db():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db_session = SessionLocal()

    try:
        yield db_session
    finally:
        db_session.close()
