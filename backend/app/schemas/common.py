from typing import Any

from pydantic import BaseModel


class ApiResponse(BaseModel):
    success: bool
    data: Any | None = None
    message: str | None = None


class ApiError(BaseModel):
    code: str
    message: str
