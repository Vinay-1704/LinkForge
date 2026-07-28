import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.refresh_token import RefreshToken
from app.core.config import settings


class TokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: str, token: str) -> RefreshToken:
        rt = RefreshToken(
            id=str(uuid.uuid4()),
            user_id=user_id,
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        self.db.add(rt)
        self.db.commit()
        self.db.refresh(rt)
        return rt

    def get_by_token(self, token: str) -> Optional[RefreshToken]:
        return self.db.query(RefreshToken).filter(RefreshToken.token == token).first()

    def revoke(self, token: str) -> None:
        rt = self.get_by_token(token)
        if rt:
            rt.is_revoked = True
            self.db.commit()

    def revoke_all_for_user(self, user_id: str) -> None:
        self.db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id
        ).update({"is_revoked": True})
        self.db.commit()

    def cleanup_expired(self) -> None:
        """Delete old expired or revoked tokens."""
        now = datetime.now(timezone.utc)
        self.db.query(RefreshToken).filter(
            (RefreshToken.expires_at < now) | (RefreshToken.is_revoked == True)
        ).delete()
        self.db.commit()
