from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'


def test_register_and_login_flow():
    payload = {
        'name': 'Owner One',
        'email': 'owner1@example.com',
        'password': 'StrongPass123!'
    }

    register = client.post('/api/v1/auth/register', json=payload)
    assert register.status_code == 201, register.text
    data = register.json()
    assert data['success'] is True
    assert data['data']['email'] == payload['email']

    login = client.post('/api/v1/auth/login', json={
        'email': payload['email'],
        'password': payload['password']
    })
    assert login.status_code == 200, login.text
    assert 'access_token' in login.json()['data']


def test_refresh_rotation_and_logout_revocation():
    email = 'owner.refresh@example.com'
    register = client.post('/api/v1/auth/register', json={
        'name': 'Refresh Owner',
        'email': email,
        'password': 'StrongPass123!',
    })
    assert register.status_code == 201, register.text

    login = client.post('/api/v1/auth/login', json={
        'email': email,
        'password': 'StrongPass123!',
    })
    original_refresh = login.json()['data']['refresh_token']

    refreshed = client.post('/api/v1/auth/refresh', json={'refresh_token': original_refresh})
    assert refreshed.status_code == 200, refreshed.text
    rotated_refresh = refreshed.json()['data']['refresh_token']
    assert rotated_refresh != original_refresh

    reused = client.post('/api/v1/auth/refresh', json={'refresh_token': original_refresh})
    assert reused.status_code == 401, reused.text

    logout = client.post('/api/v1/auth/logout', json={'refresh_token': rotated_refresh})
    assert logout.status_code == 200, logout.text
    revoked = client.post('/api/v1/auth/refresh', json={'refresh_token': rotated_refresh})
    assert revoked.status_code == 401, revoked.text


def test_business_and_service_flow():
    email = 'owner.business@example.com'
    register = client.post('/api/v1/auth/register', json={
        'name': 'Business Owner',
        'email': email,
        'password': 'StrongPass123!'
    })
    assert register.status_code == 201, register.text

    login = client.post('/api/v1/auth/login', json={
        'email': email,
        'password': 'StrongPass123!'
    })
    token = login.json()['data']['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    business = client.post('/api/v1/businesses/', json={
        'name': 'City Auto Care',
        'city': 'Hyderabad',
        'description': 'Auto service and detailing',
        'phone': '+91 98765 43210',
        'email': 'hello@cityautocare.example',
        'google_review_url': 'https://example.com/review'
    }, headers=headers)
    assert business.status_code == 201, business.text
    business_data = business.json()['data']
    assert business_data['name'] == 'City Auto Care'
    assert business_data['slug']

    listed = client.get('/api/v1/businesses/', headers=headers)
    assert listed.status_code == 200, listed.text
    assert any(item['name'] == 'City Auto Care' for item in listed.json()['data'])

    service = client.post('/api/v1/services/?business_id=' + business_data['id'], json={
        'name': 'Oil Change',
        'description': 'Full synthetic engine oil service',
        'is_active': True
    }, headers=headers)
    assert service.status_code == 200, service.text
    assert service.json()['data']['name'] == 'Oil Change'

    services = client.get('/api/v1/services/?business_id=' + business_data['id'], headers=headers)
    assert services.status_code == 200, services.text
    assert any(item['name'] == 'Oil Change' for item in services.json()['data'])


def test_public_business_review_flow():
    email = 'owner.public@example.com'
    register = client.post('/api/v1/auth/register', json={
        'name': 'Public Owner',
        'email': email,
        'password': 'StrongPass123!'
    })
    assert register.status_code == 201, register.text

    login = client.post('/api/v1/auth/login', json={
        'email': email,
        'password': 'StrongPass123!'
    })
    token = login.json()['data']['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    business = client.post('/api/v1/businesses/', json={
        'name': 'City Wash & Care',
        'city': 'Bengaluru',
        'description': 'Car wash and detailing',
        'phone': '+91 99999 00000',
        'email': 'hello@citywashcare.example',
        'google_review_url': 'https://example.com/google-review'
    }, headers=headers)
    assert business.status_code == 201, business.text
    business_slug = business.json()['data']['slug']

    service = client.post(f'/api/v1/services/?business_id={business.json()["data"]["id"]}', json={
        'name': 'Car Wash',
        'description': 'Interior and exterior wash',
        'is_active': True,
    }, headers=headers)
    assert service.status_code == 200, service.text

    public_business = client.get(f'/api/v1/public/business/{business_slug}')
    assert public_business.status_code == 200, public_business.text
    assert public_business.json()['data']['business']['name'] == 'City Wash & Care'

    review_submission = client.post('/api/v1/public/review-session', json={
        'slug': business_slug,
        'service': 'Car Wash',
        'rating': 5,
        'feedback': 'The team was fast, professional, and the car looked spotless after the service.'
    })
    assert review_submission.status_code == 200, review_submission.text
    payload = review_submission.json()['data']
    assert payload['review']
    assert payload['redirect_url']


def test_tenant_locations_and_member_access():
    owner_email = 'tenant.owner@example.com'
    member_email = 'tenant.manager@example.com'
    outsider_email = 'tenant.outsider@example.com'
    for email, name in [(owner_email, 'Tenant Owner'), (member_email, 'Tenant Manager'), (outsider_email, 'Tenant Outsider')]:
        register = client.post('/api/v1/auth/register', json={
            'name': name,
            'email': email,
            'password': 'StrongPass123!',
        })
        assert register.status_code == 201, register.text

    def token_for(email):
        response = client.post('/api/v1/auth/login', json={'email': email, 'password': 'StrongPass123!'})
        assert response.status_code == 200, response.text
        return response.json()['data']['access_token']

    owner_headers = {'Authorization': f'Bearer {token_for(owner_email)}'}
    member_headers = {'Authorization': f'Bearer {token_for(member_email)}'}
    outsider_headers = {'Authorization': f'Bearer {token_for(outsider_email)}'}
    business = client.post('/api/v1/businesses/', json={'name': 'Tenant Location Shop'}, headers=owner_headers)
    assert business.status_code == 201, business.text
    business_id = business.json()['data']['id']

    location = client.post(f'/api/v1/locations/?business_id={business_id}', json={'name': 'Main Branch', 'city': 'Hyderabad'}, headers=owner_headers)
    assert location.status_code == 201, location.text

    invite = client.post(f'/api/v1/members/?business_id={business_id}', json={'email': member_email, 'role': 'MANAGER'}, headers=owner_headers)
    assert invite.status_code == 201, invite.text
    member_locations = client.get(f'/api/v1/locations/?business_id={business_id}', headers=member_headers)
    assert member_locations.status_code == 200, member_locations.text

    outsider_locations = client.get(f'/api/v1/locations/?business_id={business_id}', headers=outsider_headers)
    assert outsider_locations.status_code == 403, outsider_locations.text
