"""create_spot_prices_table

Revision ID: 36b7e8f0261d
Revises:
Create Date: 2026-03-11 10:11:07.444745

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "36b7e8f0261d"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "spot_prices",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("area", sa.String(4), nullable=False, server_default="SE3"),
        sa.Column("timestamp_utc", sa.DateTime(timezone=True), nullable=False),
        sa.Column("price_eur_mwh", sa.Numeric(10, 2), nullable=False),
        sa.Column("price_sek_kwh", sa.Numeric(10, 4), nullable=True),
        sa.Column("resolution", sa.String(10), server_default="PT60M"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("area", "timestamp_utc", "resolution", name="uq_spot_price"),
    )
    op.create_index(
        "idx_spot_prices_area_time",
        "spot_prices",
        ["area", sa.text("timestamp_utc DESC")],
    )


def downgrade() -> None:
    op.drop_index("idx_spot_prices_area_time", table_name="spot_prices")
    op.drop_table("spot_prices")
