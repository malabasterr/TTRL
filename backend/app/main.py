from fastapi import FastAPI
from mangum import Mangum

from app.api.routes.cities import router as cities_router
from app.api.routes.claimed_distance import router as claimed_distance_router
from app.api.routes.routes import router as routes_router
from app.api.routes.screw_cards import router as screw_cards_router
from app.api.routes.sites import router as sites_router
from app.api.routes.teams import router as teams_router

# Create the FastAPI application
app = FastAPI()

app.include_router(teams_router, tags=["Teams"])
app.include_router(routes_router, tags=["Routes"])
app.include_router(sites_router, tags=["Sites"])
app.include_router(cities_router, tags=["Cities"])
app.include_router(claimed_distance_router, tags=["Claimed Distance"])
app.include_router(screw_cards_router, tags=["Screw Cards"])


@app.get("/")
async def root():
    return {"message": "Hello World!"}


handler = Mangum(app, lifespan="off")
