import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login():
    response = client.post("/api/auth/login", json={
        "email": "admin@saas.com",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@saas.com"

def test_register():
    # This test may fail if the user already exists
    response = client.post("/api/auth/register", json={
        "email": "testuser@example.com",
        "password": "testpass",
        "name": "Test User",
        "role": "org_support"
    })
    assert response.status_code in (200, 400)  # 400 if already exists

def test_get_organizations():
    login_resp = client.post("/api/auth/login", json={
        "email": "admin@saas.com",
        "password": "password"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/organizations", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_platform_analytics():
    login_resp = client.post("/api/auth/login", json={
        "email": "admin@saas.com",
        "password": "password"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/analytics/platform", headers=headers)
    assert response.status_code == 200
    assert "total_messages" in response.json()

def test_get_organization_analytics():
    login_resp = client.post("/api/auth/login", json={
        "email": "admin@saas.com",
        "password": "password"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    # Get orgs
    orgs_resp = client.get("/api/organizations", headers=headers)
    orgs = orgs_resp.json()
    if orgs:
        org_id = orgs[0]["id"]
        response = client.get(f"/api/organizations/{org_id}/analytics", headers=headers)
        assert response.status_code == 200
        assert "total_messages" in response.json()
    else:
        pytest.skip("No organizations found to test analytics.")
