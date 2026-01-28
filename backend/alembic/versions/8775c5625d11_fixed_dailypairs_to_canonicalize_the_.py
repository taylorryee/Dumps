"""fixed DailyPairs to canonicalize the ids so only one row per pair

Revision ID: 8775c5625d11
Revises: 6628f53d9ae9
Create Date: 2026-01-28 13:30:11.391787
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '8775c5625d11'
down_revision = '6628f53d9ae9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop table if exists (since we don't care about data)
    op.execute("DROP TABLE IF EXISTS daily_pairs CASCADE")

    # Recreate table from scratch
    op.create_table(
        'daily_pairs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id_low', sa.Integer(), nullable=False),
        sa.Column('user_id_high', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['user_id_low'], ['users.id']),
        sa.ForeignKeyConstraint(['user_id_high'], ['users.id']),
        sa.UniqueConstraint('date', 'user_id_low', 'user_id_high', name='uq_daily_pairs_canonical')
    )

    # Indexes
    op.create_index(op.f('ix_daily_pairs_user_id_low'), 'daily_pairs', ['user_id_low'])
    op.create_index(op.f('ix_daily_pairs_user_id_high'), 'daily_pairs', ['user_id_high'])


def downgrade() -> None:
    # Drop the table completely
    op.drop_table('daily_pairs')
