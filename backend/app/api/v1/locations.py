from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_authorized_business, get_current_user
from app.db.session import get_db
from app.models.location import Location
from app.schemas.tenancy import LocationCreate

router = APIRouter(prefix='/locations', tags=['locations'])


def serialize_location(location: Location) -> dict:
    return {
        'id': str(location.id),
        'business_id': str(location.business_id),
        'name': location.name,
        'address': location.address,
        'city': location.city,
        'phone': location.phone,
        'google_review_url': location.google_review_url,
        'timezone': location.timezone,
        'is_active': location.is_active,
    }


@router.get('/')
def list_locations(business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    business = get_authorized_business(business_id, db, current_user)
    records = db.query(Location).filter(Location.business_id == business.id).order_by(Location.created_at.asc()).all()
    return {'success': True, 'data': [serialize_location(record) for record in records], 'message': 'Locations loaded.'}


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_location(payload: LocationCreate, business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    business = get_authorized_business(business_id, db, current_user)
    if business.owner_id != current_user.id and current_user.role != 'SUPER_ADMIN':
        raise HTTPException(status_code=403, detail='Business owner access required')
    location = Location(business_id=business.id, created_at=datetime.utcnow(), updated_at=datetime.utcnow(), **payload.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return {'success': True, 'data': serialize_location(location), 'message': 'Location created.'}