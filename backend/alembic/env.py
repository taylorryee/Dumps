import os
from pathlib import Path
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from dotenv import load_dotenv

# Import your Base
from app.db import Base
from app.models.models import Dump, Thought, Category


# ----------------------------------------------------
# Load .env from infra/
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]
env_path = BASE_DIR / "infra" / ".env"

load_dotenv(env_path)

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise Exception("DATABASE_URL environment variable is missing!")

# ----------------------------------------------------
# Load Alembic Config
# ----------------------------------------------------
config = context.config
config.set_main_option("sqlalchemy.url", database_url)

# ----------------------------------------------------
# Logging
# ----------------------------------------------------
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ----------------------------------------------------
# Metadata for autogenerate
# ----------------------------------------------------
target_metadata = Base.metadata

# ----------------------------------------------------
# Migration Runners
# ----------------------------------------------------
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


# ----------------------------------------------------
# Execute
# ----------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

