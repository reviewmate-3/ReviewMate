"""add configurable customer feedback questions

Revision ID: 20261011_feedback_questions
Revises: 20261005_tenant_entities
"""

from alembic import op
import sqlalchemy as sa


revision = '20261011_feedback_questions'
down_revision = '20261005_tenant_entities'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'businesses',
        sa.Column('feedback_questions', sa.JSON(), nullable=False, server_default='[]'),
    )


def downgrade() -> None:
    op.drop_column('businesses', 'feedback_questions')
