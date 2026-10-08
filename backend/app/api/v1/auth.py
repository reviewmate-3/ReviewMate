import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.config import settings
from app.db.session import get_db
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.auth import RefreshTokenRequest, TokenResponse, UserOut, UserLoginRequest, UserRegisterRequest
from app.schemas.common import ApiResponse

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register', status_code=status.HTTP_201_CREATED)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')

    user = User(
        name=payload.name,
        email=email,
        password_hash=hash_password(payload.password),
        role='BUSINESS_OWNER',
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        'success': True,
        'data': {
            'id': str(user.id),
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
        },
        'message': 'User registered successfully.'
    }


@router.post('/login')
def login(payload: UserLoginRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid email or password')

    access = create_access_token(user.email)
    refresh_jti = str(uuid.uuid4())
    refresh = create_refresh_token(user.email, refresh_jti)
    db.add(RefreshToken(
        jti=refresh_jti,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()
    return {
        'success': True,
        'data': {
            'access_token': access,
            'refresh_token': refresh,
            'token_type': 'bearer',
            'user': {
                'id': str(user.id),
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active,
            },
        },
        'message': 'Login successful.'
    }


@router.post('/refresh')
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    claims = decode_token(payload.refresh_token)
    if not claims or claims.get('type') != 'refresh' or not claims.get('jti'):
        raise HTTPException(status_code=401, detail='Invalid refresh token')

    stored = db.query(RefreshToken).filter(RefreshToken.jti == claims['jti'], RefreshToken.revoked.is_(False)).first()
    if not stored or stored.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=401, detail='Refresh token expired or revoked')

    user = db.query(User).filter(User.id == stored.user_id, User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(status_code=401, detail='User not found or inactive')

    stored.revoked = True
    stored.revoked_at = datetime.utcnow()
    new_jti = str(uuid.uuid4())
    new_refresh = create_refresh_token(user.email, new_jti)
    db.add(RefreshToken(
        jti=new_jti,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()
    return {'success': True, 'data': {'access_token': create_access_token(user.email), 'refresh_token': new_refresh, 'token_type': 'bearer'}, 'message': 'Token refreshed.'}


@router.post('/logout')
def logout(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    claims = decode_token(payload.refresh_token)
    if claims and claims.get('type') == 'refresh' and claims.get('jti'):
        stored = db.query(RefreshToken).filter(RefreshToken.jti == claims['jti'], RefreshToken.revoked.is_(False)).first()
        if stored:
            stored.revoked = True
            stored.revoked_at = datetime.utcnow()
            db.commit()
    return {'success': True, 'data': {}, 'message': 'Logged out successfully.'}


@router.get('/me')
def me(current_user: User = Depends(get_current_user)):
    return {
        'success': True,
        'data': {
            'id': str(current_user.id),
            'name': current_user.name,
            'email': current_user.email,
            'role': current_user.role,
            'is_active': current_user.is_active,
        },
        'message': 'Current user loaded.'
    }
