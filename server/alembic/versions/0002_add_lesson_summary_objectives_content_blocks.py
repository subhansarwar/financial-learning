"""add lessons.summary, lessons.learning_objectives, lessons.content_blocks

Adds three nullable-safe columns to the existing ``lessons`` table. No existing
column is touched.

  * summary              TEXT      NULL
  * learning_objectives  JSON      NOT NULL   (existing rows backfilled with [])
  * content_blocks       JSON      NULL       [{"paragraph": str, "order_index": int}, ...]

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("lessons", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column(
        "lessons",
        sa.Column(
            "learning_objectives",
            sa.JSON(),
            server_default=sa.text("'[]'"),
            nullable=False,
        ),
    )
    op.add_column("lessons", sa.Column("content_blocks", sa.JSON(), nullable=True))

    # Existing rows are now backfilled with '[]'. Drop the DB-side default so it
    # matches the model, which supplies a Python-side default (default=list).
    op.alter_column("lessons", "learning_objectives", server_default=None)


def downgrade() -> None:
    op.drop_column("lessons", "content_blocks")
    op.drop_column("lessons", "learning_objectives")
    op.drop_column("lessons", "summary")
