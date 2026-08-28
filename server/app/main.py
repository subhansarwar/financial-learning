# app/main.py
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models  # noqa: F401 — registers all models on Base before create_all
from app.core.celery_app import check_celery_workers
from app.core.config import settings
from app.core.database import check_db_connection, init_db
from app.routes.auth.auth_api import router as auth_router
from app.routes.users.profile_api import router as users_router
from app.routes.courses.catalog_api import router as courses_router
from app.routes.courses.admin_api import router as courses_admin_router
from app.routes.courses.certificates_api import router as certificates_router
from server.app.routes.courses.monitoring_api import router as courses_monitoring_router
from app.routes.publications.student import router as publications_student_router
from app.routes.publications.catalog import router as publications_catalog_router
from app.routes.publications.admin import router as publications_admin_router
from app.routes.case_studies.catalog import router as case_studies_router
from app.routes.case_studies.admin import router as case_studies_admin_router

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

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan, Version=settings.APP_VERSION, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}

p = settings.APP_API_VERSION
app.include_router(auth_router, prefix=p)

# STUDENT ROUTERS
app.include_router(users_router, prefix=p)
app.include_router(courses_router, prefix=p)
app.include_router(certificates_router, prefix=p)
app.include_router(publications_student_router,prefix=p)
app.include_router(publications_catalog_router, prefix=p)
app.include_router(case_studies_router, prefix="/api/case-studies", tags=["Case Studies"])

# ADMIN ROUTERS
app.include_router(courses_admin_router, prefix=p)
app.include_router(courses_monitoring_router, prefix=p)
app.include_router(publications_admin_router, prefix=p)
app.include_router(case_studies_admin_router, prefix="/api/admin/case-studies", tags=["Case Studies - Admin"])


