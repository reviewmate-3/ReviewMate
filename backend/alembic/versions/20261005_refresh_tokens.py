"""add refresh token sessions

Revision ID: 20261005_refresh_tokens
Revises: 20241004_initial
"""

from alembic import op
import sqlalchemy as sa


revision = '20261005_refresh_tokens'
down_revision = '20241004_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('jti', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('jti'),
    )
    op.create_index(op.f('ix_refresh_tokens_jti'), 'refresh_tokens', ['jti'], unique=True)
    op.create_index(op.f('ix_refresh_tokens_user_id'), 'refresh_tokens', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_refresh_tokens_user_id'), table_name='refresh_tokens')
    op.drop_index(op.f('ix_refresh_tokens_jti'), table_name='refresh_tokens')
    op.drop_table('refresh_tokens')