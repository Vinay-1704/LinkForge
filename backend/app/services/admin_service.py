from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.repositories.user_repo import UserRepository
from app.repositories.url_repo import URLRepository
from app.repositories.analytics_repo import AnalyticsRepository
from app.models.user import User
from app.models.url import URL
from app.models.analytics import Analytics
from app.schemas.dashboard import AdminStats, AdminUserItem
from app.utils.pagination import calc_offset, calc_total_pages
from typing import List
from datetime import datetime, timezone


class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.url_repo = URLRepository(db)
        self.analytics_repo = AnalyticsRepository(db)

    def get_stats(self) -> AdminStats:
        total_users = self.db.query(User).count()
        active_users = self.db.query(User).filter(User.is_active == True).count()
        disabled_users = total_users - active_users
        admin_count = self.db.query(User).filter(User.role == "admin").count()
        total_urls = self.db.query(URL).count()
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_urls = self.db.query(URL).filter(URL.created_at >= today).count()
        total_clicks = self.analytics_repo.total_platform_clicks()

        return AdminStats(
            total_users=total_users,
            active_users=active_users,
            disabled_users=disabled_users,
            total_urls=total_urls,
            today_urls=today_urls,
            total_clicks=total_clicks,
            admin_count=admin_count,
        )

    def list_users(self, page: int = 1, page_size: int = 20, search: str = None) -> dict:
        skip = calc_offset(page, page_size)
        users = self.user_repo.get_all(skip, page_size, search)
        total = self.user_repo.count(search)
        items = []
        for u in users:
            url_count = self.db.query(URL).filter(URL.user_id == u.id).count()
            total_clicks = (
                self.db.query(func.sum(URL.click_count))
                .filter(URL.user_id == u.id)
                .scalar() or 0
            )
            items.append(
                AdminUserItem(
                    id=u.id,
                    username=u.username,
                    email=u.email,
                    role=u.role.value,
                    is_active=u.is_active,
                    url_count=url_count,
                    total_clicks=total_clicks,
                    created_at=u.created_at.isoformat(),
                )
            )
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": calc_total_pages(total, page_size),
        }

    def toggle_user_active(self, user_id: str, is_active: bool) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return self.user_repo.set_active(user, is_active)

    def delete_user(self, user_id: str) -> None:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        self.user_repo.delete(user)

    def list_urls(self, page: int = 1, page_size: int = 20, search: str = None) -> dict:
        from app.core.config import settings
        skip = calc_offset(page, page_size)
        items, total = self.url_repo.get_all(skip, page_size, search)
        for url in items:
            url.short_url = f"{settings.BASE_URL}/{url.effective_code}"
            url.has_password = bool(url.password_hash)
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": calc_total_pages(total, page_size),
        }

    def delete_url(self, url_id: str) -> None:
        url = self.url_repo.get_by_id(url_id)
        if not url:
            raise HTTPException(status_code=404, detail="URL not found")
        self.url_repo.delete(url)
