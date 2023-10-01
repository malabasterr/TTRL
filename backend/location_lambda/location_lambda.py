import datetime
import json
import os
import uuid

from sqlalchemy import Column, DateTime, Float, ForeignKey, create_engine
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


def get_database_uri():
    DB_DATA_KEYS = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]

    template_string = "postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    db_conn_data = {}
    missing_keys = []
    for key in DB_DATA_KEYS:
        if not os.getenv(key):
            missing_keys.append(key)
        else:
            db_conn_data[key] = os.getenv(key)

    if missing_keys:
        raise ValueError(f"Missing environment variables: {missing_keys}")

    db_uri = template_string.format(**db_conn_data)

    db_conn_data["DB_PASSWORD"] = "********"
    print(f"Connecting to {template_string.format(**db_conn_data)}...")

    return db_uri


class UserLocation(Base):
    __tablename__ = "user_location_log"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=False)
    velocity = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    logged_time = Column(DateTime, nullable=False)


# Set up the database connection
engine = create_engine(get_database_uri())
Session = sessionmaker(bind=engine)


def prepare_response(message: str, status_code: int):
    return {"statusCode": status_code, "body": json.dumps({"message": message})}


def handler(event, context):
    if "body" not in event.keys():
        return prepare_response("A body must be passed to this API, containing location information", 200)

    location_event = json.loads(event["body"])

    if "_type" not in location_event.keys():
        return prepare_response("Not logging, no _type field", 200)

    if location_event["_type"] != "location":
        return prepare_response("Not logging, not a location event", 200)

    user_id_str = location_event["topic"].split("/")[-1]
    user_id = uuid.UUID(hex=user_id_str)

    logged_time = datetime.datetime.fromtimestamp(location_event["tst"])

    print(f"Logging location for user {user_id} at {logged_time}")

    location_log = UserLocation(
        latitude=location_event["lat"],
        longitude=location_event["lon"],
        altitude=location_event["alt"],
        velocity=location_event["vel"],
        accuracy=location_event["acc"],
        user_id=user_id,
        logged_time=logged_time,
    )

    # Add the location_log to the database
    session = Session()
    session.add(location_log)
    session.commit()
    session.close()

    return prepare_response("Location Event Logged Successfully", 200)
