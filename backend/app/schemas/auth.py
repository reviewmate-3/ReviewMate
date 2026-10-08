from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=20)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool

    class Config:
        orm_mode = True
