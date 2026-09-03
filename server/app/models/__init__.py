# Import every model module so Base.metadata has all tables registered
# before app.core.database.init_db() runs Base.metadata.create_all.
from app.models.users.user import User
from app.models.auth.refresh_token import RefreshToken
from app.models.auth.social_account import SocialAccount, SocialProvider
from app.models.courses.course import Course, CourseLevel
from app.models.courses.module import Module
from app.models.courses.lesson import Lesson, LessonType
from app.models.students.enrollment import CourseEnrollment, EnrollmentStatus
from app.models.students.lesson_progress import LessonCompletion
from app.models.students.quiz_attempt import QuizAttempt
from app.models.students.certificate import Certificate
from app.models.publications.publication import Publication, PublicationCategory, PublicationStatus
from app.models.publications.bookmark import PublicationBookmark
from app.models.case_studies.case_study import CaseStudy
from app.models.media.media_asset import MediaAsset, MediaContainer, MediaKind

__all__ = [
    "User",
    "RefreshToken",
    "SocialAccount",
    "SocialProvider",
    "Course",
    "CourseLevel",
    "Module",
    "Lesson",
    "LessonType",
    "CourseEnrollment",
    "EnrollmentStatus",
    "LessonCompletion",
    "QuizAttempt",
    "Certificate",
    "Publication",
    "PublicationCategory",
    "PublicationStatus",
    "PublicationBookmark",
    "CaseStudy",
    "MediaAsset",
    "MediaContainer",
    "MediaKind",
]
