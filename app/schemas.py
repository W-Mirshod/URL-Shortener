from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from typing import Optional


class URLBase(BaseModel):
    original_url: str = Field(..., description="The original URL to be shortened")


class URLCreate(URLBase):
    pass


class URLResponse(BaseModel):
    id: int
    original_url: str
    short_code: str
    created_at: datetime
    view_count: int

    class Config:
        from_attributes = True


class URLListResponse(BaseModel):
    urls: list[URLResponse]
    total: int




