from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api import schemas
from app.api.routes.teams import get_team_from_db, get_user_from_db
from app.db.session import yield_db

router = APIRouter()


# TODO: Use the header to get the user_id instead!
@router.get("/user-locations/{user_id}", response_model=list[schemas.UserLocation])
def get_user_locations(user_id: UUID, db: Session = Depends(yield_db)):
    current_user = get_user_from_db(user_id, db)

    current_time = datetime.now(timezone.utc)
    print(current_time)
    valid_share_requests = (
        db.query(models.LocationShareRequest)
        .filter(
            models.LocationShareRequest.request_team_id == current_user.team_id,
            models.LocationShareRequest.request_start_time <= current_time,
            models.LocationShareRequest.request_end_time >= current_time,
        )
        .all()
    )

    print(valid_share_requests)

    valid_location_team_ids = [share_request.location_team_id for share_request in valid_share_requests]
    valid_location_team_ids.append(current_user.team_id)
    print(valid_location_team_ids)

    valid_location_user_ids = db.query(models.User).filter(models.User.team_id.in_(valid_location_team_ids)).all()
    print(valid_location_user_ids)

    locations = [
        db.query(models.UserLocation)
        .filter(
            models.UserLocation.user_id == tracking_user.id,
        )
        .order_by(models.UserLocation.logged_time.desc())
        .first()
        for tracking_user in valid_location_user_ids
    ]
    locations = [schemas.UserLocation.model_validate(location) for location in locations if location is not None]

    return locations


@router.post("/user-locations/request/")
def request_location_sharing(location_share_request: schemas.LocationShareRequest, db: Session = Depends(yield_db)):
    requesting_user = get_user_from_db(location_share_request.user_id, db)
    requested_team = get_team_from_db(location_share_request.request_team_id, db)

    if requesting_user.team_id == requested_team.id:
        return {"message": "You cannot request your own team's location"}

    current_time = datetime.now(timezone.utc)

    existing_request = (
        db.query(models.LocationShareRequest)
        .filter(
            models.LocationShareRequest.request_team_id == requesting_user.team_id,
            models.LocationShareRequest.location_team_id == requested_team.id,
            models.LocationShareRequest.request_start_time <= current_time,
            models.LocationShareRequest.request_end_time >= current_time,
        )
        .first()
    )

    if existing_request:
        return {"message": "Location sharing request already exists"}

    start_time = current_time - timedelta(minutes=5)
    end_time = current_time + timedelta(minutes=35)

    request = models.LocationShareRequest(
        user_id=requesting_user.id,
        request_team_id=requesting_user.team_id,
        location_team_id=requested_team.id,
        request_start_time=start_time,
        request_end_time=end_time,
    )
    db.add(request)
    db.commit()
    return {"message": "Location sharing request successfully created"}
