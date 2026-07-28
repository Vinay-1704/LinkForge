import os
import io
import qrcode
from qrcode.image.svg import SvgImage
from app.core.config import settings


def _ensure_upload_dir() -> str:
    upload_dir = os.path.join(settings.UPLOAD_DIR, "qr")
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir


def generate_qr_png(short_url: str, url_id: str) -> str:
    """
    Generate a PNG QR code for the given short URL.
    Returns the relative file path stored in the DB.
    """
    upload_dir = _ensure_upload_dir()
    filename = f"qr_{url_id}.png"
    filepath = os.path.join(upload_dir, filename)

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(short_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filepath)

    return filepath


def generate_qr_png_bytes(short_url: str) -> bytes:
    """Generate a PNG QR code in memory and return as bytes."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(short_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def generate_qr_svg(short_url: str) -> bytes:
    """
    Generate an SVG QR code and return as bytes.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
        image_factory=SvgImage,
    )
    qr.add_data(short_url)
    qr.make(fit=True)

    img = qr.make_image()
    buffer = io.BytesIO()
    img.save(buffer)
    return buffer.getvalue()


def get_qr_png_bytes(filepath: str) -> bytes:
    """Read a saved QR PNG and return as bytes for streaming download."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"QR file not found: {filepath}")
    with open(filepath, "rb") as f:
        return f.read()
