from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.services.auth_service import AuthService
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    RefreshTokenRequest, ProfileUpdate, PasswordChange,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.schemas.common import SuccessResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    service = AuthService(db)
    return service.register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Login and receive access + refresh tokens."""
    service = AuthService(db)
    return service.login(data)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new token pair."""
    service = AuthService(db)
    return service.refresh(data.refresh_token)


@router.post("/logout", response_model=SuccessResponse)
def logout(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Logout by revoking the refresh token."""
    service = AuthService(db)
    service.logout(data.refresh_token)
    return SuccessResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's profile."""
    service = AuthService(db)
    return service.update_profile(current_user, data)


@router.put("/change-password", response_model=SuccessResponse)
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the current user's password."""
    service = AuthService(db)
    service.change_password(current_user, data)
    return SuccessResponse(message="Password changed successfully")


@router.delete("/account", response_model=SuccessResponse)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Permanently delete the current user's account and all associated data."""
    service = AuthService(db)
    service.delete_account(current_user)
    return SuccessResponse(message="Account deleted successfully")


@router.post("/forgot-password", response_model=SuccessResponse)
def forgot_password(data: ForgotPasswordRequest):
    """Request a password reset email (structure only — email not sent in dev)."""
    # TODO: Send reset email via SMTP
    return SuccessResponse(message="If that email exists, a reset link has been sent")


@router.post("/reset-password", response_model=SuccessResponse)
def reset_password(data: ResetPasswordRequest):
    """Reset password using a token (structure only)."""
    # TODO: Validate reset token and update password
    return SuccessResponse(message="Password has been reset successfully")
