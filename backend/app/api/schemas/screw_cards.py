import datetime

from app.api.schemas.base import TTRLBase


class ScrewCard(TTRLBase):
    title: str
    description: str


class ScrewCardDraw(ScrewCard):
    draw_time: datetime.datetime
