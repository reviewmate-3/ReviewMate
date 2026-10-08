from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_authorized_business, get_current_user
from app.db.session import get_db
from app.models.business_member import BusinessMember
from app.models.user import User
from app.schemas.tenancy import MemberInvite

router = APIRouter(prefix='/members', tags=['members'])


@router.get('/')
def list_members(business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    business = get_authorized_business(business_id, db, current_user)
    members = db.query(BusinessMember, User).join(User, User.id == BusinessMember.user_id).filter(BusinessMember.business_id == business.id).all()
    return {'success': True, 'data': [{'id': str(member.id), 'user_id': str(user.id), 'name': user.name, 'email': user.email, 'role': member.role, 'status': member.status} for member, user in members], 'message': 'Members loaded.'}


@router.post('/', status_code=status.HTTP_201_CREATED)
def invite_member(payload: MemberInvite, business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    business = get_authorized_business(business_id, db, current_user)
    if business.owner_id != current_user.id and current_user.role != 'SUPER_ADMIN':
        raise HTTPException(status_code=403, detail='Business owner access required')
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail='User must register before being added to a business')
    existing = db.query(BusinessMember).filter(BusinessMember.business_id == business.id, BusinessMember.user_id == user.id).first()
    if existing:
        raise HTTPException(status_code=409, detail='User is already a member')
    member = BusinessMember(business_id=business.id, user_id=user.id, role=payload.role, status='ACTIVE', joined_at=datetime.utcnow())
    db.add(member)
    db.commit()
    db.refresh(member)
    return {'success': True, 'data': {'id': str(member.id), 'user_id': str(user.id), 'email': user.email, 'role': member.role, 'status': member.status}, 'message': 'Member added.'}