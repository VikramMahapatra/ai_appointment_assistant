from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from datetime import datetime, timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import *
from schemas import *
from auth import create_access_token, verify_token, get_password_hash, verify_password
from crud import *

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Appointment Assistant API",
    description="Multi-tenant SaaS platform for AI-powered appointment booking",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = get_user_by_id(db, payload.get("sub"))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# Authentication endpoints
@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_credentials.email)
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "organization_id": user.organization_id,
            "organization_name": user.organization.name if user.organization else None,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }
    }

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    if get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = create_user(db, user_data)
    return user

# Organization endpoints
@app.get("/api/organizations", response_model=List[OrganizationResponse])
async def get_organizations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    return get_all_organizations(db)

@app.post("/api/organizations", response_model=OrganizationResponse)
async def create_organization_endpoint(
    org_data: OrganizationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    return create_organization(db, org_data)

@app.get("/api/organizations/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "saas_owner" and current_user.organization_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    org = get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org

@app.put("/api/organizations/{org_id}", response_model=OrganizationResponse)
async def update_organization_endpoint(
    org_id: int,
    org_data: OrganizationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["saas_owner", "org_admin"] or \
       (current_user.role == "org_admin" and current_user.organization_id != org_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    org = update_organization(db, org_id, org_data)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org

# Configuration endpoints
@app.get("/api/organizations/{org_id}/config", response_model=ConfigurationResponse)
async def get_configuration(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    config = get_organization_config(db, org_id)
    if not config:
        # Create default config if none exists
        config_data = ConfigurationCreate(
            organization_id=org_id,
            whatsapp_config={},
            telegram_config={},
            ai_config={}
        )
        config = create_configuration(db, config_data)
    
    return config

@app.put("/api/organizations/{org_id}/config", response_model=ConfigurationResponse)
async def update_configuration_endpoint(
    org_id: int,
    config_data: ConfigurationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    config = update_configuration(db, org_id, config_data)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuration not found"
        )
    return config

# Knowledge Base endpoints
@app.get("/api/organizations/{org_id}/documents", response_model=List[DocumentResponse])
async def get_documents(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_organization_documents(db, org_id)

@app.post("/api/organizations/{org_id}/documents", response_model=DocumentResponse)
async def create_document_endpoint(
    org_id: int,
    doc_data: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    doc_data.organization_id = org_id
    return create_document(db, doc_data)

@app.delete("/api/organizations/{org_id}/documents/{doc_id}")
async def delete_document_endpoint(
    org_id: int,
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    success = delete_document(db, doc_id, org_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return {"message": "Document deleted successfully"}

# Service Type endpoints
@app.get("/api/organizations/{org_id}/service-types", response_model=List[ServiceTypeResponse])
async def get_service_types(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_organization_service_types(db, org_id)

@app.post("/api/organizations/{org_id}/service-types", response_model=ServiceTypeResponse)
async def create_service_type_endpoint(
    org_id: int,
    service_data: ServiceTypeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    service_data.organization_id = org_id
    return create_service_type(db, service_data)

# Appointment endpoints
@app.get("/api/organizations/{org_id}/appointments", response_model=List[AppointmentResponse])
async def get_appointments(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_organization_appointments(db, org_id)

@app.post("/api/organizations/{org_id}/appointments", response_model=AppointmentResponse)
async def create_appointment_endpoint(
    org_id: int,
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    appointment_data.organization_id = org_id
    return create_appointment(db, appointment_data)

# Analytics endpoints
@app.get("/api/organizations/{org_id}/analytics")
async def get_organization_analytics(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_analytics_data(db, org_id)

@app.get("/api/analytics/platform")
async def get_platform_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_platform_analytics_data(db)

# Message endpoints
@app.get("/api/organizations/{org_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    org_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return get_organization_messages(db, org_id)

@app.post("/api/organizations/{org_id}/messages", response_model=MessageResponse)
async def create_message_endpoint(
    org_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.organization_id != org_id and current_user.role != "saas_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    message_data.organization_id = org_id
    return create_message(db, message_data)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)