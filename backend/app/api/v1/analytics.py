from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_business_owner
from app.db.session import get_db
from app.models.analytics_event import AnalyticsEvent
from app.models.business import Business
from app.models.review_session import ReviewSession

router = APIRouter(prefix='/analytics', tags=['analytics'])


@router.get('/overview')
def overview(db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    business_ids = [b.id for b in businesses]
    qr_scans = db.query(AnalyticsEvent).filter(AnalyticsEvent.business_id.in_([str(b) for b in business_ids]), AnalyticsEvent.event_type == 'QR_SCAN').count()
    feedback_submitted = db.query(ReviewSession).filter(ReviewSession.business_id.in_([str(b) for b in business_ids])).count()
    review_generated = db.query(ReviewSession).filter(ReviewSession.business_id.in_([str(b) for b in business_ids]), ReviewSession.generated_review.isnot(None)).count()
    google_clicks = db.query(AnalyticsEvent).filter(AnalyticsEvent.business_id.in_([str(b) for b in business_ids]), AnalyticsEvent.event_type == 'GOOGLE_CLICK').count()
    return {'success': True, 'data': {'qr_scans': qr_scans, 'feedback_submitted': feedback_submitted, 'reviews_generated': review_generated, 'google_clicks': google_clicks}, 'message': 'Overview loaded.'}


@router.get('/events')
def events(db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    ids = [str(b.id) for b in businesses]
    records = db.query(AnalyticsEvent).filter(AnalyticsEvent.business_id.in_(ids)).order_by(AnalyticsEvent.created_at.desc()).limit(50).all()
    return {'success': True, 'data': [{'id': str(r.id), 'event_type': r.event_type, 'created_at': r.created_at.isoformat()} for r in records], 'message': 'Events loaded.'}


@router.get('/daily')
def daily(db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    ids = [str(b.id) for b in businesses]
    events = db.query(AnalyticsEvent).filter(AnalyticsEvent.business_id.in_(ids)).all()
    daily = {}
    for event in events:
        key = event.created_at.date().isoformat()
        daily[key] = daily.get(key, 0) + 1
    return {'success': True, 'data': [{'date': date, 'count': count} for date, count in sorted(daily.items())], 'message': 'Daily analytics loaded.'}
