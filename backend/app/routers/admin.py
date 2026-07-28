from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.services.admin_service import AdminService
from app.auth.dependencies import get_current_admin
from app.models.user import User
from app.schemas.common import SuccessResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Get admin dashboard statistics."""
    service = AdminService(db)
    stats = service.get_stats()
    users = service.list_users(page=1, page_size=5)
    urls = service.list_urls(page=1, page_size=5)
    return {"stats": stats, "top_users": users["items"], "recent_urls": urls["items"]}


@router.get("/users")
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """List all users with search and pagination."""
    service = AdminService(db)
    return service.list_users(page, page_size, search)


@router.put("/users/{user_id}")
def update_user_status(
    user_id: str,
    is_active: bool,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Enable or disable a user account."""
    service = AdminService(db)
    user = service.toggle_user_active(user_id, is_active)
    return {"message": f"User {'enabled' if is_active else 'disabled'} successfully", "user_id": user_id}


@router.delete("/users/{user_id}", response_model=SuccessResponse)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Permanently delete a user and all their data."""
    service = AdminService(db)
    service.delete_user(user_id)
    return SuccessResponse(message="User deleted successfully")


@router.get("/urls")
def list_all_urls(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """List all URLs on the platform for moderation."""
    service = AdminService(db)
    return service.list_urls(page, page_size, search)


@router.delete("/urls/{url_id}", response_model=SuccessResponse)
def delete_url(
    url_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Delete any URL from the platform."""
    service = AdminService(db)
    service.delete_url(url_id)
    return SuccessResponse(message="URL deleted successfully")
