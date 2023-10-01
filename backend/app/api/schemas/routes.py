from uuid import UUID

from app.api.schemas.base import TTRLBase
from app.api.schemas.generic import ClaimInfo


class Route(TTRLBase):
    name: str
    distance: int

    start_city_id: UUID
    end_city_id: UUID

    team_claims: list[ClaimInfo] = []
