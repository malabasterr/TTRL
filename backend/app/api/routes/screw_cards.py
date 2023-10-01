import random
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_team_from_db
from app.db.session import yield_db

router = APIRouter()


def get_screw_card_from_db(screw_card_id: UUID, db: Session):
    screw_card = db.query(models.ScrewCard).filter(models.ScrewCard.id == screw_card_id).first()
    if screw_card is None:
        raise HTTPException(status_code=404, detail="Screw card not found")

    return screw_card


@router.get("/screw-cards/", response_model=list[schemas.ScrewCard])
def list_screw_cards(db: Session = Depends(yield_db)):
    screw_cards = db.query(models.ScrewCard).all()
    return screw_cards


@router.get("/screw-cards/{screw_card_id}", response_model=schemas.ScrewCard)
def get_screw_card(screw_card_id: UUID, db: Session = Depends(yield_db)):
    screw_card = get_screw_card_from_db(screw_card_id, db)
    return screw_card


@router.post("/screw-cards/draw", response_model=schemas.ScrewCardDraw)
def draw_screw_cards(draw_request: schemas.ClaimRequest, db: Session = Depends(yield_db)):
    team = get_team_from_db(draw_request.team_id, db)

    screw_cards = db.query(models.ScrewCard).all()

    drawn_card = random.choice(screw_cards)

    new_draw = models.ScrewCardDraw(
        screw_card_id=drawn_card.id,
        team_id=team.id,
        last_updated_user_id=draw_request.user_id,
    )
    db.add(new_draw)
    db.commit()

    drawn_card.draw_time = new_draw.create_time
    drawn_card_response = schemas.ScrewCardDraw.model_validate(drawn_card)

    return drawn_card_response
