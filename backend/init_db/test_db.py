import sys

sys.path.append("..")

from uuid import UUID

from app import models
from app.db.session import get_db

session = get_db()

# Query all teams from the database
all_teams = session.query(models.Team).all()

# Loop through the teams and print their names (or perform any other desired operations)
for team in all_teams:
    print(team.name)


all_routes = session.query(models.Route).all()

# Don't forget to close the session when you're done using it
# session.close()

route_id = UUID("afcc9191-8499-4db8-be05-fb1466bb29f8")
