import logging
import time
import uuid

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from redis import Redis

from app.api.v1.admin import router as admin_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.auth import router as auth_router
from app.api.v1.businesses import router as businesses_router
from app.api.v1.public import router as public_router
from app.api.v1.qr import router as qr_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.services import router as services_router
from app.api.v1.locations import router as locations_router
from app.api.v1.members import router as members_router
from app.config import settings
from app.db.base import Base
from app.db.session import engine

logger = logging.getLogger('reviewmate')
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')

Base.metadata.create_all(bind=engine)

app = FastAPI(title='ReviewMate API', version='1.0.0', description='Customer feedback and review assistance API.')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(',') if origin.strip()],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.middleware('http')
async def request_logging_middleware(request: Request, call_next):
    request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
    started = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - started) * 1000, 2)
    response.headers['X-Request-ID'] = request_id
    logger.info('%s %s status=%s duration_ms=%s request_id=%s', request.method, request.url.path, response.status_code, duration_ms, request_id)
    return response


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            'success': False,
            'error': {'code': 'VALIDATION_ERROR', 'message': 'Request validation failed.'},
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            'success': False,
            'error': {'code': 'HTTP_ERROR', 'message': exc.detail},
        },
    )


@app.get('/health')
def health():
    return {'status': 'healthy', 'version': '1.0.0'}


@app.get('/health/db')
def health_db():
    try:
        with engine.connect() as conn:
            conn.execute(text('SELECT 1'))
        return {'status': 'healthy', 'database': 'connected'}
    except Exception:
        return JSONResponse(status_code=503, content={'status': 'unhealthy', 'database': 'disconnected'})


@app.get('/health/redis')
def health_redis():
    try:
        Redis.from_url(settings.REDIS_URL, decode_responses=True).ping()
        return {'status': 'healthy', 'redis': 'connected'}
    except Exception:
        return JSONResponse(status_code=503, content={'status': 'unhealthy', 'redis': 'disconnected'})


app.include_router(auth_router, prefix='/api/v1')
app.include_router(businesses_router, prefix='/api/v1')
app.include_router(services_router, prefix='/api/v1')
app.include_router(locations_router, prefix='/api/v1')
app.include_router(members_router, prefix='/api/v1')
app.include_router(qr_router, prefix='/api/v1')
app.include_router(public_router, prefix='/api/v1')
app.include_router(reviews_router, prefix='/api/v1')
app.include_router(analytics_router, prefix='/api/v1')
app.include_router(admin_router, prefix='/api/v1')
