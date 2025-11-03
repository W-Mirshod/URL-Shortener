from sqlalchemy.orm import Session
from app import models, utils


def create_url(db: Session, original_url: str) -> models.URL:
    """Create a new shortened URL."""
    normalized_url = utils.normalize_url(original_url)
    
    # Check if URL already exists
    existing_url = db.query(models.URL).filter(
        models.URL.original_url == normalized_url
    ).first()
    
    if existing_url:
        return existing_url
    
    # Generate unique short code
    short_code = utils.generate_short_code()
    while db.query(models.URL).filter(models.URL.short_code == short_code).first():
        short_code = utils.generate_short_code()
    
    db_url = models.URL(
        original_url=normalized_url,
        short_code=short_code
    )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url


def get_url_by_short_code(db: Session, short_code: str) -> models.URL | None:
    """Retrieve a URL by its short code."""
    return db.query(models.URL).filter(models.URL.short_code == short_code).first()


def get_all_urls(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve all URLs from the database."""
    total = db.query(models.URL).count()
    urls = db.query(models.URL).order_by(models.URL.created_at.desc()).offset(skip).limit(limit).all()
    return {"urls": urls, "total": total}


def increment_view_count(db: Session, url: models.URL):
    """Increment the view count for a URL."""
    url.view_count += 1
    db.commit()
    db.refresh(url)




