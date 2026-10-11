from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_platform_admin
from app.db.session import get_db
from app.models.business import Business
from app.models.review_session import ReviewSession
from app.models.user import User

router = APIRouter(prefix='/admin', tags=['admin'])


@router.get('/overview')
def overview(db: Session = Depends(get_db), current_user=Depends(get_current_platform_admin)):
    return {
        'success': True,
        'data': {
            'platform': 'reviewmate',
            'admin_email': current_user.email,
            'businesses': db.query(Business).count(),
            'users': db.query(User).count(),
            'business_owners': db.query(User).filter(User.role == 'BUSINESS_OWNER').count(),
            'feedback_submitted': db.query(ReviewSession).count(),
        },
        'message': 'Admin overview loaded.',
    }


@router.get('/businesses')
def list_businesses(db: Session = Depends(get_db), current_user=Depends(get_current_platform_admin)):
    records = db.query(Business).order_by(Business.created_at.desc()).all()
    return {
        'success': True,
        'data': [
            {
                'id': str(business.id),
                'name': business.name,
                'slug': business.slug,
                'owner_id': str(business.owner_id),
                'is_active': business.is_active,
                'created_at': business.created_at.isoformat(),
            }
            for business in records
        ],
        'message': 'Businesses loaded.',
    }


@router.get('/users')
def list_users(db: Session = Depends(get_db), current_user=Depends(get_current_platform_admin)):
    records = db.query(User).order_by(User.created_at.desc()).all()
    return {
        'success': True,
        'data': [
            {
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active,
                'created_at': user.created_at.isoformat(),
            }
            for user in records
        ],
        'message': 'Users loaded.',
    }
