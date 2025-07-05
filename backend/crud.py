from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import json

from models import *
from schemas import *
from auth import get_password_hash

# User CRUD operations
def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password,
        role=user.role,
        organization_id=user.organization_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Organization CRUD operations
def get_all_organizations(db: Session) -> List[Organization]:
    return db.query(Organization).all()

def get_organization_by_id(db: Session, org_id: int) -> Optional[Organization]:
    return db.query(Organization).filter(Organization.id == org_id).first()

def create_organization(db: Session, org: OrganizationCreate) -> Organization:
    # Create organization
    db_org = Organization(
        name=org.name,
        industry=org.industry,
        subscription_status="active"
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    
    # Create admin user
    admin_user = UserCreate(
        email=org.admin_email,
        name=org.admin_name,
        password=org.admin_password,
        role=UserRole.ORG_ADMIN,
        organization_id=db_org.id
    )
    create_user(db, admin_user)
    
    return db_org

def update_organization(db: Session, org_id: int, org_update: OrganizationUpdate) -> Optional[Organization]:
    db_org = db.query(Organization).filter(Organization.id == org_id).first()
    if not db_org:
        return None
    
    update_data = org_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_org, field, value)
    
    db.commit()
    db.refresh(db_org)
    return db_org

# Configuration CRUD operations
def get_organization_config(db: Session, org_id: int) -> Optional[Configuration]:
    return db.query(Configuration).filter(Configuration.organization_id == org_id).first()

