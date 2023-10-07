from datetime import datetime
from uuid import UUID

from app.api.schemas.base import TTRLBase
from app.api.schemas.generic import ClaimInfo


class BonusSiteBase(TTRLBase):
    site_name: str
    city: str
    country: str
    latitude: float
    longitude: float
    site_value: int


class BonusSite(BonusSiteBase):
    team_claims: list[ClaimInfo] = []


class ClaimedBonusSite(BonusSiteBase):
    claimed_by_user: UUID
    claim_time: datetime
