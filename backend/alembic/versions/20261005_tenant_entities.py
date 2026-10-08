"""add locations and business members

Revision ID: 20261005_tenant_entities
Revises: 20261005_refresh_tokens
"""

from alembic import op
import sqlalchemy as sa


revision = '20261005_tenant_entities'
down_revision = '20261005_refresh_tokens'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'locations',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('address', sa.String(length=500), nullable=True),
        sa.Column('city', sa.String(length=150), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('google_review_url', sa.String(length=500), nullable=True),
        sa.Column('timezone', sa.String(length=80), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_locations_business_id'), 'locations', ['business_id'], unique=False)

    op.create_table(
        'business_members',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('role', sa.String(length=30), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False),
        sa.Column('invited_at', sa.DateTime(), nullable=False),
        sa.Column('joined_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('business_id', 'user_id', name='uq_business_member'),
    )
    op.create_index(op.f('ix_business_members_business_id'), 'business_members', ['business_id'], unique=False)
    op.create_index(op.f('ix_business_members_user_id'), 'business_members', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_business_members_user_id'), table_name='business_members')
    op.drop_index(op.f('ix_business_members_business_id'), table_name='business_members')
    op.drop_table('business_members')
    op.drop_index(op.f('ix_locations_business_id'), table_name='locations')
    op.drop_table('locations')