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
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _lesson_columns() -> set[str]:
    return {c["name"] for c in inspect(op.get_bind()).get_columns("lessons")}


def upgrade() -> None:
    # Defensive: this project still runs Base.metadata.create_all() at app startup,
    # so some columns may already exist. Add only what's missing.
    existing = _lesson_columns()

    if "summary" not in existing:
        op.add_column("lessons", sa.Column("summary", sa.Text(), nullable=True))
    if "learning_objectives" not in existing:
        op.add_column(
            "lessons",
            sa.Column(
                "learning_objectives",
                sa.JSON(),
                server_default=sa.text("'[]'"),
                nullable=False,
            ),
        )
        # Existing rows are now backfilled with '[]'. Drop the DB-side default so it
        # matches the model, which supplies a Python-side default (default=list).
        op.alter_column("lessons", "learning_objectives", server_default=None)
    if "content_blocks" not in existing:
        op.add_column("lessons", sa.Column("content_blocks", sa.JSON(), nullable=True))


def downgrade() -> None:
    existing = _lesson_columns()
    if "content_blocks" in existing:
        op.drop_column("lessons", "content_blocks")
    if "learning_objectives" in existing:
        op.drop_column("lessons", "learning_objectives")
    if "summary" in existing:
        op.drop_column("lessons", "summary")
