"""add case_studies.source, date, location, company_name, key_results

Adds five nullable-safe columns to the existing ``case_studies`` table. No
existing column is touched.

  * source        VARCHAR(500)  NULL
  * date          VARCHAR(100)  NULL
  * location      VARCHAR(200)  NULL
  * company_name  VARCHAR(200)  NULL   (indexed)
  * key_results   JSON          NOT NULL   (existing rows backfilled with [])

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-04

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _case_study_columns() -> set[str]:
    return {c["name"] for c in inspect(op.get_bind()).get_columns("case_studies")}


def _case_study_indexes() -> set[str]:
    return {i["name"] for i in inspect(op.get_bind()).get_indexes("case_studies")}


def upgrade() -> None:
    # Defensive: this project still runs Base.metadata.create_all() at app startup,
    # so some columns may already exist. Add only what's missing.
    existing = _case_study_columns()

    if "source" not in existing:
        op.add_column("case_studies", sa.Column("source", sa.String(length=500), nullable=True))
    if "date" not in existing:
        op.add_column("case_studies", sa.Column("date", sa.String(length=100), nullable=True))
    if "location" not in existing:
        op.add_column("case_studies", sa.Column("location", sa.String(length=200), nullable=True))
    if "company_name" not in existing:
        op.add_column("case_studies", sa.Column("company_name", sa.String(length=200), nullable=True))
    if "key_results" not in existing:
        op.add_column(
            "case_studies",
            sa.Column("key_results", sa.JSON(), server_default=sa.text("'[]'"), nullable=False),
        )
        # Existing rows are now backfilled with '[]'. Drop the DB-side default so it
        # matches the model, which supplies a Python-side default (default=list).
        op.alter_column("case_studies", "key_results", server_default=None)

    if "ix_case_studies_company_name" not in _case_study_indexes():
        op.create_index("ix_case_studies_company_name", "case_studies", ["company_name"])


def downgrade() -> None:
    if "ix_case_studies_company_name" in _case_study_indexes():
        op.drop_index("ix_case_studies_company_name", table_name="case_studies")

    existing = _case_study_columns()
    if "key_results" in existing:
        op.drop_column("case_studies", "key_results")
    if "company_name" in existing:
        op.drop_column("case_studies", "company_name")
    if "location" in existing:
        op.drop_column("case_studies", "location")
    if "date" in existing:
        op.drop_column("case_studies", "date")
    if "source" in existing:
        op.drop_column("case_studies", "source")
