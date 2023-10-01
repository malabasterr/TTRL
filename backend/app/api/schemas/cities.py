from app.api.schemas.base import TTRLBase


class City(TTRLBase):
    location_name: str
    name: str
    country: str
    is_starter_city: bool
    latitude: float
    longitude: float
