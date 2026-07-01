from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "luminastay"
    secret_key: str = ""  # Must be set via SECRET_KEY env var in production
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    resend_api_key: str = ""
    email_from: str = "noreply@luminastay.com"
    frontend_url: str = "http://localhost:3000"
    host: str = "0.0.0.0"
    port: int = 8001

    class Config:
        env_file = ".env"


settings = Settings()
