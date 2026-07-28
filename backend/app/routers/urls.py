from fastapi import APIRouter, Depends, Query, Request, Response, HTTPException
from fastapi.responses import FileResponse, StreamingResponse, RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
import io

from app.database.base import get_db
from app.services.url_service import URLService
from app.services.analytics_service import AnalyticsService
from app.services.qr_service import generate_qr_svg, get_qr_png_bytes
from app.schemas.url import URLCreate, URLUpdate, URLResponse, URLListResponse, URLPasswordVerify
from app.schemas.common import SuccessResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/urls", tags=["URLs"])


@router.post("", response_model=URLResponse, status_code=201)
def create_url(
    data: URLCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new shortened URL."""
    service = URLService(db)
    return service.create_url(data, current_user)


@router.get("", response_model=URLListResponse)
def list_urls(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    is_favorite: Optional[bool] = None,
    sort_by: str = Query("created_at", pattern="^(created_at|click_count|original_url)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List URLs for the current user with search, filter, sort, and pagination."""
    service = URLService(db)
    return service.get_user_urls(
        current_user, page, page_size, search, is_active, is_favorite, sort_by, sort_dir
    )


@router.get("/{url_id}", response_model=URLResponse)
def get_url(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single URL by ID."""
    service = URLService(db)
    return service.get_url(url_id, current_user)


@router.put("/{url_id}", response_model=URLResponse)
def update_url(
    url_id: str,
    data: URLUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a URL's properties."""
    service = URLService(db)
    return service.update_url(url_id, data, current_user)


@router.delete("/{url_id}", response_model=SuccessResponse)
def delete_url(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a URL and all its analytics."""
    service = URLService(db)
    service.delete_url(url_id, current_user)
    return SuccessResponse(message="URL deleted successfully")


@router.post("/{url_id}/favorite", response_model=URLResponse)
def toggle_favorite(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle the favorite status of a URL."""
    service = URLService(db)
    return service.toggle_favorite(url_id, current_user)


@router.get("/{url_id}/qr")
def get_qr_png(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download the QR code PNG for a URL (authenticated)."""
    from app.repositories.url_repo import URLRepository
    repo = URLRepository(db)
    url = repo.get_by_id(url_id)
    if not url or url.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="URL not found")
    if not url.qr_code_path:
        raise HTTPException(status_code=404, detail="QR code not found")
    data = get_qr_png_bytes(url.qr_code_path)
    return Response(
        content=data,
        media_type="image/png",
        headers={"Content-Disposition": f"attachment; filename=qr-{url.short_code}.png"},
    )


@router.get("/{url_id}/qr/svg")
def get_qr_svg(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download the QR code SVG for a URL."""
    from app.core.config import settings
    service = URLService(db)
    url = service.get_url(url_id, current_user)
    short_url = f"{settings.BASE_URL}/{url.short_code}"
    svg_bytes = generate_qr_svg(short_url)
    return Response(content=svg_bytes, media_type="image/svg+xml")


@router.post("/{url_id}/qr/regenerate", response_model=URLResponse)
def regenerate_qr(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Regenerate the QR code for a URL."""
    service = URLService(db)
    return service.regenerate_qr(url_id, current_user)
