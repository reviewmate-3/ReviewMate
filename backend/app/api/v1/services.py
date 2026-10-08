from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_business_owner
from app.db.session import get_db
from app.models.business import Business
from app.models.service import Service
from app.schemas.service import ServiceCreate

router = APIRouter(prefix='/services', tags=['services'])


def serialize_service(service: Service) -> dict:
    return {
        'id': str(service.id),
        'business_id': str(service.business_id),
        'name': service.name,
        'description': service.description,
        'is_active': service.is_active,
    }


@router.get('/')
def list_services(business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    try:
        business_uuid = UUID(business_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail='Invalid business id') from exc

    business = db.query(Business).filter(Business.id == business_uuid, Business.owner_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')
    services = db.query(Service).filter(Service.business_id == business.id).order_by(Service.created_at.desc()).all()
    return {'success': True, 'data': [serialize_service(service) for service in services], 'message': 'Services loaded.'}


@router.post('/')
def create_service(payload: ServiceCreate, business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    try:
        business_uuid = UUID(business_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail='Invalid business id') from exc

    business = db.query(Business).filter(Business.id == business_uuid, Business.owner_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')
    service = Service(
        business_id=business.id,
        name=payload.name,
        description=payload.description,
        is_active=payload.is_active,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return {'success': True, 'data': serialize_service(service), 'message': 'Service created.'}
