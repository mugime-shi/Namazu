from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Namazu API"
    debug: bool = False

    database_url: str = "postgresql://namazu:namazu@localhost:5432/namazu"

    entsoe_api_key: str = ""
    eur_to_sek_rate: float = 11.0  # fallback fixed rate; replace with Riksbank API later

    default_area: str = "SE3"


settings = Settings()
