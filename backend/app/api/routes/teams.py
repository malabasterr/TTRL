from typing import Union
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


def get_team_from_db(team_id: UUID, db: Session):
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    return team


def get_user_from_db(user_id: UUID, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


def parse_claims(claims: Union[models.BonusSiteClaim, models.RouteClaim], attr_name: str):
    claimed_sites = [getattr(claim, attr_name) for claim in claims]
    return claimed_sites


@router.get("/teams/", response_model=list[schemas.Team])
def list_teams(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()

    response_teams = []
    for team in teams:
        response_teams.append(
            schemas.Team(
                id=team.id,
                name=team.name,
                claimed_routes=parse_claims(team.claimed_routes, "route_id"),
                claimed_bonus_sites=parse_claims(team.claimed_bonus_sites, "site_id"),
            )
        )
    return response_teams


@router.get("/users/", response_model=list[schemas.User])
def list_users(db: Session = Depends(yield_db)):
    users = db.query(models.User).all()
    print(users)
    return users


@router.get("/teams/{team_id}/", response_model=schemas.Team)
def get_team(team_id: UUID, db: Session = Depends(yield_db)):
    return get_team_from_db(team_id, db)


@router.get("/teams/{team_id}/routes/", response_model=list[schemas.Route])
def get_team_routes(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)
    return team.claimed_routes


@router.get("/teams/{team_id}/bonus-sites/", response_model=list[schemas.BonusSite])
def get_team_sites(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)
    return team.claimed_bonus_sites


@router.get("/teams/{team_id}/users/", response_model=list[schemas.User])
def get_team_users(team_id: UUID, db: Session = Depends(yield_db)):
    team = get_team_from_db(team_id, db)
    return team.users
