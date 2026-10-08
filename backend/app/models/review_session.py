import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ReviewSession(Base):
    __tablename__ = 'review_sessions'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('businesses.id'), nullable=False, index=True)
    service_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey('services.id'), nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    customer_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_review: Mapped[str | None] = mapped_column(Text, nullable=True)
    customer_edited_review: Mapped[str | None] = mapped_column(Text, nullable=True)
    google_clicked: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
