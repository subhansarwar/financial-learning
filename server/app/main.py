# app/main.py
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401 — registers all models on Base before create_all
from app.core.celery_app import check_celery_workers
from app.core.config import settings
from app.core.database import check_db_connection, init_db
from app.routes.auth.auth import router as auth_router
from app.routes.users.profile import router as users_router
from app.routes.courses.catalog import router as courses_router
from app.routes.courses.admin import router as courses_admin_router
from app.routes.courses.certificates import router as certificates_router
from app.routes.publications.student import router as publications_student_router
from app.routes.publications.catalog import router as publications_catalog_router
from app.routes.publications.admin import router as publications_admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if await check_db_connection():
        await init_db()
        logger.info("Database connection OK, tables ensured")
    else:
        logger.warning("Database connection failed on startup")

    check_celery_workers()
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication System"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(courses_router, prefix="/api/courses", tags=["Course Catalog"])
app.include_router(courses_admin_router, prefix="/api/admin/courses", tags=["Course Catalog - Admin"])
app.include_router(certificates_router, prefix="/api/certificates", tags=["Certificates"])
# Student router mounted before the catalog router: both share the "/api/publications" prefix, and its
# literal "/me" paths must match before the catalog router's wildcard "/{publication_number}" route does.
app.include_router(publications_student_router, prefix="/api/publications", tags=["Student Publications"])
app.include_router(publications_catalog_router, prefix="/api/publications", tags=["Student Publications"])
app.include_router(
    publications_admin_router, prefix="/api/admin/publications", tags=["Student Publications - Moderation"]
)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
