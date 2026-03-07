from sqlalchemy import Column, String, Boolean, DateTime, Text, Enum, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import uuid

# Helper function to generate UUID
def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "USERS"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'doctor', 'patient', name='user_role'), nullable=False)
    is_active = Column(Boolean, default=True)
    country = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="user", uselist=False)
    patient = relationship("Patient", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")


class Doctor(Base):
    __tablename__ = "DOCTORS"
    
    doctor_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("USERS.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    medical_license_number = Column(String(50), unique=True, nullable=False)
    specialty = Column(String(100))
    verification_status = Column(Enum('pending', 'verified', 'rejected', name='verification_status'), default='pending')
    verified_by = Column(String(36), ForeignKey("USERS.id", ondelete="SET NULL"))
    
    # Relationships
    user = relationship("User", back_populates="doctor", foreign_keys=[user_id])
    verifier = relationship("User", foreign_keys=[verified_by])
    assigned_cases = relationship("PatientCase", back_populates="assigned_doctor")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    ai_feedbacks = relationship("AIFeedback", back_populates="doctor")


class Patient(Base):
    __tablename__ = "PATIENTS"
    
    patient_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("USERS.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    national_id = Column(String(255), unique=True, nullable=False)
    date_of_birth = Column(DateTime)
    blood_type = Column(Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', name='blood_type'))
    phone_number = Column(String(20))
    
    # Relationships
    user = relationship("User", back_populates="patient")
    consents = relationship("PatientConsent", back_populates="patient")
    cases = relationship("PatientCase", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")


class PatientConsent(Base):
    __tablename__ = "PATIENT_CONSENTS"
    
    consent_id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("PATIENTS.patient_id", ondelete="CASCADE"), nullable=False, index=True)
    allow_ai_retraining = Column(Boolean, default=False)
    allow_data_sharing = Column(Boolean, default=False)
    signed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="consents")


class Appointment(Base):
    __tablename__ = "APPOINTMENTS"
    
    appt_id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("PATIENTS.patient_id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(String(36), ForeignKey("DOCTORS.doctor_id", ondelete="CASCADE"), nullable=False)
    appointment_date = Column(DateTime, nullable=False, index=True)
    status = Column(Enum('scheduled', 'completed', 'cancelled', name='appointment_status'), default='scheduled', index=True)
    notes = Column(Text)
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments", foreign_keys=[patient_id])
    doctor = relationship("Doctor", back_populates="appointments", foreign_keys=[doctor_id])


class PatientCase(Base):
    __tablename__ = "PATIENT_CASES"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    case_code = Column(String(50), unique=True, nullable=False, index=True)
    patient_id = Column(String(36), ForeignKey("PATIENTS.patient_id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_doctor_id = Column(String(36), ForeignKey("DOCTORS.doctor_id", ondelete="SET NULL"), index=True)
    icd_10_code = Column(String(10))
    status = Column(Enum('active', 'in_progress', 'completed', 'archived', name='case_status'), default='active', index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="cases")
    assigned_doctor = relationship("Doctor", back_populates="assigned_cases")
    images = relationship("CaseImage", back_populates="case")


class CaseImage(Base):
    __tablename__ = "CASE_IMAGES"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    case_id = Column(String(36), ForeignKey("PATIENT_CASES.id", ondelete="CASCADE"), nullable=False, index=True)
    file_type = Column(String(50))
    original_dicom_url = Column(Text)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    case = relationship("PatientCase", back_populates="images")
    diagnosis_result = relationship("DiagnosisResult", back_populates="image", uselist=False)


class DiagnosisResult(Base):
    __tablename__ = "DIAGNOSIS_RESULTS"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    image_id = Column(String(36), ForeignKey("CASE_IMAGES.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    ai_stage = Column(Enum('low_risk', 'medium_risk', 'high_risk', 'cancerous', name='ai_stage'), nullable=False, index=True)
    confidence = Column(DECIMAL(5, 4))
    ai_mask_url = Column(Text)
    model_version = Column(String(50))
    
    # Relationships
    image = relationship("CaseImage", back_populates="diagnosis_result")
    ai_feedbacks = relationship("AIFeedback", back_populates="result")


class AIFeedback(Base):
    __tablename__ = "AI_FEEDBACKS"
    
    feedback_id = Column(String(36), primary_key=True, default=generate_uuid)
    result_id = Column(String(36), ForeignKey("DIAGNOSIS_RESULTS.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(String(36), ForeignKey("DOCTORS.doctor_id", ondelete="CASCADE"), nullable=False, index=True)
    is_correct = Column(Boolean)
    doctor_comment = Column(Text)
    doctor_corrected_mask_url = Column(Text)
    reviewed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    result = relationship("DiagnosisResult", back_populates="ai_feedbacks")
    doctor = relationship("Doctor", back_populates="ai_feedbacks")


class AuditLog(Base):
    __tablename__ = "AUDIT_LOGS"
    
    log_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("USERS.id", ondelete="CASCADE"), nullable=False, index=True)
    action = Column(Enum('READ', 'UPDATE', 'DELETE', 'CREATE', name='audit_action'), nullable=False, index=True)
    table_name = Column(String(100))
    record_id = Column(String(36))
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    ip_address = Column(String(45))
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")


class ChatSession(Base):
    __tablename__ = "CHAT_SESSIONS"
    
    session_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("USERS.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")


class ChatMessage(Base):
    __tablename__ = "CHAT_MESSAGES"
    
    message_id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("CHAT_SESSIONS.session_id", ondelete="CASCADE"), nullable=False, index=True)
    sender_type = Column(Enum('user', 'assistant', 'system', name='sender_type'), nullable=False)
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")