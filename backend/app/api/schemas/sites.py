from app.api.schemas.base import TTRLBase
from app.api.schemas.generic import ClaimInfo


class BonusSite(TTRLBase):
    site_name: str
    city: str
    country: str
    latitude: float
    longitude: float
    site_value: int
    team_claims: list[ClaimInfo] = []
