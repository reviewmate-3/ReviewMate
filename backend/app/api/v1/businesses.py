import re
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_business_owner
from app.db.session import get_db
from app.models.business import Business
from app.models.business_category import BusinessCategory
from app.schemas.business import BusinessCreate, BusinessOut

router = APIRouter(prefix='/businesses', tags=['businesses'])


def slugify(value: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
    return slug[:80] or 'business'


def serialize_business(business: Business) -> dict:
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


@router.get('/')
def list_businesses(db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    businesses = db.query(Business).filter(Business.owner_id == current_user.id).order_by(Business.created_at.desc()).all()
    return {'success': True, 'data': [serialize_business(business) for business in businesses], 'message': 'Businesses loaded.'}


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_business(payload: BusinessCreate, db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    if not payload.name:
        raise HTTPException(status_code=400, detail='Business name is required')

    category = db.query(BusinessCategory).filter(BusinessCategory.id == payload.category_id).first() if payload.category_id else None
    base_slug = slugify(payload.name)
    slug = base_slug
    suffix = 1
    while db.query(Business).filter(Business.slug == slug).first():
        slug = f'{base_slug}-{suffix}'
        suffix += 1

    business = Business(
        owner_id=current_user.id,
        name=payload.name,
        slug=slug,
        category_id=category.id if category else None,
        city=payload.city,
        description=payload.description,
        phone=payload.phone,
        email=payload.email,
        primary_color=payload.primary_color,
        google_review_url=payload.google_review_url,
        logo_url=payload.logo_url,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return {'success': True, 'data': serialize_business(business), 'message': 'Business created successfully.'}


@router.get('/categories')
def categories(db: Session = Depends(get_db)):
    categories = db.query(BusinessCategory).filter(BusinessCategory.is_active.is_(True)).all()
    return {'success': True, 'data': [{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in categories], 'message': 'Categories loaded.'}
