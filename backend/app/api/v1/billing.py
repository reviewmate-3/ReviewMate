from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_business_owner
from app.db.session import get_db
from app.models.business import Business
from app.models.review_session import ReviewSession
from app.models.subscription import Plan, Subscription

router = APIRouter(prefix='/billing', tags=['billing'])


def serialize_plan(plan: Plan) -> dict:
    return {
        'code': plan.code,
        'name': plan.name,
        'monthly_price_inr': plan.monthly_price_inr,
        'monthly_feedback_limit': plan.monthly_feedback_limit,
        'location_limit': plan.location_limit,
        'ai_enabled': plan.ai_enabled,
    }


@router.get('/overview')
def overview(db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).all()
    plans = {plan.id: plan for plan in db.query(Plan).all()}
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    data = []
    for business in businesses:
        subscription = db.query(Subscription).filter(Subscription.business_id == business.id).first()
        if not subscription:
            free_plan = db.query(Plan).filter(Plan.code == 'FREE').first()
            if not free_plan:
                continue
            subscription = Subscription(business_id=business.id, plan_id=free_plan.id, status='ACTIVE')
            db.add(subscription)
            db.flush()
        plan = plans.get(subscription.plan_id) or db.query(Plan).get(subscription.plan_id)
        used = db.query(func.count(ReviewSession.id)).filter(
            ReviewSession.business_id == business.id,
            ReviewSession.created_at >= month_start,
        ).scalar() or 0
        data.append({
            'business_id': str(business.id),
            'business_name': business.name,
            'status': subscription.status,
            'plan': serialize_plan(plan),
            'usage': {
                'feedback_used': used,
                'feedback_limit': plan.monthly_feedback_limit,
                'feedback_remaining': max(plan.monthly_feedback_limit - used, 0),
            },
        })
    db.commit()
    return {'success': True, 'data': {'subscriptions': data, 'available_plans': [serialize_plan(plan) for plan in sorted(plans.values(), key=lambda item: item.monthly_price_inr)]}, 'message': 'Billing overview loaded.'}
