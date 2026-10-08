from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.factory import AIProviderFactory
from app.db.session import get_db
from app.models.review_session import ReviewSession
from app.schemas.review import ReviewGenerateRequest, ReviewGenerateResponse

router = APIRouter(prefix='/reviews', tags=['reviews'])


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
