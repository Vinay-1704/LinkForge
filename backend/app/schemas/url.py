from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, List
from datetime import datetime


class URLCreate(BaseModel):
    original_url: str
    custom_alias: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    password: Optional[str] = None
    expires_at: Optional[datetime] = None

    @field_validator("original_url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        return v

    @field_validator("custom_alias")
    @classmethod
    def validate_alias(cls, v):
        if v is not None:
            import re
            if len(v) < 3 or len(v) > 50:
                raise ValueError("Alias must be 3–50 characters")
            if not re.match(r"^[a-zA-Z0-9_-]+$", v):
                raise ValueError("Alias may only contain letters, numbers, hyphens, underscores")
        return v


class URLUpdate(BaseModel):
    original_url: Optional[str] = None
    custom_alias: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    password: Optional[str] = None
    expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    is_favorite: Optional[bool] = None


class URLResponse(BaseModel):
    id: str
    user_id: str
    original_url: str
    short_code: str
    custom_alias: Optional[str] = None
    short_url: str = ""
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    has_password: bool = False
    click_count: int
    expires_at: Optional[datetime] = None
    is_active: bool
    is_favorite: bool
    is_expired: bool = False
    qr_code_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class URLPasswordVerify(BaseModel):
    password: str


class URLListResponse(BaseModel):
    items: List[URLResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
