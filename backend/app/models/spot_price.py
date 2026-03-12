"""
SQLAlchemy ORM model for spot_prices table.
Schema matches ARCHITECTURE.md § 4.1

Note on created_at:
  - `default` (Python-side) works in both SQLite (tests) and PostgreSQL (prod).
  - The Alembic migration uses `server_default=sa.text("now()")` for PostgreSQL
    so existing rows get a timestamp even when inserted via raw SQL.
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Index, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class SpotPrice(Base):
    __tablename__ = "spot_prices"

    id: Mapped[int] = mapped_column(primary_key=True)
    area: Mapped[str] = mapped_column(String(4), nullable=False, default="SE3")
    timestamp_utc: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    price_eur_mwh: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    price_sek_kwh: Mapped[float] = mapped_column(Numeric(10, 4), nullable=True)
    resolution: Mapped[str] = mapped_column(String(10), default="PT60M")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        UniqueConstraint("area", "timestamp_utc", "resolution", name="uq_spot_price"),
        Index("idx_spot_prices_area_time", "area", "timestamp_utc"),
    )
