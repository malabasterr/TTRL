from typing import Optional

from pydantic import BaseModel, ConfigDict


class BonusSiteBase(BaseModel):
    site_name: str
    claimed_by_team_id: Optional[int]


class BonusSite(BonusSiteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
