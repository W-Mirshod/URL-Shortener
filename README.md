# URL Shortener

A clean, modern URL shortener application built with FastAPI, SQLite, and vanilla JavaScript. Perfect for portfolio projects.

## Features

- 🔗 Shorten long URLs into concise, shareable links
- 📊 Track view counts for each shortened URL
- 📋 Copy shortened URLs to clipboard with one click
- 📱 Fully responsive design for mobile and desktop
- ⚡ Fast and lightweight

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Validation**: Pydantic

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "URL Shortener"
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Option 1: Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker compose up --build
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

The application will be available at `http://localhost:8000` with automatic reloading enabled.

To stop the container:
```bash
docker compose down
```

### Option 2: Local Development

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the development server:
```bash
uvicorn app.main:app --reload
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

5. Enter a URL in the form and click "Shorten URL"

6. Your shortened URL will be displayed and you can copy it to clipboard

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
  - Request body: `{"original_url": "https://example.com"}`
  - Response: URL object with short_code and metadata

- `GET /api/urls` - Get all shortened URLs with statistics
  - Query parameters: `skip` (default: 0), `limit` (default: 100)
  - Response: List of URLs with view counts and creation dates

- `GET /{short_code}` - Redirect to original URL
  - Automatically increments view count

## Project Structure

```
URL Shortener/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   └── utils.py             # Utility functions
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── templates/
│   └── index.html
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Database

The application uses SQLite with the following schema:

- **urls** table:
  - `id` (Integer, Primary Key)
  - `original_url` (String, Unique)
  - `short_code` (String, Unique, Indexed)
  - `created_at` (DateTime)
  - `view_count` (Integer, Default: 0)

The database file (`url_shortener.db`) is created automatically on first run.

## Development

To run in development mode with auto-reload:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## License

MIT License - feel free to use this project for your portfolio!




