from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongodb_uri: str = "mongodb+srv://2k25cse2510966_db_user:B0dwbpNrAPrNHsj6@cluster0.cjtmixl.mongodb.net/"
    mongodb_db: str = "ayursutra"
    firebase_project_id: str = ""
    firebase_credentials_path: str = ""
    fle_encryption_key: str = "dev-only-key-change-in-production"
    cors_origins: str = "http://localhost:5173"
    dev_mode: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
