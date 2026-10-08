from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BusinessCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category_id: Optional[UUID] = None
    city: Optional[str] = None
    google_review_url: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    primary_color: Optional[str] = '#1f2937'
    logo_url: Optional[str] = None


class BusinessOut(BaseModel):
    id: UUID
    name: str
    slug: str
    category_id: Optional[UUID]
    city: Optional[str]
    google_review_url: Optional[str]
    primary_color: Optional[str]
    logo_url: Optional[str]

    class Config:
        orm_mode = True
