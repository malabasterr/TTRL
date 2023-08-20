from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


def calculate_team_claimed_distance(team: schemas.Team, routes=list[schemas.Route]) -> schemas.ClaimedDistance:
    team_distance = 0
    for route in routes:
        if team.id == route.claimed_by_team_id:
            team_distance += route.distance

    return team_distance


@router.get("/claimed-distance/", response_model=list[schemas.ClaimedDistance])
def get_claimed_distance(db: Session = Depends(yield_db)):
    teams = db.query(models.Team).all()

    routes = db.query(models.Route).all()

    claimed_distances = []

    for team in teams:
        team_distance = calculate_team_claimed_distance(team, routes)
        claimed_distance = schemas.ClaimedDistance(
            team_id=team.id,
            team_name=team.name,
            claimed_distance=team_distance,
        )

        claimed_distances.append(claimed_distance)

    return claimed_distances


@router.get("/claimed-distance/{team_id}/", response_model=schemas.ClaimedDistance)
def get_team_claimed_distance(team_id: int, db: Session = Depends(yield_db)):
    team = db.query(models.Team).get(team_id)

    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    routes = db.query(models.Route).all()

    team_distance = calculate_team_claimed_distance(team, routes)
    claimed_distance = schemas.ClaimedDistance(
        team_id=team.id,
        team_name=team.name,
        claimed_distance=team_distance,
    )

    return claimed_distance
