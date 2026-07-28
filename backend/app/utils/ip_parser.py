from fastapi import Request
from typing import Optional

try:
    from user_agents import parse as ua_parse
    UA_AVAILABLE = True
except ImportError:
    UA_AVAILABLE = False


def get_client_ip(request: Request) -> str:
    """Extract the real client IP, respecting reverse-proxy headers."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def parse_user_agent(user_agent_string: str) -> dict:
    """Parse browser, device, and OS from User-Agent string."""
    if not UA_AVAILABLE or not user_agent_string:
        return {"browser": "Unknown", "device": "Unknown", "os": "Unknown"}

    ua = ua_parse(user_agent_string)
    browser = ua.browser.family or "Unknown"
    os_name = ua.os.family or "Unknown"

    if ua.is_mobile:
        device = "Mobile"
    elif ua.is_tablet:
        device = "Tablet"
    elif ua.is_pc:
        device = "Desktop"
    else:
        device = "Unknown"

    return {"browser": browser, "device": device, "os": os_name}


def get_language(request: Request) -> Optional[str]:
    """Extract primary language from Accept-Language header."""
    lang_header = request.headers.get("Accept-Language", "")
    if lang_header:
        primary = lang_header.split(",")[0].split(";")[0].strip()
        return primary[:10]  # Trim to reasonable length
    return None
