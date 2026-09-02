"""Alembic migration environment — async, wired to the app's settings and metadata."""
import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.engine import Connection

# Import every model so Base.metadata is fully populated for autogenerate.
import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import Base, engine

config = context.config

# Keep alembic's own logging config in sync with alembic.ini.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Make the URL visible to `--sql` (offline) runs; online runs reuse the app engine.
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL.strip())

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Emit SQL to stdout without a live DB connection (`alembic upgrade head --sql`)."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def _do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations against the live database using the app's async engine."""
    async with engine.connect() as connection:
        await connection.run_sync(_do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
