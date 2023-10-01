from uuid import UUID

from app.api.schemas.base import TTRLBase


# Team
class Team(TTRLBase):
    name: str
    claimed_routes: list[UUID]
    claimed_bonus_sites: list[UUID]


# User
class User(TTRLBase):
    # email: str
    given_name: str
    family_name: str
    team_id: UUID
