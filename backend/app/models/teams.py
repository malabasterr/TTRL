from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    wallet_euros = Column(Numeric(precision=10, scale=2), default=0)

    # Add foreign key to link users to a team
    users = relationship("User", back_populates="team")
    # Add relationship to link routes to a team (many-to-one)
    claimed_routes = relationship("Route", back_populates="claimed_by_team")
    claimed_bonus_sites = relationship("BonusSite", back_populates="claimed_by_team")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(200), nullable=False, unique=True)
    firstname = Column(String(50), nullable=False)
    surname = Column(String(50), nullable=False)

    team_id = Column(Integer, ForeignKey("teams.id"))
    team = relationship("Team", back_populates="users")
