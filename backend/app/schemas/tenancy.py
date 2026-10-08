from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    address: str | None = Field(default=None, max_length=500)
    city: str | None = Field(default=None, max_length=150)
    phone: str | None = Field(default=None, max_length=50)
    google_review_url: str | None = Field(default=None, max_length=500)
    timezone: str = Field(default='Asia/Kolkata', max_length=80)


class MemberInvite(BaseModel):
    email: str
    role: str = Field(default='STAFF', pattern='^(MANAGER|STAFF)$')