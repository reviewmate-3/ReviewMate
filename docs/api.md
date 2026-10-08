# ReviewMate API guide

## Core endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Access tokens are short-lived JWTs with `type=access`. Refresh tokens are
persisted server-side by JTI, rotated on every refresh, and revoked on logout.
Clients must send the refresh token in the request body:

```json
{
  "refresh_token": "..."
}
```

After refresh, the previous refresh token cannot be reused. Run the Alembic
migration before starting an existing deployment so the `refresh_tokens` table
exists.

### Business
- `GET /api/v1/businesses/`
- `POST /api/v1/businesses/`
- `GET /api/v1/businesses/categories`

### Services
- `GET /api/v1/services/`
- `POST /api/v1/services/`

### Tenant management
- `GET /api/v1/locations/?business_id={business_id}`
- `POST /api/v1/locations/?business_id={business_id}`
- `GET /api/v1/members/?business_id={business_id}`
- `POST /api/v1/members/?business_id={business_id}`

Location and member access is checked against the authenticated owner,
platform administrator, or active business membership on the server. A
frontend-supplied business ID never grants access by itself.

### Reviews
- `POST /api/v1/reviews/generate`

### QR
- `POST /api/v1/qr/generate`

### Analytics
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/events`
- `GET /api/v1/analytics/daily`

## Response format

Success responses use:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

Error responses use:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}
```
