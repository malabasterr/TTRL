from app import models
from app.db.session import get_db

session = get_db()

# Query all teams from the database
all_teams = session.query(models.Team).all()

# Loop through the teams and print their names (or perform any other desired operations)
for team in all_teams:
    print(team.name)

# Don't forget to close the session when you're done using it
session.close()
