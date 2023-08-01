# teams.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


@router.get("/teams/", response_model=list[schemas.Team])
def list_teams(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()
    return teams


@router.get("/users/", response_model=list[schemas.User])
def list_users(db: Session = Depends(yield_db)):
    users = db.query(models.User).all()
    print(users)
    return users
