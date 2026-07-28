import os
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlalchemy.orm import Session
from typing import Optional

from app.database.base import get_db
from app.schemas.url import URLCreate, URLUpdate, URLResponse, URLListResponse
from app.services.url_service import URLService
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.qr_service import (
    generate_qr_png, generate_qr_png_bytes, generate_qr_svg, get_qr_png_bytes
)

router = APIRouter(prefix="/urls", tags=["URLs"])


@router.post("", response_model=URLResponse, status_code=status.HTTP_201_CREATED)
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
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    is_favorite: Optional[bool] = Query(None),
    sort_by: str = Query("created_at"),
    sort_dir: str = Query("desc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List shortened URLs for the current user with pagination and filtering."""
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
    """Get details of a specific URL by ID."""
    service = URLService(db)
    return service.get_url(url_id, current_user)


@router.put("/{url_id}", response_model=URLResponse)
def update_url(
    url_id: str,
    data: URLUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing URL."""
    service = URLService(db)
    return service.update_url(url_id, data, current_user)


@router.delete("/{url_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_url(
    url_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a URL."""
    service = URLService(db)
    service.delete_url(url_id, current_user)


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
    download: bool = Query(False),
    db: Session = Depends(get_db),
):
    """
    Public PNG QR code endpoint.
    Serves existing QR image file or dynamically generates PNG on-the-fly.
    Works natively inside browser <img> tags and direct downloads.
    """
    from app.repositories.url_repo import URLRepository
    from app.core.config import settings

    repo = URLRepository(db)
    url = repo.get_by_id(url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    if url.qr_code_path and os.path.exists(url.qr_code_path):
        try:
            data = get_qr_png_bytes(url.qr_code_path)
        except Exception:
            base_url = settings.BASE_URL.rstrip("/")
            short_url = f"{base_url}/r/{url.effective_code}"
            data = generate_qr_png_bytes(short_url)
    else:
        base_url = settings.BASE_URL.rstrip("/")
        short_url = f"{base_url}/r/{url.effective_code}"
        data = generate_qr_png_bytes(short_url)

    headers = {}
    if download:
        headers["Content-Disposition"] = f"attachment; filename=qr-{url.effective_code}.png"

    return Response(
        content=data,
        media_type="image/png",
        headers=headers,
    )


@router.get("/{url_id}/qr/svg")
def get_qr_svg(
    url_id: str,
    db: Session = Depends(get_db),
):
    """Public SVG QR code endpoint."""
    from app.repositories.url_repo import URLRepository
    from app.core.config import settings

    repo = URLRepository(db)
    url = repo.get_by_id(url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")

    base_url = settings.BASE_URL.rstrip("/")
    short_url = f"{base_url}/r/{url.effective_code}"
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
