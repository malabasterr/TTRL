from pydantic import BaseModel, ConfigDict


# Team
class TeamBase(BaseModel):
    name: str


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# User
class UserBase(BaseModel):
    email: str
    firstname: str
    surname: str
    team_id: int


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
