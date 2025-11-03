import secrets
import string
from urllib.parse import urlparse


def validate_url(url: str) -> bool:
    """Validate if the given string is a valid URL."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def generate_short_code(length: int = 6) -> str:
    """Generate a random alphanumeric short code."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def normalize_url(url: str) -> str:
    """Normalize URL by ensuring it has a scheme."""
    if not url.startswith(('http://', 'https://')):
        return f'https://{url}'
    return url




