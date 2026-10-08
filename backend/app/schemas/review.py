from typing import Optional

from pydantic import BaseModel, Field


class ReviewGenerateRequest(BaseModel):
    session_id: str
    feedback: str = Field(..., min_length=10, max_length=1500)
    service: str = Field(..., min_length=2, max_length=200)
    rating: int = Field(..., ge=1, le=5)


class PublicReviewRequest(BaseModel):
    slug: str = Field(..., min_length=2, max_length=150)
    feedback: str = Field(..., min_length=10, max_length=1500)
    service: str = Field(..., min_length=2, max_length=200)
    rating: int = Field(..., ge=1, le=5)


class ReviewGenerateResponse(BaseModel):
    review: str
