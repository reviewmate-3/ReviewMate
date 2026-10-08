import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AnalyticsEvent(Base):
    __tablename__ = 'analytics_events'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('businesses.id'), nullable=False, index=True)
    session_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    event_metadata: Mapped[dict | None] = mapped_column('metadata', JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)
