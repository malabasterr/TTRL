from dataclasses import dataclass, field
from itertools import count
from pathlib import Path
from typing import Optional
from uuid import uuid4

import pandas as pd
from fastkml import kml
from geopy.geocoders import Nominatim

STARTER_CITY_ICON = "#icon-1716-9C27B0-nodesc"

PLACE_TYPE_MAP = {
    "city": ["#icon-1716-673AB7-nodesc", STARTER_CITY_ICON],
    "bonus_site": ["#icon-1523-FF5252-nodesc"],
}


def uuid_factory():
    return str(uuid4())


@dataclass
class Coordinates:
    latitude: float
    longitude: float

    def as_lat_lon(self):
        return f"{self.latitude}, {self.longitude}"


@dataclass
class Place:
    location_name: str
    name: str
    country: str
    coordinates: Coordinates
    is_starter_city: bool = False
    int_id: int = field(default_factory=count().__next__)
    id: str = field(default_factory=uuid_factory)


@dataclass
class Route:
    name: str
    start_coordinates: Coordinates
    end_coordinates: Coordinates
    start_city_id: Optional[str] = None
    start_city_int_id: Optional[int] = None
    end_city_id: Optional[str] = None
    end_city_int_id: Optional[int] = None
    int_id: int = field(default_factory=count().__next__)
    id: str = field(default_factory=uuid_factory)


def load_kml_map(kml_file: Path):
    geolocator = Nominatim(user_agent="ttrl")

    with open(kml_file, "rt", encoding="utf-8") as myfile:
        doc = myfile.read()

    k = kml.KML()
    k.from_string(doc)

    features = list(k.features())

    point_list = list(list(features[0].features())[0].features())

    cities = []
    routes = []
    bonus_sites = []

    for point in point_list:
        if "#line" in point.styleUrl:
            this_route = Route(
                name=None,
                start_coordinates=Coordinates(
                    latitude=point.geometry.coords[0][1],
                    longitude=point.geometry.coords[0][0],
                ),
                end_coordinates=Coordinates(
                    latitude=point.geometry.coords[1][1],
                    longitude=point.geometry.coords[1][0],
                ),
            )
            routes.append(this_route)
        elif "#icon" in point.styleUrl:
            this_place = Place(
                location_name=point.name,
                name=None,
                country=None,
                coordinates=Coordinates(
                    latitude=point.geometry.coords[0][1],
                    longitude=point.geometry.coords[0][0],
                ),
            )

            if point.styleUrl == STARTER_CITY_ICON:
                this_place.is_starter_city = True

            try:
                geo_code_result = geolocator.reverse(this_place.coordinates.as_lat_lon(), language="en-US")

                city_keys_to_try = ("city", "town", "municipality", "suburb")
                for key in city_keys_to_try:
                    if key in geo_code_result.raw["address"].keys():
                        city_match = geo_code_result.raw["address"][key]
                        break

                this_place.name = city_match
                this_place.country = geo_code_result.raw["address"]["country"]
            except:  # noqa: E722
                pass

            if this_place.name is None or this_place.country is None:
                raise ValueError(f"Could not find city and country for {this_place.name}")

            if point.styleUrl in PLACE_TYPE_MAP["bonus_site"]:
                bonus_sites.append(this_place)
            elif point.styleUrl in PLACE_TYPE_MAP["city"]:
                cities.append(this_place)
            else:
                raise ValueError(f"Unknown styleUrl: {point.styleUrl}")

        else:
            raise ValueError(f"Unknown styleUrl: {point.styleUrl}")

    # MANUAL CORRECTIONS
    for place in bonus_sites:
        if place.location_name == "Bakken":
            place.name = "Copenhagen"

    for place in cities:
        if place.location_name == "Gare de Saint-Pierre-des-Corps":
            place.name = "Tours"

    cities_df = pd.DataFrame(cities)

    for this_route in routes:
        [start_match] = [place for place in cities if place.coordinates == this_route.start_coordinates]
        [end_match] = [place for place in cities if place.coordinates == this_route.end_coordinates]

        this_route.start_city_id = start_match.id
        this_route.start_city_int_id = start_match.int_id
        this_route.end_city_int_id = end_match.int_id
        this_route.end_city_id = end_match.id

        this_route.name = f"{start_match.name} to {end_match.name}"

    routes_df = pd.DataFrame(routes)

    bonus_sites_df = pd.DataFrame(bonus_sites)

    get_str_lat_lon = lambda x: f"{x['latitude']},{x['longitude']}"  # noqa
    get_lat = lambda x: round(x["latitude"], 6)  # noqa: E731
    get_lon = lambda x: round(x["longitude"], 6)  # noqa: E731

    cities_df["latitude"] = cities_df["coordinates"].apply(get_lat)
    cities_df["longitude"] = cities_df["coordinates"].apply(get_lon)
    cities_df = cities_df.drop(columns=["coordinates"])

    routes_df["start_latitude"] = routes_df["start_coordinates"].apply(get_lat)
    routes_df["start_longitude"] = routes_df["start_coordinates"].apply(get_lon)
    routes_df["end_latitude"] = routes_df["end_coordinates"].apply(get_lat)
    routes_df["end_longitude"] = routes_df["end_coordinates"].apply(get_lon)
    routes_df = routes_df.drop(columns=["start_coordinates", "end_coordinates"])

    bonus_sites_df["latitude"] = bonus_sites_df["coordinates"].apply(get_lat)
    bonus_sites_df["longitude"] = bonus_sites_df["coordinates"].apply(get_lon)
    bonus_sites_df = bonus_sites_df.drop(columns=["coordinates"])

    # cities_df["coordinates"] = cities_df["coordinates"].apply(get_str_lat_lon)
    # routes_df["start_coordinates"] = routes_df["start_coordinates"].apply(get_str_lat_lon)
    # routes_df["end_coordinates"] = routes_df["end_coordinates"].apply(get_str_lat_lon)
    # bonus_sites_df["coordinates"] = bonus_sites_df["coordinates"].apply(get_str_lat_lon)

    return cities_df, routes_df, bonus_sites_df
