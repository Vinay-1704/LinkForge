import random
import string
from app.core.config import settings

BASE62_CHARS = string.ascii_letters + string.digits  # 62 chars


def generate_short_code(length: int = None) -> str:
    """Generate a random Base62 short code of specified length."""
    length = length or settings.SHORT_CODE_LENGTH
    return "".join(random.choices(BASE62_CHARS, k=length))


def generate_unique_code(repo, max_attempts: int = 10) -> str:
    """Generate a short code guaranteed to not collide in the database."""
    for _ in range(max_attempts):
        code = generate_short_code()
        if not repo.short_code_exists(code):
            return code
    # Fallback: use longer code on collision
    return generate_short_code(length=settings.SHORT_CODE_LENGTH + 2)
