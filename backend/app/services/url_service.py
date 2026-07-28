from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from app.repositories.url_repo import URLRepository
from app.repositories.analytics_repo import AnalyticsRepository
from app.schemas.url import URLCreate, URLUpdate, URLResponse
from app.models.url import URL
from app.models.user import User
from app.utils.short_code import generate_unique_code
from app.utils.pagination import calc_offset, calc_total_pages
from app.services.qr_service import generate_qr_png
from app.core.security import hash_password, verify_password
from app.core.config import settings


class URLService:
    def __init__(self, db: Session):
        self.url_repo = URLRepository(db)
        self.analytics_repo = AnalyticsRepository(db)

    @property
    def base_url(self) -> str:
        return settings.BASE_URL.rstrip("/")

    def create_url(self, data: URLCreate, user: User) -> URLResponse:
        # Validate custom alias uniqueness
        if data.custom_alias:
            if self.url_repo.short_code_exists(data.custom_alias):
                raise HTTPException(status_code=409, detail="Custom alias already in use")

        short_code = generate_unique_code(self.url_repo)
        password_hash = hash_password(data.password) if data.password else None

        url = self.url_repo.create(
            user_id=user.id,
            original_url=str(data.original_url),
            short_code=short_code,
            custom_alias=data.custom_alias,
            description=data.description,
            category=data.category,
            tags=data.tags or [],
            password_hash=password_hash,
            expires_at=data.expires_at,
        )

        # Auto-generate QR code
        short_url = f"{self.base_url}/r/{url.effective_code}"
        try:
            qr_path = generate_qr_png(short_url, url.id)
            url = self.url_repo.update(url, qr_code_path=qr_path)
        except Exception:
            pass  # QR generation is non-critical

        return self._to_response(url)

    def get_user_urls(
        self,
        user: User,
        page: int = 1,
        page_size: int = 20,
        search: str = None,
        is_active: Optional[bool] = None,
        is_favorite: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_dir: str = "desc",
    ) -> dict:
        skip = calc_offset(page, page_size)
        items, total = self.url_repo.get_by_user(
            user.id, skip, page_size, search, is_active, is_favorite, sort_by, sort_dir
        )
        return {
            "items": [self._to_response(u) for u in items],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": calc_total_pages(total, page_size),
        }

    def get_url(self, url_id: str, user: User) -> URLResponse:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user.id:
            raise HTTPException(status_code=404, detail="URL not found")
        return self._to_response(url)

    def update_url(self, url_id: str, data: URLUpdate, user: User) -> URLResponse:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user.id:
            raise HTTPException(status_code=404, detail="URL not found")

        updates = data.model_dump(exclude_none=True)
        if "password" in updates:
            updates["password_hash"] = hash_password(updates.pop("password"))
        if "custom_alias" in updates and updates["custom_alias"] != url.custom_alias:
            if self.url_repo.short_code_exists(updates["custom_alias"]):
                raise HTTPException(status_code=409, detail="Custom alias already in use")

        return self._to_response(self.url_repo.update(url, **updates))

    def delete_url(self, url_id: str, user: User) -> None:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user.id:
            raise HTTPException(status_code=404, detail="URL not found")
        self.url_repo.delete(url)

    def toggle_favorite(self, url_id: str, user: User) -> URLResponse:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user.id:
            raise HTTPException(status_code=404, detail="URL not found")
        return self._to_response(self.url_repo.update(url, is_favorite=not url.is_favorite))

    def resolve_for_redirect(self, code: str, password: Optional[str] = None) -> URL:
        """Validate a short code for redirection."""
        url = self.url_repo.get_by_short_code(code)
        if not url:
            raise HTTPException(status_code=404, detail="Short URL not found")
        if not url.is_active:
            raise HTTPException(status_code=410, detail="This link is inactive")
        if url.is_expired:
            raise HTTPException(status_code=410, detail="This link has expired")
        if url.password_hash:
            if not password or not verify_password(password, url.password_hash):
                raise HTTPException(status_code=401, detail="Password required or incorrect")
        return url

    def regenerate_qr(self, url_id: str, user: User) -> URLResponse:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user.id:
            raise HTTPException(status_code=404, detail="URL not found")
        short_url = f"{self.base_url}/r/{url.effective_code}"
        qr_path = generate_qr_png(short_url, url.id)
        return self._to_response(self.url_repo.update(url, qr_code_path=qr_path))

    def _to_response(self, url: URL) -> URLResponse:
        """Convert ORM URL object to a validated URLResponse Pydantic model."""
        effective_code = url.effective_code
        short_url = f"{self.base_url}/r/{effective_code}"
        qr_code_url = f"{self.base_url}/urls/{url.id}/qr"
        return URLResponse(
            id=url.id,
            user_id=url.user_id,
            original_url=url.original_url,
            short_code=url.short_code,
            custom_alias=url.custom_alias,
            short_url=short_url,
            description=url.description,
            category=url.category,
            tags=url.tags or [],
            has_password=bool(url.password_hash),
            click_count=url.click_count,
            expires_at=url.expires_at,
            is_active=url.is_active,
            is_favorite=url.is_favorite,
            is_expired=url.is_expired,
            qr_code_url=qr_code_url,
            created_at=url.created_at,
            updated_at=url.updated_at,
        )
