# Import every model module so Base.metadata has all tables registered
# before app.core.database.init_db() runs Base.metadata.create_all.
from app.models.users.user import User
from app.models.auth.refresh_token import RefreshToken
from app.models.auth.social_account import SocialAccount, SocialProvider

__all__ = ["User", "RefreshToken", "SocialAccount", "SocialProvider"]
