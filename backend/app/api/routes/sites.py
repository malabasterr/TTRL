# teams.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.db.session import yield_db

router = APIRouter()


@router.get("/bonus-sites/", response_model=list[schemas.BonusSite])
def list_bonus_sites(db: Session = Depends(yield_db)):
    bonus_sites = db.query(models.BonusSite).all()
    print(bonus_sites)
    return bonus_sites


@router.post("/bonus-sites/{site_id}/claim/", response_model=schemas.BonusSite)
def claim_bonus_site(site_id: int, team_id: int, db: Session = Depends(yield_db)):
    site = db.query(models.BonusSite).get(site_id)
    if site is None:
        raise HTTPException(status_code=404, detail="Bonus site not found")
    if site.team_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Bonus site already claimed by another team",
        )

    team = db.query(models.Team).get(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")

    site.team_id = team.id
    db.commit()
    db.refresh(site)
    return site


@router.post("/bonus-sites/{site_id}/unclaim/")
def unclaim_bonus_site(site_id: int, db: Session = Depends(yield_db)):
    site = db.query(models.BonusSite).get(site_id)
    if site is None:
        raise HTTPException(status_code=404, detail="Bonus site not found")
    if site.team_id is None:
        raise HTTPException(
            status_code=400,
            detail="Bonus site is not claimed by any team",
        )

    site.team_id = None
    db.commit()
    return {"message": "Bonus site successfully unclaimed"}
