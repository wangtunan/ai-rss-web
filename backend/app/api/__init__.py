from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.news import router as news_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(news_router)