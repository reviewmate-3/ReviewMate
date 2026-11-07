import sys
from getpass import getpass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User


def main() -> None:
    name = input('Super-admin name: ').strip()
    email = input('Super-admin email: ').strip().lower()
    password = getpass('Super-admin password (minimum 8 characters): ')

    if len(name) < 2:
        raise SystemExit('Name must contain at least 2 characters.')
    if len(password) < 8:
        raise SystemExit('Password must contain at least 8 characters.')

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            if existing.role != 'SUPER_ADMIN':
                raise SystemExit('That email already belongs to a non-admin account.')
            existing.name = name
            existing.password_hash = hash_password(password)
            existing.is_active = True
            db.commit()
            print(f'Updated active SUPER_ADMIN: {email}')
            return

        db.add(User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role='SUPER_ADMIN',
            is_active=True,
        ))
        db.commit()
        print(f'Created SUPER_ADMIN: {email}')
    finally:
        db.close()


if __name__ == '__main__':
    main()
