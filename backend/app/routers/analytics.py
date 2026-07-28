from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.services.analytics_service import AnalyticsService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("")
def get_user_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get aggregated analytics for the current user across all URLs."""
    service = AnalyticsService(db)
    return service.get_user_analytics(current_user.id)


@router.get("/{url_id}")
def get_url_analytics(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get detailed analytics for a specific URL."""
    service = AnalyticsService(db)
    return service.get_url_analytics(url_id, current_user.id)
