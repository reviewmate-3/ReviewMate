from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.factory import AIProviderFactory
from app.api.deps import get_current_business_owner
from app.models.business import Business
from app.db.session import get_db
from app.models.review_session import ReviewSession
from app.models.service import Service
from app.schemas.review import ReviewGenerateRequest, ReviewGenerateResponse

router = APIRouter(prefix='/reviews', tags=['reviews'])


@router.get('/reputation')
def reputation(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_business_owner),
):
    business_ids = [
        business.id
        for business in db.query(Business).filter(Business.owner_id == current_user.id).all()
    ]
    sessions = db.query(ReviewSession).filter(ReviewSession.business_id.in_(business_ids)).all()
    ratings = [session.rating for session in sessions if session.rating is not None]
    total = len(sessions)
    generated = sum(1 for session in sessions if session.generated_review)
    google_clicks = sum(1 for session in sessions if session.google_clicked)
    rating_counts = {str(value): ratings.count(value) for value in range(1, 6)}
    return {
        'success': True,
        'data': {
            'total_feedback': total,
            'average_rating': round(sum(ratings) / len(ratings), 2) if ratings else None,
            'rating_counts': rating_counts,
            'reviews_generated': generated,
            'google_clicks': google_clicks,
            'google_click_rate': round((google_clicks / total) * 100, 1) if total else 0,
        },
        'message': 'Reputation loaded.',
    }


@router.get('/')
def list_reviews(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_business_owner),
):
    business_ids = [
        business.id
        for business in db.query(Business).filter(Business.owner_id == current_user.id).all()
    ]
    sessions = (
        db.query(ReviewSession)
        .filter(ReviewSession.business_id.in_(business_ids))
        .order_by(ReviewSession.created_at.desc())
        .limit(100)
        .all()
    )
    service_names = {
        service.id: service.name
        for service in db.query(Service).filter(Service.business_id.in_(business_ids)).all()
    }
    return {
        'success': True,
        'data': [
            {
                'id': str(session.id),
                'rating': session.rating,
                'service': service_names.get(session.service_id) if session.service_id else None,
                'feedback': session.customer_feedback,
                'generated_review': session.generated_review,
                'customer_edited_review': session.customer_edited_review,
                'google_clicked': session.google_clicked,
                'created_at': session.created_at.isoformat(),
            }
            for session in sessions
        ],
        'message': 'Feedback loaded.',
    }


@router.post('/generate', response_model=ReviewGenerateResponse)
async def generate_review(payload: ReviewGenerateRequest, db: Session = Depends(get_db)):
    if not payload.feedback or not payload.service:
        raise HTTPException(status_code=400, detail='Feedback and service are required.')

    provider = AIProviderFactory.get_provider()
    business_context = {'business_name': 'Demo Business'}
    generated = await provider.generate_review(
        business_context=business_context,
        service=payload.service,
        rating=payload.rating,
        feedback=payload.feedback,
    )

    session = ReviewSession(
        business_id=payload.session_id,
        service_id=None,
        rating=payload.rating,
        customer_feedback=payload.feedback,
        generated_review=generated,
        customer_edited_review=generated,
        google_clicked=False,
        created_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()

    return {'review': generated}
