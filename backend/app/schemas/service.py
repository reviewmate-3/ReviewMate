from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    is_active: bool = True


class ServiceOut(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    description: Optional[str]
    is_active: bool

    class Config:
        orm_mode = True
