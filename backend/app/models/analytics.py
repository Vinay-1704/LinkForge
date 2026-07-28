from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.base import Base


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String(36), primary_key=True, index=True)
    url_id = Column(String(36), ForeignKey("urls.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    ip_address = Column(String(45), nullable=True)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    browser = Column(String(100), nullable=True)
    device = Column(String(100), nullable=True)
    operating_system = Column(String(100), nullable=True)
    language = Column(String(50), nullable=True)
    referrer = Column(Text, nullable=True)
    clicked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    url = relationship("URL", back_populates="analytics")
    user = relationship("User", back_populates="analytics")
