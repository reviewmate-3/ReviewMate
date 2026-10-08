from datetime import datetime
from typing import Any
from urllib.parse import quote_plus
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.factory import AIProviderFactory
from app.db.session import get_db
from app.models.analytics_event import AnalyticsEvent
from app.models.business import Business
from app.models.review_session import ReviewSession
from app.models.service import Service
from app.schemas.review import PublicReviewRequest

router = APIRouter(prefix='/public', tags=['public'])


def serialize_business(business: Business) -> dict[str, Any]:
    return {
        'id': str(business.id),
        'owner_id': str(business.owner_id),
        'name': business.name,
        'slug': business.slug,
        'category_id': str(business.category_id) if business.category_id else None,
        'description': business.description,
        'city': business.city,
        'phone': business.phone,
        'email': business.email,
        'logo_url': business.logo_url,
        'primary_color': business.primary_color,
        'google_review_url': business.google_review_url,
        'is_active': business.is_active,
    }


def serialize_service(service: Service) -> dict[str, Any]:
    return {
        'id': str(service.id),
        'business_id': str(service.business_id),
        'name': service.name,
        'description': service.description,
        'is_active': service.is_active,
    }


@router.get('/business/{slug}')
def get_public_business(slug: str, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.slug == slug.lower()).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')

    services = db.query(Service).filter(Service.business_id == business.id, Service.is_active.is_(True)).order_by(Service.name.asc()).all()
    db.add(AnalyticsEvent(business_id=business.id, event_type='QR_SCAN', created_at=datetime.utcnow()))
    db.commit()
    redirect_url = business.google_review_url or f'https://www.google.com/search?q={quote_plus(business.name)}'

    return {
        'success': True,
        'data': {
            'business': serialize_business(business),
            'services': [serialize_service(service) for service in services],
            'redirect_url': redirect_url,
        },
        'message': 'Business loaded.'
    }


@router.post('/review-session')
async def create_public_review_session(payload: PublicReviewRequest, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.slug == payload.slug.lower()).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')

    service_name = payload.service.strip()
    service = db.query(Service).filter(Service.business_id == business.id, Service.name.ilike(service_name)).first()

    provider = AIProviderFactory.get_provider()
    generated = await provider.generate_review(
        business_context={'business_name': business.name},
        service=service_name,
        rating=payload.rating,
        feedback=payload.feedback,
    )

    review_session = ReviewSession(
        business_id=business.id,
        service_id=service.id if service else None,
        rating=payload.rating,
        customer_feedback=payload.feedback,
        generated_review=generated,
        customer_edited_review=generated,
        google_clicked=False,
        created_at=datetime.utcnow(),
    )
    db.add(review_session)
    db.commit()
    db.refresh(review_session)

    redirect_url = business.google_review_url or f'https://www.google.com/search?q={quote_plus(business.name)}'
    return {
        'success': True,
        'data': {
            'session_id': str(review_session.id),
            'review': generated,
            'redirect_url': redirect_url,
        },
        'message': 'Review session created.'
    }


@router.post('/google-click/{session_id}')
def record_google_click(session_id: UUID, db: Session = Depends(get_db)):
    review_session = db.query(ReviewSession).filter(ReviewSession.id == session_id).first()
    if not review_session:
        raise HTTPException(status_code=404, detail='Review session not found')

    review_session.google_clicked = True
    db.add(AnalyticsEvent(
        business_id=review_session.business_id,
        session_id=review_session.id,
        event_type='GOOGLE_CLICK',
        created_at=datetime.utcnow(),
    ))
    db.commit()
    return {'success': True, 'message': 'Google click recorded.'}
