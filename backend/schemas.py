from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

# Enums
class UserRole(str, Enum):
    SAAS_OWNER = "saas_owner"
    ORG_ADMIN = "org_admin"
    ORG_MANAGER = "org_manager"
    ORG_SUPPORT = "org_support"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class DocumentStatus(str, Enum):
    PROCESSING = "processing"
    PROCESSED = "processed"
    ERROR = "error"

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole

class UserCreate(UserBase):
    password: str
    organization_id: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    organization_id: Optional[int]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    industry: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    admin_email: EmailStr
    admin_name: str
    admin_password: str

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    subscription_status: Optional[SubscriptionStatus] = None

class OrganizationResponse(OrganizationBase):
    id: int
    subscription_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Configuration schemas
class ConfigurationBase(BaseModel):
    whatsapp_config: Dict[str, Any] = {}
    telegram_config: Dict[str, Any] = {}
    ai_config: Dict[str, Any] = {}
    appointment_settings: Dict[str, Any] = {}

class ConfigurationCreate(ConfigurationBase):
    organization_id: int

class ConfigurationUpdate(ConfigurationBase):
    pass

class ConfigurationResponse(ConfigurationBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    name: str
    type: str
    url: Optional[str] = None

class DocumentCreate(DocumentBase):
    organization_id: Optional[int] = None
    file_path: Optional[str] = None
    size: Optional[int] = None

class DocumentResponse(DocumentBase):
    id: int
    organization_id: int
    file_path: Optional[str]
    size: Optional[int]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Service Type schemas
class ServiceTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int
    price: float = 0.0

class ServiceTypeCreate(ServiceTypeBase):
    organization_id: Optional[int] = None

class ServiceTypeUpdate(ServiceTypeBase):
    is_active: Optional[bool] = None

class ServiceTypeResponse(ServiceTypeBase):
    id: int
    organization_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Appointment schemas
class AppointmentBase(BaseModel):
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    appointment_date: datetime
    channel: Optional[str] = None
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    organization_id: Optional[int] = None
    service_type_id: int

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    organization_id: int
    service_type_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Message schemas
class MessageBase(BaseModel):
    customer_id: str
    channel: str
    content: str
    message_type: str = "text"

class MessageCreate(MessageBase):
    organization_id: Optional[int] = None
    is_from_customer: bool = True
    response_time: Optional[float] = None

class MessageResponse(MessageBase):
    id: int
    organization_id: int
    is_from_customer: bool
    response_time: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analytics schemas
class AnalyticsData(BaseModel):
    total_messages: int
    total_appointments: int
    active_users: int
    avg_response_time: float
    channel_breakdown: Dict[str, int]
    appointment_status_breakdown: Dict[str, int]
    daily_activity: List[Dict[str, Any]]
    monthly_trends: List[Dict[str, Any]]