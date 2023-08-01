from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)


class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True)
    route_name = Column(String(200), nullable=False)
    distance = Column(Float, nullable=False)

    # Start city
    start_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    start_city = relationship("City", foreign_keys=[start_city_id])

    # End city
    end_city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    end_city = relationship("City", foreign_keys=[end_city_id])

    # Add relationship to link routes to a team (many-to-one)
    claimed_by_team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    claimed_by_team = relationship(
        "Team",
        back_populates="claimed_routes",
        foreign_keys=[claimed_by_team_id],
    )

    def __init__(
        self,
        session,
        start_city_name,
        end_city_name,
        distance,
        claimed_by_team_id=None,
    ):
        start_city = session.query(City).filter_by(name=start_city_name).first()
        end_city = session.query(City).filter_by(name=end_city_name).first()

        if not start_city or not end_city:
            raise ValueError(
                "City not found. Please make sure both start and end cities exist.",
            )

        self.start_city = start_city
        self.end_city = end_city
        self.distance = distance
        self.route_name = f"{start_city.name} - {end_city.name}"
        self.claimed_by_team_id = claimed_by_team_id
