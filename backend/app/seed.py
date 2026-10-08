from datetime import datetime

from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.business import Business
from app.models.business_category import BusinessCategory
from app.models.review_session import ReviewSession
from app.models.service import Service
from app.models.user import User


def seed_demo_data() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    categories = [
        'Mobile Repair',
        'Laptop & Computer Repair',
        'Restaurant',
        'Salon & Beauty',
        'Gym & Fitness',
        'Car Service',
        'Dental Clinic',
        'Electronics Store',
        'Hotel',
        'Home Services',
        'Other',
    ]

    for name in categories:
        slug = name.lower().replace('&', 'and').replace(' ', '-')
        exists = db.query(BusinessCategory).filter_by(slug=slug).first()
        if not exists:
            db.add(BusinessCategory(name=name, slug=slug, description=name, is_active=True, created_at=datetime.utcnow()))

    owner_email = 'owner@reviewmate.app'
    owner = db.query(User).filter_by(email=owner_email).first()
    if not owner:
        owner = User(
            name='Demo Business Owner',
            email=owner_email,
            password_hash=hash_password('DemoOwner123!'),
            role='BUSINESS_OWNER',
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(owner)
        db.flush()

    category = db.query(BusinessCategory).filter_by(slug='mobile-repair').first()
    business = db.query(Business).filter_by(slug='the-i-service').first()
    if not business and category:
        business = Business(
            owner_id=owner.id,
            name='The I-Service',
            slug='the-i-service',
            category_id=category.id,
            description='Mobile repair and device support in Hyderabad',
            city='Hyderabad',
            phone='+91 98765 43210',
            email='hello@theiservice.example',
            logo_url='',
            primary_color='#1f2937',
            google_review_url='https://www.google.com/search?q=The+I-Service+Hyderabad',
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(business)
        db.flush()

    default_services = [
        ('Screen Replacement', 'Smartphone display replacement and calibration'),
        ('Battery Replacement', 'Battery replacement for damaged or worn-out phones'),
        ('Charging Port Repair', 'Charging port diagnosis and replacement'),
    ]
    for service_name, description in default_services:
        exists = db.query(Service).filter(Service.business_id == business.id, Service.name == service_name).first() if business else None
        if business and not exists:
            db.add(Service(
                business_id=business.id,
                name=service_name,
                description=description,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            ))

    sample_review = db.query(ReviewSession).filter_by(business_id=business.id).first() if business else None
    if business and not sample_review:
        db.add(ReviewSession(
            business_id=business.id,
            service_id=db.query(Service).filter(Service.business_id == business.id, Service.name == 'Screen Replacement').first().id if db.query(Service).filter(Service.business_id == business.id, Service.name == 'Screen Replacement').first() else None,
            rating=5,
            customer_feedback='Fast service, clear communication, and the device was fixed perfectly.',
            generated_review='I used the Screen Replacement service at The I-Service. Fast service, clear communication, and the device was fixed perfectly.',
            customer_edited_review='Fast service, clear communication, and the device was fixed perfectly.',
            google_clicked=False,
            created_at=datetime.utcnow(),
        ))

    db.commit()
    db.close()


if __name__ == '__main__':
    seed_demo_data()
    print('Seed data loaded.')
    print('Business owner login: owner@reviewmate.app / DemoOwner123!')
    print('Demo business public slug: the-i-service')
