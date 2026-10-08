"""create core reviewmate schema

Revision ID: 20241004_initial
Revises: 
Create Date: 2026-10-04 00:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20241004_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table(
        'business_categories',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('slug', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_business_categories_slug'), 'business_categories', ['slug'], unique=True)

    op.create_table(
        'businesses',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=150), nullable=False),
        sa.Column('category_id', sa.UUID(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('city', sa.String(length=150), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('primary_color', sa.String(length=50), nullable=True),
        sa.Column('google_review_url', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['business_categories.id']),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    op.create_index(op.f('ix_businesses_owner_id'), 'businesses', ['owner_id'], unique=False)
    op.create_index(op.f('ix_businesses_slug'), 'businesses', ['slug'], unique=True)

    op.create_table(
        'services',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_services_business_id'), 'services', ['business_id'], unique=False)

    op.create_table(
        'review_sessions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('service_id', sa.UUID(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('customer_feedback', sa.Text(), nullable=True),
        sa.Column('generated_review', sa.Text(), nullable=True),
        sa.Column('customer_edited_review', sa.Text(), nullable=True),
        sa.Column('google_clicked', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.ForeignKeyConstraint(['service_id'], ['services.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_sessions_business_id'), 'review_sessions', ['business_id'], unique=False)

    op.create_table(
        'review_templates',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('category_id', sa.UUID(), nullable=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('system_prompt', sa.Text(), nullable=True),
        sa.Column('user_prompt_template', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['business_categories.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'qr_codes',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=True),
        sa.Column('destination_url', sa.String(length=500), nullable=False),
        sa.Column('scan_count', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_qr_codes_business_id'), 'qr_codes', ['business_id'], unique=False)

    op.create_table(
        'analytics_events',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('session_id', sa.UUID(), nullable=True),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analytics_events_business_id'), 'analytics_events', ['business_id'], unique=False)
    op.create_index(op.f('ix_analytics_events_created_at'), 'analytics_events', ['created_at'], unique=False)
    op.create_index(op.f('ix_analytics_events_event_type'), 'analytics_events', ['event_type'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_analytics_events_event_type'), table_name='analytics_events')
    op.drop_index(op.f('ix_analytics_events_created_at'), table_name='analytics_events')
    op.drop_index(op.f('ix_analytics_events_business_id'), table_name='analytics_events')
    op.drop_table('analytics_events')
    op.drop_index(op.f('ix_qr_codes_business_id'), table_name='qr_codes')
    op.drop_table('qr_codes')
    op.drop_table('review_templates')
    op.drop_index(op.f('ix_review_sessions_business_id'), table_name='review_sessions')
    op.drop_table('review_sessions')
    op.drop_index(op.f('ix_services_business_id'), table_name='services')
    op.drop_table('services')
    op.drop_index(op.f('ix_businesses_slug'), table_name='businesses')
    op.drop_index(op.f('ix_businesses_owner_id'), table_name='businesses')
    op.drop_table('businesses')
    op.drop_index(op.f('ix_business_categories_slug'), table_name='business_categories')
    op.drop_table('business_categories')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
