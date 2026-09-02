"""baseline — pre-Alembic schema

Represents the schema as produced by ``Base.metadata.create_all()`` (app.core.database.init_db),
which is how every table up to this point was created. This revision intentionally does nothing.

Existing database: run ``alembic stamp 0001`` once so Alembic knows you're already here,
then ``alembic upgrade head``.

Revision ID: 0001
Revises:
Create Date: 2026-09-01

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
