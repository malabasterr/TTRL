from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class BonusSite(Base):
    __tablename__ = "bonus_sites"
    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, index=True, unique=True)

    claimed_by_team_id = Column(Integer, ForeignKey("teams.id"))
    claimed_by_team = relationship(
        "Team",
        back_populates="claimed_bonus_sites",
        foreign_keys=[claimed_by_team_id],
    )
