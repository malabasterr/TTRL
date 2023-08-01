# teams.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


@router.get("/routes/", response_model=list[schemas.Route])
def list_routes(db: Session = Depends(yield_db)):
    # routes = db.query(models.Route).options(
    #     joinedload(models.Route.start_city), joinedload((models.Route.end_city))
    # ).all()

    routes = db.query(models.Route).all()

    return routes


@router.post("/routes/{route_id}/claim/", response_model=schemas.Route)
def claim_route(route_id: int, team_id: int, db: Session = Depends(yield_db)):
    route = db.query(models.Route).get(route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    if route.team_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Route already claimed by another team",
        )

    team = db.query(models.Team).get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    route.team_id = team.id
    db.commit()
    db.refresh(route)
    return route


@router.post("/routes/{route_id}/unclaim/")
def unclaim_route(route_id: int, db: Session = Depends(yield_db)):
    route = db.query(models.Route).get(route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    if route.team_id is None:
        raise HTTPException(status_code=400, detail="Route is not claimed by any team")

    route.team_id = None
    db.commit()
    return {"message": "Route successfully unclaimed"}
