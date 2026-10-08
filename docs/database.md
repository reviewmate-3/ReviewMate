# Database design

ReviewMate uses PostgreSQL in production with SQLAlchemy models and Alembic migrations.

## Core tables
- users
- businesses
- business_categories
- services
- review_sessions
- review_templates
- qr_codes
- analytics_events

## Key principles
- Business ownership is enforced in queries
- Customer reviews are anonymous and do not require account creation
- Review session data stores only feedback text and generated draft data required for analytics
- QR and analytics events are stored separate from customer profile data
- AI-generated review text is never treated as verified customer fact
