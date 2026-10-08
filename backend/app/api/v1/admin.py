from fastapi import APIRouter, Depends

from app.api.deps import get_current_business_owner

router = APIRouter(prefix='/admin', tags=['admin'])


@router.get('/overview')
def overview(current_user=Depends(get_current_business_owner)):
    return {'success': True, 'data': {'platform': 'reviewmate', 'user': current_user.email}, 'message': 'Admin overview loaded.'}
