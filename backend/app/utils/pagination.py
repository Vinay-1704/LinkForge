import math
from typing import TypeVar, Generic, List, Type
from pydantic import BaseModel

T = TypeVar("T")


def paginate(items: list, page: int, page_size: int) -> dict:
    """Build a pagination response dict from a list."""
    total = len(items)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 1
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def calc_offset(page: int, page_size: int) -> int:
    return (page - 1) * page_size


def calc_total_pages(total: int, page_size: int) -> int:
    return math.ceil(total / page_size) if page_size > 0 else 1
