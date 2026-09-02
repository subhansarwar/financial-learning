# Database migrations (Alembic)

Alembic was added on top of an existing database that was originally built with
`Base.metadata.create_all()` (see `app/core/database.py::init_db`). `create_all` only
*creates missing tables* — it never alters existing ones — so schema changes to tables
that already exist must go through a migration here.

All commands run from the `server/` directory with the venv active.

## First-time setup on an existing database

Your `lessons` table already exists, so tell Alembic you're at the baseline, then apply
the new migration:

```bash
alembic stamp 0001
alembic upgrade head
```

## Normal use (after the first time)

```bash
alembic upgrade head          # apply all pending migrations
alembic downgrade -1          # roll back the most recent
alembic current               # show the DB's current revision
alembic history --verbose     # list migrations
```

## Fresh database

`init_db()` still runs `create_all` at startup and builds every table from the current
models (new columns included). After that, sync Alembic's bookkeeping without re-running
DDL:

```bash
alembic stamp head
```

## Creating a new migration

```bash
alembic revision --autogenerate -m "short description"
```

Review the generated file in `versions/` before committing — autogenerate does not
detect every change (e.g. server defaults, some type changes).

## Important: `create_all` still runs at startup

`init_db()` runs `Base.metadata.create_all()` every time the app boots. If you add a
model/column and start the app before running the migration, the DB object already
exists and a plain `op.create_table` / `op.add_column` will fail with
"relation ... already exists" / "column ... already exists".

Two ways to cope:

1. **Write migrations defensively** — check with `inspect(op.get_bind())` and create
   only what's missing (see `0002` and `0003` for the pattern). Preferred.
2. **`alembic stamp <rev>`** — if a migration's objects were already built by
   `create_all` and match the model, just stamp past it.

Long-term, consider dropping `create_all` from `init_db()` so Alembic is the single
source of truth (needs a full baseline migration + `alembic stamp` on existing DBs).