def create_configuration(db: Session, config: ConfigurationCreate) -> Configuration:
    db_config = Configuration(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def update_configuration(db: Session, org_id: int, config_update: ConfigurationUpdate) -> Optional[Configuration]:
    db_config = db.query(Configuration).filter(Configuration.organization_id == org_id).first()
    if not db_config:
        return None
    
    update_data = config_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_config, field, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

# Document CRUD operations
def get_organization_documents(db: Session, org_id: int) -> List[Document]:
    return db.query(Document).filter(Document.organization_id == org_id).all()

def create_document(db: Session, doc: DocumentCreate) -> Document:
    db_doc = Document(**doc.dict())
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def delete_document(db: Session, doc_id: int, org_id: int) -> bool:
    db_doc = db.query(Document).filter(
        and_(Document.id == doc_id, Document.organization_id == org_id)
    ).first()
    if not db_doc:
        return False
    
    db.delete(db_doc)
    db.commit()
    return True

# Service Type CRUD operations
def get_organization_service_types(db: Session, org_id: int) -> List[ServiceType]:
    return db.query(ServiceType).filter(ServiceType.organization_id == org_id).all()

def create_service_type(db: Session, service: ServiceTypeCreate) -> ServiceType:
    db_service = ServiceType(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# Appointment CRUD operations
def get_organization_appointments(db: Session, org_id: int) -> List[Appointment]:
    return db.query(Appointment).filter(Appointment.organization_id == org_id).all()

def create_appointment(db: Session, appointment: AppointmentCreate) -> Appointment:
    db_appointment = Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# Message CRUD operations
def get_organization_messages(db: Session, org_id: int) -> List[Message]:
    return db.query(Message).filter(Message.organization_id == org_id).all()

def create_message(db: Session, message: MessageCreate) -> Message:
    db_message = Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Analytics functions
def get_analytics_data(db: Session, org_id: int) -> Dict[str, Any]:
    # Get basic counts
    total_messages = db.query(Message).filter(Message.organization_id == org_id).count()
    total_appointments = db.query(Appointment).filter(Appointment.organization_id == org_id).count()
    active_users = db.query(User).filter(
        and_(User.organization_id == org_id, User.is_active == True)
    ).count()
    
    # Get average response time
    avg_response_time = db.query(func.avg(Message.response_time)).filter(
        and_(Message.organization_id == org_id, Message.response_time.isnot(None))
    ).scalar() or 0
    
    # Channel breakdown
    channel_data = db.query(
        Message.channel,
        func.count(Message.id).label('count')
    ).filter(Message.organization_id == org_id).group_by(Message.channel).all()
    
    channel_breakdown = {channel: count for channel, count in channel_data}
    
    # Appointment status breakdown
    status_data = db.query(
        Appointment.status,
        func.count(Appointment.id).label('count')
    ).filter(Appointment.organization_id == org_id).group_by(Appointment.status).all()
    
    appointment_status_breakdown = {status: count for status, count in status_data}
    
    # Daily activity (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    daily_messages = db.query(
        func.date(Message.created_at).label('date'),
        func.count(Message.id).label('count')
    ).filter(
        and_(Message.organization_id == org_id, Message.created_at >= seven_days_ago)
    ).group_by(func.date(Message.created_at)).all()
    
    daily_appointments = db.query(
        func.date(Appointment.created_at).label('date'),
        func.count(Appointment.id).label('count')
    ).filter(
        and_(Appointment.organization_id == org_id, Appointment.created_at >= seven_days_ago)
    ).group_by(func.date(Appointment.created_at)).all()
    
    # Convert to dict for easier processing
    daily_msg_dict = {str(date): count for date, count in daily_messages}
    daily_apt_dict = {str(date): count for date, count in daily_appointments}
    
    daily_activity = []
    for i in range(7):
        date = (datetime.utcnow() - timedelta(days=i)).date()
        date_str = str(date)
        daily_activity.append({
            'date': date_str,
            'messages': daily_msg_dict.get(date_str, 0),
            'appointments': daily_apt_dict.get(date_str, 0)
        })
    
    # Monthly trends (last 6 months)
    six_months_ago = datetime.utcnow() - timedelta(days=180)
    monthly_data = []
    for i in range(6):
        month_start = datetime.utcnow().replace(day=1) - timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        
        month_messages = db.query(Message).filter(
            and_(
                Message.organization_id == org_id,
                Message.created_at >= month_start,
                Message.created_at < month_end
            )
        ).count()
        
        month_appointments = db.query(Appointment).filter(
            and_(
                Appointment.organization_id == org_id,
                Appointment.created_at >= month_start,
                Appointment.created_at < month_end
            )
        ).count()
        
        monthly_data.append({
            'month': month_start.strftime('%b'),
            'messages': month_messages,
            'appointments': month_appointments
        })
    
    return {
        'total_messages': total_messages,
        'total_appointments': total_appointments,
        'active_users': active_users,
        'avg_response_time': round(avg_response_time, 2),
        'channel_breakdown': channel_breakdown,
        'appointment_status_breakdown': appointment_status_breakdown,
        'daily_activity': daily_activity,
        'monthly_trends': monthly_data
    }

def get_platform_analytics_data(db: Session) -> Dict[str, Any]:
    # Platform-wide statistics
    total_organizations = db.query(Organization).count()
    active_organizations = db.query(Organization).filter(
        Organization.subscription_status == 'active'
    ).count()
    total_users = db.query(User).count()
    total_messages = db.query(Message).count()
    total_appointments = db.query(Appointment).count()
    
    # Top performing organizations
    top_orgs = db.query(
        Organization.name,
        func.count(Message.id).label('message_count'),
        func.count(Appointment.id).label('appointment_count')
    ).outerjoin(Message).outerjoin(Appointment).group_by(
        Organization.id, Organization.name
    ).order_by(func.count(Message.id).desc()).limit(5).all()
    
    top_organizations = [
        {
            'name': name,
            'messages': msg_count or 0,
            'appointments': apt_count or 0
        }
        for name, msg_count, apt_count in top_orgs
    ]
    
    return {
        'total_organizations': total_organizations,
        'active_organizations': active_organizations,
        'total_users': total_users,
        'total_messages': total_messages,
        'total_appointments': total_appointments,
        'top_organizations': top_organizations
    }