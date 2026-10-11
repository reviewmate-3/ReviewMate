"""add subscription plans and business subscriptions

Revision ID: 20261011_subscriptions
Revises: 20261011_feedback_questions
"""

from alembic import op
import sqlalchemy as sa
import uuid
from datetime import datetime


revision = '20261011_subscriptions'
down_revision = '20261011_feedback_questions'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'plans',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('monthly_price_inr', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('monthly_feedback_limit', sa.Integer(), nullable=False),
        sa.Column('location_limit', sa.Integer(), nullable=False),
        sa.Column('ai_enabled', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code'),
    )
    op.create_index('ix_plans_code', 'plans', ['code'], unique=True)
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('plan_id', sa.UUID(), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='ACTIVE'),
        sa.Column('provider', sa.String(length=30), nullable=True),
        sa.Column('provider_subscription_id', sa.String(length=255), nullable=True),
        sa.Column('current_period_end', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('business_id'),
    )
    op.create_index('ix_subscriptions_business_id', 'subscriptions', ['business_id'], unique=True)
    plans = sa.table(
        'plans',
        sa.column('id', sa.UUID()),
        sa.column('code', sa.String()),
        sa.column('name', sa.String()),
        sa.column('monthly_price_inr', sa.Integer()),
        sa.column('monthly_feedback_limit', sa.Integer()),
        sa.column('location_limit', sa.Integer()),
        sa.column('ai_enabled', sa.Boolean()),
        sa.column('created_at', sa.DateTime()),
    )
    op.bulk_insert(plans, [
        {'id': uuid.UUID('00000000-0000-0000-0000-000000000001'), 'code': 'FREE', 'name': 'Free', 'monthly_price_inr': 0, 'monthly_feedback_limit': 50, 'location_limit': 1, 'ai_enabled': False, 'created_at': datetime.utcnow()},
        {'id': uuid.UUID('00000000-0000-0000-0000-000000000002'), 'code': 'STARTER', 'name': 'Starter', 'monthly_price_inr': 299, 'monthly_feedback_limit': 250, 'location_limit': 1, 'ai_enabled': True, 'created_at': datetime.utcnow()},
        {'id': uuid.UUID('00000000-0000-0000-0000-000000000003'), 'code': 'GROWTH', 'name': 'Growth', 'monthly_price_inr': 799, 'monthly_feedback_limit': 1000, 'location_limit': 3, 'ai_enabled': True, 'created_at': datetime.utcnow()},
        {'id': uuid.UUID('00000000-0000-0000-0000-000000000004'), 'code': 'BUSINESS', 'name': 'Business', 'monthly_price_inr': 1999, 'monthly_feedback_limit': 5000, 'location_limit': 10, 'ai_enabled': True, 'created_at': datetime.utcnow()},
    ])


def downgrade() -> None:
    op.drop_index('ix_subscriptions_business_id', table_name='subscriptions')
    op.drop_table('subscriptions')
    op.drop_index('ix_plans_code', table_name='plans')
    op.drop_table('plans')
