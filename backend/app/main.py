from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api.routes.cities import router as cities_router
from app.api.routes.claimed_distance import router as claimed_distance_router
from app.api.routes.routes import router as routes_router
from app.api.routes.screw_cards import router as screw_cards_router
from app.api.routes.sites import router as sites_router
from app.api.routes.teams import router as teams_router
from app.api.routes.user_locations import router as user_locations_router

# Create the FastAPI application
app = FastAPI(
    title="TTRL",
)

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://xxxx",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams_router, tags=["Teams"])
app.include_router(routes_router, tags=["Routes"])
app.include_router(sites_router, tags=["Sites"])
app.include_router(cities_router, tags=["Cities"])
app.include_router(claimed_distance_router, tags=["Claimed Distance"])
app.include_router(screw_cards_router, tags=["Screw Cards"])
app.include_router(user_locations_router, tags=["User Locations"])


@app.get("/")
async def root():
    return {"message": "Hello World!"}


handler = Mangum(app, lifespan="off")  # , api_gateway_base_path="/api/")
