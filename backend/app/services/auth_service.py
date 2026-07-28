from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.user_repo import UserRepository
from app.repositories.token_repo import TokenRepository
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.schemas.user import UserCreate, UserLogin, ProfileUpdate, PasswordChange
from app.models.user import User


class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.token_repo = TokenRepository(db)

    def register(self, data: UserCreate) -> dict:
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        if self.user_repo.get_by_username(data.username):
            raise HTTPException(status_code=400, detail="Username already taken")

        user = self.user_repo.create(
            username=data.username,
            email=data.email,
            password=data.password,
        )
        return self._generate_tokens(user)

    def login(self, data: UserLogin) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is disabled")
        return self._generate_tokens(user)

    def refresh(self, refresh_token: str) -> dict:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        stored = self.token_repo.get_by_token(refresh_token)
        if not stored or stored.is_revoked or stored.is_expired:
            raise HTTPException(status_code=401, detail="Refresh token expired or revoked")

        user = self.user_repo.get_by_id(payload.get("sub"))
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or disabled")

        # Rotate: revoke old, issue new
        self.token_repo.revoke(refresh_token)
        return self._generate_tokens(user)

    def logout(self, refresh_token: str) -> None:
        self.token_repo.revoke(refresh_token)

    def change_password(self, user: User, data: PasswordChange) -> None:
        if not verify_password(data.current_password, user.password_hash):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        self.user_repo.update_password(user, data.new_password)
        # Revoke all refresh tokens on password change for security
        self.token_repo.revoke_all_for_user(user.id)

    def update_profile(self, user: User, data: ProfileUpdate) -> User:
        updates = data.model_dump(exclude_none=True)
        if "email" in updates and updates["email"] != user.email:
            if self.user_repo.get_by_email(updates["email"]):
                raise HTTPException(status_code=400, detail="Email already in use")
        if "username" in updates and updates["username"] != user.username:
            if self.user_repo.get_by_username(updates["username"]):
                raise HTTPException(status_code=400, detail="Username already taken")
        return self.user_repo.update(user, **updates)

    def delete_account(self, user: User) -> None:
        self.token_repo.revoke_all_for_user(user.id)
        self.user_repo.delete(user)

    def _generate_tokens(self, user: User) -> dict:
        payload = {"sub": user.id, "email": user.email, "role": user.role.value}
        access_token = create_access_token(payload)
        refresh_token = create_refresh_token(payload)
        self.token_repo.create(user.id, refresh_token)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user,
        }
