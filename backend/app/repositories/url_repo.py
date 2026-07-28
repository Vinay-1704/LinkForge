import uuid
from typing import Optional, List, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, desc, asc
from app.models.url import URL


class URLRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> URL:
        url = URL(id=str(uuid.uuid4()), **kwargs)
        self.db.add(url)
        self.db.commit()
        self.db.refresh(url)
        return url

    def get_by_id(self, url_id: str) -> Optional[URL]:
        return self.db.query(URL).filter(URL.id == url_id).first()

    def get_by_short_code(self, code: str) -> Optional[URL]:
        """Look up by short_code or custom_alias."""
        return (
            self.db.query(URL)
            .filter(or_(URL.short_code == code, URL.custom_alias == code))
            .first()
        )

    def get_by_alias(self, alias: str) -> Optional[URL]:
        return self.db.query(URL).filter(URL.custom_alias == alias).first()

    def get_by_user(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
        search: str = None,
        is_active: Optional[bool] = None,
        is_favorite: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_dir: str = "desc",
    ) -> Tuple[List[URL], int]:
        query = self.db.query(URL).filter(URL.user_id == user_id)

        if search:
            query = query.filter(
                or_(
                    URL.original_url.ilike(f"%{search}%"),
                    URL.custom_alias.ilike(f"%{search}%"),
                    URL.description.ilike(f"%{search}%"),
                    URL.short_code.ilike(f"%{search}%"),
                )
            )
        if is_active is not None:
            query = query.filter(URL.is_active == is_active)
        if is_favorite is not None:
            query = query.filter(URL.is_favorite == is_favorite)

        total = query.count()

        # Sorting
        sort_col = getattr(URL, sort_by, URL.created_at)
        if sort_dir == "asc":
            query = query.order_by(asc(sort_col))
        else:
            query = query.order_by(desc(sort_col))

        items = query.offset(skip).limit(limit).all()
        return items, total

    def get_all(self, skip: int = 0, limit: int = 50, search: str = None) -> Tuple[List[URL], int]:
        query = self.db.query(URL)
        if search:
            query = query.filter(
                or_(
                    URL.original_url.ilike(f"%{search}%"),
                    URL.short_code.ilike(f"%{search}%"),
                    URL.custom_alias.ilike(f"%{search}%"),
                )
            )
        total = query.count()
        items = query.order_by(desc(URL.created_at)).offset(skip).limit(limit).all()
        return items, total

    def update(self, url: URL, **kwargs) -> URL:
        for key, value in kwargs.items():
            setattr(url, key, value)
        url.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(url)
        return url

    def increment_click(self, url: URL) -> URL:
        url.click_count += 1
        self.db.commit()
        return url

    def delete(self, url: URL) -> None:
        self.db.delete(url)
        self.db.commit()

    def short_code_exists(self, code: str) -> bool:
        return self.db.query(URL).filter(
            or_(URL.short_code == code, URL.custom_alias == code)
        ).count() > 0

    def get_user_stats(self, user_id: str) -> dict:
        now = datetime.now(timezone.utc)
        urls = self.db.query(URL).filter(URL.user_id == user_id).all()
        total = len(urls)
        active = sum(1 for u in urls if u.is_active and not u.is_expired)
        expired = sum(1 for u in urls if u.is_expired)
        qr = sum(1 for u in urls if u.qr_code_path)
        favorites = sum(1 for u in urls if u.is_favorite)
        total_clicks = sum(u.click_count for u in urls)
        return {
            "total_urls": total,
            "active_links": active,
            "expired_links": expired,
            "qr_codes_generated": qr,
            "favorite_urls": favorites,
            "total_clicks": total_clicks,
        }
