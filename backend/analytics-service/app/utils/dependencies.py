from fastapi import Depends
from app.repository.analytics_repository import AnalyticsRepository
from app.service.analytics_service import AnalyticsService
from app.utils.db import get_db

async def get_analytics_service(db_session=Depends(get_db)) -> AnalyticsService:
    analytics_repository = AnalyticsRepository(db_session)
    return AnalyticsService(analytics_repository)
