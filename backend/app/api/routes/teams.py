# teams.py
from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/teams/{team_id}/", response_model=schemas.Team)
def get_team(team_id: int, db: Session = Depends(yield_db)):
    team = db.query(models.Team).get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/teams/{team_id}/routes/", response_model=list[schemas.Route])
def get_team_routes(team_id: int, db: Session = Depends(yield_db)):
    team = db.query(models.Team).get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    routes = db.query(models.Route).filter(models.Route.team_id == team_id).all()
    return routes


@router.get("/teams/{team_id}/users/", response_model=list[schemas.User])
def get_team_users(team_id: int, db: Session = Depends(yield_db)):
    team = db.query(models.Team).get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    users = db.query(models.User).filter(models.User.team_id == team_id).all()
    return users
