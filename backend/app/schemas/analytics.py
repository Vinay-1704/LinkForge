from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class AnalyticsRecord(BaseModel):
    id: str
    url_id: str
    ip_address: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    browser: Optional[str] = None
    device: Optional[str] = None
    operating_system: Optional[str] = None
    language: Optional[str] = None
    referrer: Optional[str] = None
    clicked_at: datetime

    model_config = {"from_attributes": True}


class ClickStat(BaseModel):
    date: str
    clicks: int


class DistributionStat(BaseModel):
    name: str
    value: int
    percentage: float


class AnalyticsSummary(BaseModel):
    total_clicks: int
    today_clicks: int
    yesterday_clicks: int
    this_week_clicks: int
    this_month_clicks: int
    daily_clicks: List[ClickStat]
    monthly_clicks: List[ClickStat]
    browser_distribution: List[DistributionStat]
    device_distribution: List[DistributionStat]
    os_distribution: List[DistributionStat]
    top_countries: List[DistributionStat]
    top_referrers: List[DistributionStat]


class AnalyticsResponse(BaseModel):
    url_id: str
    summary: AnalyticsSummary
    records: List[AnalyticsRecord]
