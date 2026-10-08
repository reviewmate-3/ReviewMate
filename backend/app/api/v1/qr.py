import io
from uuid import UUID

import qrcode
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_business_owner
from app.db.session import get_db
from app.models.business import Business
from app.models.qr_code import QRCode

router = APIRouter(prefix='/qr', tags=['qr'])


@router.post('/generate')
def generate_qr(business_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_business_owner)):
    try:
        business_uuid = UUID(business_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail='Invalid business id') from exc

    business = db.query(Business).filter(Business.id == business_uuid, Business.owner_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail='Business not found')

    destination_url = f'https://reviewmate.com/r/{business.slug}'
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(destination_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    record = QRCode(
        business_id=business.id,
        name=f'{business.name} QR',
        destination_url=destination_url,
        scan_count=0,
        is_active=True,
    )
    db.add(record)
    db.commit()

    return Response(content=buffer.getvalue(), media_type='image/png', headers={'X-QR-URL': destination_url})
