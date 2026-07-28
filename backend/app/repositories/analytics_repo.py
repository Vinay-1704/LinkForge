import uuid
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.analytics import Analytics


class AnalyticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> Analytics:
        record = Analytics(id=str(uuid.uuid4()), **kwargs)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_url(self, url_id: str, skip: int = 0, limit: int = 100) -> List[Analytics]:
        return (
            self.db.query(Analytics)
            .filter(Analytics.url_id == url_id)
            .order_by(desc(Analytics.clicked_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Analytics]:
        return (
            self.db.query(Analytics)
            .filter(Analytics.user_id == user_id)
            .order_by(desc(Analytics.clicked_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_by_url(self, url_id: str) -> int:
        return self.db.query(Analytics).filter(Analytics.url_id == url_id).count()

    def count_by_user(self, user_id: str) -> int:
        return self.db.query(Analytics).filter(Analytics.user_id == user_id).count()

    def count_today(self, user_id: str) -> int:
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        return (
            self.db.query(Analytics)
            .filter(Analytics.user_id == user_id, Analytics.clicked_at >= today)
            .count()
        )

    def count_period(self, user_id: str, days: int) -> int:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        return (
            self.db.query(Analytics)
            .filter(Analytics.user_id == user_id, Analytics.clicked_at >= since)
            .count()
        )

    def daily_clicks(self, user_id: str, days: int = 30) -> List[dict]:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        rows = (
            self.db.query(
                func.date(Analytics.clicked_at).label("date"),
                func.count(Analytics.id).label("clicks"),
            )
            .filter(Analytics.user_id == user_id, Analytics.clicked_at >= since)
            .group_by(func.date(Analytics.clicked_at))
            .order_by(func.date(Analytics.clicked_at))
            .all()
        )
        return [{"date": str(r.date), "clicks": r.clicks} for r in rows]

    def monthly_clicks(self, user_id: str, months: int = 12) -> List[dict]:
        since = datetime.now(timezone.utc) - timedelta(days=months * 30)
        rows = (
            self.db.query(
                func.strftime("%Y-%m", Analytics.clicked_at).label("month"),
                func.count(Analytics.id).label("clicks"),
            )
            .filter(Analytics.user_id == user_id, Analytics.clicked_at >= since)
            .group_by(func.strftime("%Y-%m", Analytics.clicked_at))
            .order_by(func.strftime("%Y-%m", Analytics.clicked_at))
            .all()
        )
        return [{"date": r.month, "clicks": r.clicks} for r in rows]

    def distribution(self, user_id: str, field: str) -> List[dict]:
        col = getattr(Analytics, field, None)
        if col is None:
            return []
        rows = (
            self.db.query(col.label("name"), func.count(Analytics.id).label("value"))
            .filter(Analytics.user_id == user_id, col.isnot(None))
            .group_by(col)
            .order_by(desc("value"))
            .limit(10)
            .all()
        )
        total = sum(r.value for r in rows)
        return [
            {
                "name": r.name or "Unknown",
                "value": r.value,
                "percentage": round(r.value / total * 100, 1) if total else 0,
            }
            for r in rows
        ]

    def total_platform_clicks(self) -> int:
        return self.db.query(Analytics).count()
