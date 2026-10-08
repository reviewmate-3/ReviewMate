import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BusinessMember(Base):
    __tablename__ = 'business_members'
    __table_args__ = (UniqueConstraint('business_id', 'user_id', name='uq_business_member'),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('businesses.id'), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(30), nullable=False, default='STAFF')
    status: Mapped[str] = mapped_column(String(30), nullable=False, default='ACTIVE')
    invited_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    joined_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)