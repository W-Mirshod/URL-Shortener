from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app import database, models, schemas, crud, utils

app = FastAPI(title="URL Shortener")

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the main page."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/shorten", response_model=schemas.URLResponse)
async def create_short_url(url_data: schemas.URLCreate, db: Session = Depends(database.get_db)):
    """Create a shortened URL."""
    if not utils.validate_url(url_data.original_url):
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    db_url = crud.create_url(db, url_data.original_url)
    return db_url


@app.get("/api/urls", response_model=schemas.URLListResponse)
async def get_all_urls(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Get all shortened URLs with statistics."""
    result = crud.get_all_urls(db, skip=skip, limit=limit)
    return result


@app.get("/{short_code}")
async def redirect_to_url(short_code: str, db: Session = Depends(database.get_db)):
    """Redirect to the original URL using the short code."""
    db_url = crud.get_url_by_short_code(db, short_code=short_code)
    if db_url is None:
        raise HTTPException(status_code=404, detail="URL not found")
    
    crud.increment_view_count(db, db_url)
    return RedirectResponse(url=db_url.original_url, status_code=302)

