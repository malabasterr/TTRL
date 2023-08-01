import csv
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import BonusSite, City, Route, Team, User


def seed_data_generic(db: Session, model_cls, data_list, model_cls_kwargs={}):
    try:
        for data in data_list:
            data.update(model_cls_kwargs)
            obj = model_cls(**data)
            db.add(obj)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e


def read_csv_data(csv_file):
    with open(csv_file, newline="") as csvfile:
        csvreader = csv.DictReader(csvfile)
        return [row for row in csvreader]


if __name__ == "__main__":
    db = get_db()

    data_dir = Path(__file__).parent / "data"

    try:
        # Seed teams
        team_data = read_csv_data(data_dir / "teams.csv")
        seed_data_generic(db, Team, team_data)

        # Seed users
        user_data = read_csv_data(data_dir / "users.csv")
        seed_data_generic(db, User, user_data)

        # Seed cities
        city_data = read_csv_data(data_dir / "cities.csv")
        seed_data_generic(db, City, city_data)

        # Seed routes
        route_data = read_csv_data(data_dir / "routes.csv")
        seed_data_generic(db, Route, route_data, model_cls_kwargs={"session": db})

        # Seed bonus sites
        bonus_site_data = read_csv_data(data_dir / "bonus_sites.csv")
        seed_data_generic(db, BonusSite, bonus_site_data)

        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    print("Database Loaded")
