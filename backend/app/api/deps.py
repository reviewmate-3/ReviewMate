from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from uuid import UUID

from app.config import settings
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.models.business import Business
from app.models.business_member import BusinessMember

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/login')


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication credentials')
    email = payload.get('sub')
    if payload.get('type') != 'access':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Access token required')
    if email is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token payload')
    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found or inactive')
    return user


def get_current_business_owner(current_user: User = Depends(get_current_user)):
    if current_user.role not in {'BUSINESS_OWNER', 'SUPER_ADMIN'}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Business owner access required')
    return current_user


def get_authorized_business(business_id: str, db: Session, current_user: User) -> Business:
    try:
        business_uuid = UUID(business_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail='Invalid business id') from exc

    business = db.query(Business).filter(Business.id == business_uuid, Business.is_active.is_(True)).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')
    if current_user.role == 'SUPER_ADMIN' or business.owner_id == current_user.id:
        return business

    member = db.query(BusinessMember).filter(
        BusinessMember.business_id == business.id,
        BusinessMember.user_id == current_user.id,
        BusinessMember.status == 'ACTIVE',
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail='Business access required')
    return business
