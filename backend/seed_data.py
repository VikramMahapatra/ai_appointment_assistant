from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Organization, User, ServiceType, Appointment, Message, Analytics
from crud import create_user, create_organization
from schemas import UserCreate, OrganizationCreate, UserRole
from auth import get_password_hash
from datetime import datetime, timedelta
import random

# Indian sample data
INDIAN_ORGS = [
    {"name": "Mumbai Tech Innovators", "industry": "Technology", "admin_email": "admin@mumbaitech.in", "admin_name": "Amit Sharma"},
    {"name": "Delhi HealthCare", "industry": "Healthcare", "admin_email": "admin@delhihealth.in", "admin_name": "Priya Singh"},
    {"name": "Bangalore Legal Experts", "industry": "Legal", "admin_email": "admin@blrlegal.in", "admin_name": "Rahul Verma"},
    {"name": "Chennai FinServ", "industry": "Finance", "admin_email": "admin@chennaifin.in", "admin_name": "Lakshmi Iyer"},
]

INDIAN_SERVICE_TYPES = [
    {"name": "Consultation", "description": "General consultation", "duration": 30, "price": 500.0},
    {"name": "Follow-up", "description": "Follow-up appointment", "duration": 15, "price": 300.0},
    {"name": "Legal Advice", "description": "Legal advisory session", "duration": 45, "price": 1500.0},
    {"name": "Tax Planning", "description": "Tax planning session", "duration": 60, "price": 2000.0},
]

INDIAN_CUSTOMERS = [
    {"name": "Rohit Patil", "email": "rohit.patil@example.com", "phone": "9876543210"},
    {"name": "Sneha Desai", "email": "sneha.desai@example.com", "phone": "9123456780"},
    {"name": "Vikram Joshi", "email": "vikram.joshi@example.com", "phone": "9988776655"},
    {"name": "Anjali Mehta", "email": "anjali.mehta@example.com", "phone": "9001122334"},
]

INDIAN_MESSAGES = [
    "Namaste, mujhe appointment book karni hai.",
    "Kya aap mujhe kal ka slot de sakte hain?",
    "Dhanyavaad! Appointment confirm ho gayi.",
    "Main thoda late ho jaunga.",
    "Kya aap mujhe prescription bhej sakte hain?",
]

METRICS = [
    ("total_appointments", 120),
    ("avg_response_time", 45.2),
    ("active_users", 35),
]

def create_seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create SaaS Owner
        saas_owner = UserCreate(
            email="admin@saas.com",
            name="SaaS Owner",
            password="password",
            role=UserRole.SAAS_OWNER
        )
        create_user(db, saas_owner)

        # Create Indian organizations and their admin users
        org_objs = []
        for org in INDIAN_ORGS:
            org_create = OrganizationCreate(
                name=org["name"],
                industry=org["industry"],
                admin_email=org["admin_email"],
                admin_name=org["admin_name"],
                admin_password="password"
            )
            org_obj = create_organization(db, org_create)
            org_objs.append(org_obj)

        db.commit()

        # Add service types, appointments, messages, analytics for each org
        for org in org_objs:
            # Service Types
            service_types = []
            for st in INDIAN_SERVICE_TYPES:
                s = ServiceType(
                    organization_id=org.id,
                    name=st["name"],
                    description=st["description"],
                    duration=st["duration"],
                    price=st["price"]
                )
                db.add(s)
                db.commit()
                db.refresh(s)
                service_types.append(s)

            # Appointments
            for i in range(3):
                cust = random.choice(INDIAN_CUSTOMERS)
                st = random.choice(service_types)
                appt = Appointment(
                    organization_id=org.id,
                    service_type_id=st.id,
                    customer_name=cust["name"],
                    customer_email=cust["email"],
                    customer_phone=cust["phone"],
                    appointment_date=datetime.now() + timedelta(days=random.randint(1, 10)),
                    status=random.choice(["scheduled", "confirmed", "completed"]),
                    channel=random.choice(["whatsapp", "telegram"]),
                    notes="Auto-generated appointment"
                )
                db.add(appt)
                db.commit()

            # Messages
            for i in range(3):
                msg = Message(
                    organization_id=org.id,
                    customer_id=str(random.randint(1000, 9999)),
                    channel=random.choice(["whatsapp", "telegram"]),
                    message_type="text",
                    content=random.choice(INDIAN_MESSAGES),
                    is_from_customer=random.choice([True, False]),
                    response_time=random.uniform(10, 120)
                )
                db.add(msg)
                db.commit()

            # Analytics
            for metric, value in METRICS:
                analytics = Analytics(
                    organization_id=org.id,
                    metric_name=metric,
                    metric_value=value + random.uniform(-10, 10),
                    date=datetime.now(),
                    analytics_metadata={"region": "India"}
                )
                db.add(analytics)
                db.commit()

        print("Indian-flavored seed data created successfully!")
    except Exception as e:
        print(f"Error creating seed data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()