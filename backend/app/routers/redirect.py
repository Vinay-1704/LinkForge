from fastapi import APIRouter, Depends, Request, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional

from app.database.base import get_db
from app.services.url_service import URLService
from app.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Redirect"])


@router.get("/r/{short_code}")
@router.get("//r/{short_code}")
async def redirect_url(
    short_code: str,
    request: Request,
    password: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Core redirect endpoint.
    Validates the short code, checks expiry/password, records analytics, then redirects.
    Handles both single and double slash URLs cleanly.
    """
    url_service = URLService(db)
    analytics_service = AnalyticsService(db)

    url = url_service.resolve_for_redirect(short_code, password)
    await analytics_service.record_click(url, request)

    return RedirectResponse(url=url.original_url, status_code=302)
