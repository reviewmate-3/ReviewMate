# Deployment guidance

## Local development

- Start the database with Docker Compose or use the local SQLite fallback for tests
- Run backend with Uvicorn
- Run frontend with Next.js dev server

## Production recommendations

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon, Supabase, or a managed PostgreSQL provider
- Use environment variables for all secrets and provider configuration
- Move file storage to S3 / Cloudinary for production uploads
