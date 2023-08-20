from fastapi import FastAPI

from app.api.routes.claimed_distance import router as claimed_distance_router
from app.api.routes.routes import router as routes_router
from app.api.routes.sites import router as sites_router
from app.api.routes.teams import router as teams_router

# Create the FastAPI application
app = FastAPI()

app.include_router(teams_router, tags=["Teams"])
app.include_router(routes_router, tags=["Routes"])
app.include_router(sites_router, tags=["Routes"])
app.include_router(claimed_distance_router, tags=["Claimed Distance"])


@app.get("/")
async def root():
    return {"message": "Hello World!"}
