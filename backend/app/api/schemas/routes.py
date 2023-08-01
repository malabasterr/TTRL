from typing import Optional

from pydantic import BaseModel, ConfigDict


class RouteBase(BaseModel):
    route_name: str
    distance: float
    start_city_id: int
    end_city_id: int
    claimed_by_team_id: Optional[int]


class Route(RouteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
