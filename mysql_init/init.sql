-- =====================================================
-- JIxSAW Health Database Initialization Script
-- Project: Bladder Cancer Web Application
-- Database: MySQL 8.0
-- =====================================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS jixsaw_health;
USE jixsaw_health;

-- =====================================================
-- Table: USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS USERS (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    country VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Main user accounts for authentication';

-- =====================================================
-- Table: DOCTORS
-- =====================================================
CREATE TABLE IF NOT EXISTS DOCTORS (
    doctor_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    medical_license_number VARCHAR(50) NOT NULL UNIQUE,
    specialty VARCHAR(100),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by CHAR(36),
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES USERS(id) ON DELETE SET NULL,
    INDEX idx_verification_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medical professional information';

-- =====================================================
-- Table: PATIENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS PATIENTS (
    patient_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    national_id VARCHAR(255) NOT NULL UNIQUE COMMENT 'Encrypted',
    date_of_birth DATE,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    phone_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    INDEX idx_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Patient information with encrypted national ID';

-- =====================================================
-- Table: PATIENT_CONSENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS PATIENT_CONSENTS (
    consent_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id CHAR(36) NOT NULL,
    allow_ai_retraining BOOLEAN DEFAULT FALSE,
    allow_data_sharing BOOLEAN DEFAULT FALSE,
    signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: APPOINTMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS APPOINTMENTS (
    appt_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id) ON DELETE CASCADE,
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: PATIENT_CASES
-- =====================================================
CREATE TABLE IF NOT EXISTS PATIENT_CASES (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    case_code VARCHAR(50) NOT NULL UNIQUE,
    patient_id CHAR(36) NOT NULL,
    assigned_doctor_id CHAR(36),
    icd_10_code VARCHAR(10) COMMENT 'มาตรฐานรหัสโรค',
    status ENUM('active', 'in_progress', 'completed', 'archived') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_doctor_id) REFERENCES DOCTORS(doctor_id) ON DELETE SET NULL,
    INDEX idx_case_code (case_code),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (assigned_doctor_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medical cases for patients with ICD-10 codes';

-- =====================================================
-- Table: CASE_IMAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS CASE_IMAGES (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    case_id CHAR(36) NOT NULL,
    file_type VARCHAR(50),
    original_dicom_url TEXT COMMENT 'ภาพต้นฉบับ',
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES PATIENT_CASES(id) ON DELETE CASCADE,
    INDEX idx_case (case_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Medical images (DICOM format) for cases';

-- =====================================================
-- Table: DIAGNOSIS_RESULTS
-- =====================================================
CREATE TABLE IF NOT EXISTS DIAGNOSIS_RESULTS (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    image_id CHAR(36) NOT NULL UNIQUE,
    ai_stage ENUM('low_risk', 'medium_risk', 'high_risk', 'cancerous') NOT NULL,
    confidence DECIMAL(5,4) CHECK (confidence >= 0 AND confidence <= 1),
    ai_mask_url TEXT COMMENT 'ภาพที่ AI วาด Mask',
    model_version VARCHAR(50),
    FOREIGN KEY (image_id) REFERENCES CASE_IMAGES(id) ON DELETE CASCADE,
    INDEX idx_image (image_id),
    INDEX idx_ai_stage (ai_stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI analysis results for medical images';

-- =====================================================
-- Table: AI_FEEDBACKS
-- =====================================================
CREATE TABLE IF NOT EXISTS AI_FEEDBACKS (
    feedback_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    result_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    is_correct BOOLEAN,
    doctor_comment TEXT,
    doctor_corrected_mask_url TEXT COMMENT 'ภาพที่หมอวาดแก้',
    reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (result_id) REFERENCES DIAGNOSIS_RESULTS(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id) ON DELETE CASCADE,
    INDEX idx_result (result_id),
    INDEX idx_doctor (doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Doctor feedback on AI diagnoses for continuous learning';

-- =====================================================
-- Table: AUDIT_LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS AUDIT_LOGS (
    log_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    action ENUM('READ', 'UPDATE', 'DELETE', 'CREATE') NOT NULL,
    table_name VARCHAR(100),
    record_id VARCHAR(36),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: CHAT_SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS CHAT_SESSIONS (
    session_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: CHAT_MESSAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS CHAT_MESSAGES (
    message_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id CHAR(36) NOT NULL,
    sender_type ENUM('user', 'assistant', 'system') NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES CHAT_SESSIONS(session_id) ON DELETE CASCADE,
    INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT MOCK DATA (THAI CONTEXT) - 10 Records per table
-- =====================================================

-- =====================================================
-- 1. USERS (10 records: 1 admin, 4 doctors, 5 patients)
-- =====================================================
INSERT INTO USERS (id, email, password_hash, role, is_active, country, created_at) VALUES
-- Admin (1)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@jixsaw-hospital.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'admin', TRUE, 'Thailand', '2025-01-01 09:00:00'),

-- Doctors (4)
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'dr.somsak@jixsaw-hospital.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'doctor', TRUE, 'Thailand', '2025-01-02 10:00:00'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'dr.prapai@jixsaw-hospital.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'doctor', TRUE, 'Thailand', '2025-01-03 11:00:00'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'dr.wichai@jixsaw-hospital.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'doctor', TRUE, 'Thailand', '2025-01-04 12:00:00'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'dr.supaporn@jixsaw-hospital.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'doctor', TRUE, 'Thailand', '2025-01-05 13:00:00'),

-- Patients (5)
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'somsri.rakdee@gmail.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'patient', TRUE, 'Thailand', '2025-01-06 14:00:00'),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'prasert.sukjai@hotmail.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'patient', TRUE, 'Thailand', '2025-01-07 15:00:00'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'tawatchai.yim@yahoo.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'patient', TRUE, 'Thailand', '2025-01-08 16:00:00'),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'nittaya.saen@gmail.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'patient', TRUE, 'Thailand', '2025-01-09 17:00:00'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'somchai.kong@hotmail.com', '$2y$10$9KjQsERuB5nQK3XxYpQpQeFvYxKxYpQpQeFvYxKxYpQpQeFvYu', 'patient', TRUE, 'Thailand', '2025-01-10 18:00:00');

-- =====================================================
-- 2. DOCTORS (4 records + admin as doctor for verification)
-- =====================================================
INSERT INTO DOCTORS (doctor_id, user_id, first_name, last_name, medical_license_number, specialty, verification_status, verified_by) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'สมศักดิ์', 'ใจดี', 'ว.12345', 'ศัลยศาสตร์ระบบปัสสาวะ', 'verified', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'ประไพ', 'รักษาศรี', 'ว.12346', 'มะเร็งวิทยา', 'verified', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'วิชัย', 'เก่งการงาน', 'ว.12347', 'รังสีวิทยา', 'verified', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'สุภาพร', 'มีชัย', 'ว.12348', 'อายุรกรรมมะเร็ง', 'pending', NULL);

-- =====================================================
-- 3. PATIENTS (5 records)
-- =====================================================
INSERT INTO PATIENTS (patient_id, user_id, first_name, last_name, national_id, date_of_birth, blood_type, phone_number) VALUES
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'สมศรี', 'รักดี', '1100500123456', '1965-03-15', 'O+', '081-234-5678'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'ประเสริฐ', 'สุขใจ', '1100501234567', '1958-07-22', 'A+', '082-345-6789'),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'ทวีชัย', 'ยิ้มสวัสดิ์', '1100502345678', '1972-11-30', 'B+', '083-456-7890'),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'นิตยา', 'แสนดี', '1100503456789', '1969-05-10', 'AB+', '084-567-8901'),
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'สมชาย', 'คงกระพัน', '1100504567890', '1955-12-05', 'O-', '085-678-9012');

-- =====================================================
-- 4. PATIENT_CONSENTS (5 records - 1 per patient)
-- =====================================================
INSERT INTO PATIENT_CONSENTS (consent_id, patient_id, allow_ai_retraining, allow_data_sharing, signed_at) VALUES
(UUID(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', TRUE, TRUE, '2025-02-15 10:30:00'),
(UUID(), 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', TRUE, FALSE, '2025-02-16 14:45:00'),
(UUID(), 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', FALSE, FALSE, '2025-02-17 09:15:00'),
(UUID(), 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', TRUE, TRUE, '2025-02-18 11:00:00'),
(UUID(), 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', TRUE, FALSE, '2025-02-19 16:30:00');

-- =====================================================
-- 5. PATIENT_CASES (10 records)
-- =====================================================
INSERT INTO PATIENT_CASES (id, case_code, patient_id, assigned_doctor_id, icd_10_code, status, created_at) VALUES
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'HN-68-0001', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'C67.9', 'active', '2025-02-01 09:00:00'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'HN-68-0002', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'C67.8', 'in_progress', '2025-02-02 10:30:00'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'HN-68-0003', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'C67.0', 'completed', '2025-02-03 11:45:00'),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'HN-68-0004', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'C67.1', 'active', '2025-02-04 13:15:00'),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'HN-68-0005', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'C67.2', 'in_progress', '2025-02-05 14:30:00'),
('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'HN-68-0006', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'C67.9', 'active', '2025-02-06 15:45:00'),
('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'HN-68-0007', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'C67.3', 'archived', '2025-02-07 16:00:00'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a37', 'HN-68-0008', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'C67.4', 'completed', '2025-02-08 17:15:00'),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a38', 'HN-68-0009', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'C67.5', 'in_progress', '2025-02-09 18:30:00'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a39', 'HN-68-0010', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'C67.6', 'active', '2025-02-10 19:45:00');

-- =====================================================
-- 6. CASE_IMAGES (10 records)
-- =====================================================
INSERT INTO CASE_IMAGES (id, case_id, file_type, original_dicom_url, uploaded_at) VALUES
('f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a40', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0001/scan001.dcm', '2025-02-01 10:00:00'),
('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0001/scan002.dcm', '2025-02-01 10:05:00'),
('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0002/scan001.dcm', '2025-02-02 11:00:00'),
('c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0003/scan001.dcm', '2025-02-03 12:00:00'),
('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0004/scan001.dcm', '2025-02-04 14:00:00'),
('e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0005/scan001.dcm', '2025-02-05 15:00:00'),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0006/scan001.dcm', '2025-02-06 16:00:00'),
('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0007/scan001.dcm', '2025-02-07 17:00:00'),
('b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a37', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0008/scan001.dcm', '2025-02-08 18:00:00'),
('c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a38', 'DICOM', 'https://storage.jixsaw-health.com/cases/HN-68-0009/scan001.dcm', '2025-02-09 19:00:00');

-- =====================================================
-- 7. DIAGNOSIS_RESULTS (10 records)
-- =====================================================
INSERT INTO DIAGNOSIS_RESULTS (id, image_id, ai_stage, confidence, ai_mask_url, model_version) VALUES
('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a40', 'cancerous', 0.95, 'https://storage.jixsaw-health.com/masks/HN-68-0001/mask001.png', 'v2.5.0'),
('e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'cancerous', 0.87, 'https://storage.jixsaw-health.com/masks/HN-68-0001/mask002.png', 'v2.5.0'),
('f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'high_risk', 0.78, 'https://storage.jixsaw-health.com/masks/HN-68-0002/mask001.png', 'v2.5.0'),
('a7eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'medium_risk', 0.65, 'https://storage.jixsaw-health.com/masks/HN-68-0003/mask001.png', 'v2.4.0'),
('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a54', 'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'high_risk', 0.82, 'https://storage.jixsaw-health.com/masks/HN-68-0004/mask001.png', 'v2.5.0'),
('c7eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'cancerous', 0.91, 'https://storage.jixsaw-health.com/masks/HN-68-0005/mask001.png', 'v2.5.0'),
('d7eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'low_risk', 0.35, 'https://storage.jixsaw-health.com/masks/HN-68-0006/mask001.png', 'v2.5.0'),
('e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'medium_risk', 0.58, 'https://storage.jixsaw-health.com/masks/HN-68-0007/mask001.png', 'v2.4.0'),
('f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a58', 'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'low_risk', 0.42, 'https://storage.jixsaw-health.com/masks/HN-68-0008/mask001.png', 'v2.5.0'),
('a8eebc99-9c0b-4ef8-bb6d-6bb9bd380a59', 'c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'high_risk', 0.76, 'https://storage.jixsaw-health.com/masks/HN-68-0009/mask001.png', 'v2.5.0');

-- =====================================================
-- 8. AI_FEEDBACKS (10 records)
-- =====================================================
INSERT INTO AI_FEEDBACKS (feedback_id, result_id, doctor_id, is_correct, doctor_comment, doctor_corrected_mask_url, reviewed_at) VALUES
(UUID(), 'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', TRUE, 'AI ระบุตำแหน่งมะเร็งได้ถูกต้องแม่นยำ', NULL, '2025-02-02 09:30:00'),
(UUID(), 'e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', FALSE, 'AI ตีกรอบกว้างเกินไป รวมเนื้อเยื่อปกติด้วย', 'https://storage.jixsaw-health.com/corrections/HN-68-0001/mask002-corrected.png', '2025-02-02 10:00:00'),
(UUID(), 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', TRUE, 'ผลวิเคราะห์สอดคล้องกับผลชิ้นเนื้อ', NULL, '2025-02-03 11:15:00'),
(UUID(), 'a7eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', TRUE, 'ตรวจพบรอยโรคระยะเริ่มต้นได้ดี', NULL, '2025-02-04 14:30:00'),
(UUID(), 'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a54', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', FALSE, 'ภาพมีความคมชัดไม่พอ ทำให้ AI วาด Mask คลาดเคลื่อน', 'https://storage.jixsaw-health.com/corrections/HN-68-0004/mask001-corrected.png', '2025-02-05 15:45:00'),
(UUID(), 'c7eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', TRUE, 'ระบุระยะมะเร็งได้ถูกต้องตาม TNM staging', NULL, '2025-02-06 16:00:00'),
(UUID(), 'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a56', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', TRUE, 'ไม่มีรอยโรคที่น่าสงสัย ถูกต้อง', NULL, '2025-02-07 17:15:00'),
(UUID(), 'e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a57', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', TRUE, 'ผลวิเคราะห์ตรงกับรังสีแพทย์', NULL, '2025-02-08 18:30:00'),
(UUID(), 'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a58', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', TRUE, 'ตรวจพบความผิดปกติเล็กน้อย ควรติดตาม', NULL, '2025-02-09 19:45:00'),
(UUID(), 'a8eebc99-9c0b-4ef8-bb6d-6bb9bd380a59', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', FALSE, 'AI มองข้ามรอยโรคขนาดเล็กบริเวณขอบภาพ', 'https://storage.jixsaw-health.com/corrections/HN-68-0009/mask001-corrected.png', '2025-02-10 20:00:00');

-- =====================================================
-- 9. APPOINTMENTS (10 records)
-- =====================================================
INSERT INTO APPOINTMENTS (appt_id, patient_id, doctor_id, appointment_date, status, notes) VALUES
(UUID(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2025-03-01 09:00:00', 'scheduled', 'ตรวจติดตามอาการหลังส่องกล้อง'),
(UUID(), 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-02 10:30:00', 'scheduled', 'รับฟังผลชิ้นเนื้อและวางแผนการรักษา'),
(UUID(), 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2025-02-20 13:00:00', 'completed', 'ผู้ป่วยปัสสาวะเป็นเลือด ตรวจพบก้อนเนื้อ'),
(UUID(), 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2025-03-05 14:00:00', 'scheduled', 'ตรวจวินิจฉัยด้วยคลื่นแม่เหล็กไฟฟ้า'),
(UUID(), 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2025-02-25 15:30:00', 'completed', 'ติดตามผลการรักษาหลังให้เคมีบำบัด'),
(UUID(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-10 09:30:00', 'scheduled', 'ปรึกษาเรื่องผลข้างเคียงจากการรักษา'),
(UUID(), 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2025-02-18 11:00:00', 'cancelled', 'ผู้ป่วยขอเลื่อนนัดเนื่องจากติดธุระ'),
(UUID(), 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', '2025-03-12 16:00:00', 'scheduled', 'ตรวจ cystoscopy ติดตามผล'),
(UUID(), 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-03-15 08:30:00', 'scheduled', 'ประเมินอาการก่อนให้เคมีบำบัดรอบใหม่'),
(UUID(), 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', '2025-02-22 10:00:00', 'completed', 'ตรวจติดตามผลการรักษาระยะ 3 เดือน');

-- =====================================================
-- 10. AUDIT_LOGS (10 records)
-- =====================================================
INSERT INTO AUDIT_LOGS (log_id, user_id, action, table_name, record_id, ip_address) VALUES
(UUID(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'CREATE', 'PATIENT_CASES', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', '10.0.0.15'),
(UUID(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'CREATE', 'CASE_IMAGES', 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a40', '10.0.0.15'),
(UUID(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'READ', 'DIAGNOSIS_RESULTS', 'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', '10.0.0.16'),
(UUID(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'UPDATE', 'AI_FEEDBACKS', 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', '10.0.0.17'),
(UUID(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'READ', 'DOCTORS', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', '10.0.0.10'),
(UUID(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'READ', 'APPOINTMENTS', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', '124.120.15.22'),
(UUID(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'UPDATE', 'PATIENT_CASES', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a30', '10.0.0.15'),
(UUID(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'DELETE', 'APPOINTMENTS', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', '10.0.0.18'),
(UUID(), 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'READ', 'PATIENT_CASES', 'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', '223.205.30.45'),
(UUID(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'CREATE', 'AI_FEEDBACKS', 'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', '10.0.0.16');

-- =====================================================
-- 11. CHAT_SESSIONS (10 records)
-- =====================================================
INSERT INTO CHAT_SESSIONS (session_id, user_id, started_at, ended_at) VALUES
('b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a60', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2025-02-15 08:30:00', '2025-02-15 09:15:00'),
('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2025-02-16 13:45:00', '2025-02-16 14:30:00'),
('d8eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2025-02-17 10:00:00', '2025-02-17 10:45:00'),
('e8eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '2025-02-18 19:30:00', '2025-02-18 20:15:00'),
('f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2025-02-19 11:15:00', '2025-02-19 12:00:00'),
('a9eebc99-9c0b-4ef8-bb6d-6bb9bd380a65', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '2025-02-20 15:00:00', '2025-02-20 15:40:00'),
('b9eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2025-02-21 09:30:00', '2025-02-21 10:10:00'),
('c9eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2025-02-22 14:00:00', '2025-02-22 14:35:00'),
('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '2025-02-23 16:45:00', '2025-02-23 17:20:00'),
('e9eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '2025-02-24 20:00:00', NULL);

-- =====================================================
-- 12. CHAT_MESSAGES (20 records - 2 per session)
-- =====================================================
INSERT INTO CHAT_MESSAGES (message_id, session_id, sender_type, message, sent_at) VALUES
(UUID(), 'b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a60', 'user', 'สวัสดีครับ ฉันเพิ่งตรวจพบว่ามีก้อนเนื้อในกระเพาะปัสสาวะ อยากทราบว่ามีโอกาสเป็นมะเร็งมากน้อยแค่ไหน', '2025-02-15 08:31:00'),
(UUID(), 'b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a60', 'assistant', 'สวัสดีค่ะ การพบก้อนเนื้อในกระเพาะปัสสาวะไม่จำเป็นต้องเป็นมะเร็งเสมอไป อาจเป็นเนื้องอกชนิดไม่ร้ายแรงหรือการอักเสบก็ได้ แพทย์จะต้องตรวจชิ้นเนื้อเพื่อยืนยันผล ขอแนะนำให้ปรึกษาแพทย์ระบบปัสสาวะเพื่อวางแผนการรักษาที่เหมาะสมนะคะ', '2025-02-15 08:32:00'),

(UUID(), 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'user', 'คุณหมอนัดให้ฉันไปส่องกล้องกระเพาะปัสสาวะอาทิตย์หน้า ต้องเตรียมตัวยังไงบ้างคะ', '2025-02-16 13:46:00'),
(UUID(), 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'assistant', 'ก่อนการส่องกล้องกระเพาะปัสสาวะ (cystoscopy) คุณควร: 1) ดื่มน้ำมากๆ ตามที่แพทย์แนะนำ 2) แจ้งแพทย์หากกำลังทานยาละลายลิ่มเลือด 3) ทำความสะอาดร่างกายตามปกติ 4) มาถึงก่อนเวลานัด 30 นาที หลังทำหัตถการอาจมีปัสสาวะแสบขัดหรือมีเลือดปนเล็กน้อย ซึ่งจะดีขึ้นใน 1-2 วันค่ะ', '2025-02-16 13:47:00'),

(UUID(), 'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'user', 'ผลชิ้นเนื้อบอกว่าเป็นมะเร็งระยะ T1 หมายความว่ายังไงครับ รักษาหายไหม', '2025-02-17 10:01:00'),
(UUID(), 'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'assistant', 'มะเร็งกระเพาะปัสสาวะระยะ T1 หมายถึงมะเร็งเริ่มลุกลามเข้าไปในชั้นใต้เยื่อบุ แต่ยังไม่ถึงชั้นกล้ามเนื้อ จัดเป็นระยะเริ่มต้น โอกาสรักษาหายสูงมาก การรักษาหลักคือการผ่าตัดผ่านกล้อง (TURBT) ร่วมกับการให้ยาเข้าในกระเพาะปัสสาวะหลังผ่าตัด แนะนำปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อวางแผนการรักษาที่เหมาะสมกับคุณโดยเฉพาะนะคะ', '2025-02-17 10:02:00'),

(UUID(), 'e8eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'user', 'ทานอาหารอะไรได้บ้างหลังให้เคมีบำบัด แล้วมีอาหารแนะนำที่ช่วยป้องกันมะเร็งไหมคะ', '2025-02-18 19:31:00'),
(UUID(), 'e8eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'assistant', 'หลังให้เคมีบำบัด แนะนำทานอาหารอ่อนย่อยง่าย โปรตีนสูง เช่น โจ๊ก ข้าวต้ม ไข่ ปลา หลีกเลี่ยงของมัน ของทอด อาหารรสจัด ดื่มน้ำมากๆ สำหรับการป้องกันมะเร็งกระเพาะปัสสาวะ แนะนำทานผักผลไม้ที่มีสารต้านอนุมูลอิสระสูง เช่น แครอท ฟักทอง มะเขือเทศ บรอกโคลี ดื่มน้ำสะอาดมากๆ อย่างน้อย 8-10 แก้วต่อวัน งดสูบบุหรี่ และหลีกเลี่ยงการสัมผัสสารเคมีอันตรายค่ะ', '2025-02-18 19:32:00'),

(UUID(), 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', 'user', 'ปัสสาวะเป็นเลือดแบบไหนที่ควรไปพบแพทย์ครับ เป็นๆ หายๆ มาหลายเดือนแล้ว', '2025-02-19 11:16:00'),
(UUID(), 'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', 'assistant', 'ปัสสาวะเป็นเลือด (Hematuria) โดยเฉพาะที่เป็นๆ หายๆ ควรรีบพบแพทย์ระบบปัสสาวะโดยเร็วที่สุด เพราะอาจเป็นสัญญาณของโรคร้ายแรง เช่น มะเร็งกระเพาะปัสสาวะ นิ่ว หรือการติดเชื้อ แพทย์จะตรวจปัสสาวะ อัลตราซาวนด์ หรือส่องกล้องเพื่อหาสาเหตุ ไม่ควรนิ่งนอนใจนะคะ', '2025-02-19 11:17:00'),

(UUID(), 'a9eebc99-9c0b-4ef8-bb6d-6bb9bd380a65', 'user', 'หลังผ่าตัดมะเร็งกระเพาะปัสสาวะ ต้องตรวจติดตามบ่อยแค่ไหนครับ', '2025-02-20 15:01:00'),
(UUID(), 'a9eebc99-9c0b-4ef8-bb6d-6bb9bd380a65', 'assistant', 'สำหรับมะเร็งกระเพาะปัสสาวะระยะไม่ลุกลามกล้ามเนื้อ แนะนำตรวจติดตามด้วยการส่องกล้องกระเพาะปัสสาวะทุก 3-6 เดือนใน 2 ปีแรก จากนั้นทุก 6-12 เดือนในปีที่ 3-5 และปีละครั้งหลังจากนั้น การตรวจปัสสาวะและภาพถ่ายรังสีอาจทำเป็นระยะตามความเหมาะสม ขึ้นกับระยะและความรุนแรงของโรคเริ่มต้นค่ะ', '2025-02-20 15:02:00'),

(UUID(), 'b9eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'user', 'BCG คืออะไร ทำไมหมอแนะนำให้ฉีดเข้ากระเพาะปัสสาวะ', '2025-02-21 09:31:00'),
(UUID(), 'b9eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'assistant', 'BCG (Bacillus Calmette-Guérin) เป็นวัคซีนป้องกันวัณโรคที่ถูกนำมาใช้เป็นภูมิคุ้มกันบำบัดสำหรับมะเร็งกระเพาะปัสสาวะระยะต้น การหยอดยาเข้าในกระเพาะปัสสาวะจะช่วยกระตุ้นระบบภูมิคุ้มกันให้ทำลายเซลล์มะเร็งและป้องกันการกลับมาเป็นซ้ำ โดยทั่วไปจะเริ่มหลังผ่าตัด 2-4 สัปดาห์ และให้สัปดาห์ละครั้ง รวม 6 สัปดาห์ ตามด้วยการหยอดซ้ำระยะยาว', '2025-02-21 09:32:00'),

(UUID(), 'c9eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'user', 'มีวิธีลดโอกาสการกลับมาเป็นซ้ำของมะเร็งกระเพาะปัสสาวะไหมคะ', '2025-02-22 14:01:00'),
(UUID(), 'c9eebc99-9c0b-4ef8-bb6d-6bb9bd380a67', 'assistant', 'วิธีลดความเสี่ยงการกลับมาเป็นซ้ำ: 1) มาตรวจตามนัดทุกครั้ง 2) ดื่มน้ำมากๆ อย่างน้อย 2-3 ลิตรต่อวัน 3) งดสูบบุหรี่ 4) รับประทานผักผลไม้หลากสี 5) หลีกเลี่ยงการสัมผัสสารเคมี 6) ออกกำลังกายสม่ำเสมอ 7) รักษาน้ำหนักให้เหมาะสม และ 8) จัดการความเครียด การรักษาต่อเนื่องตามแผนที่แพทย์วางไว้สำคัญมากค่ะ', '2025-02-22 14:02:00'),

(UUID(), 'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'user', 'สามีฉันเป็นมะเร็งกระเพาะปัสสาวะ ตอนนี้ซึมเศร้ามาก ควรช่วยเขายังไงดี', '2025-02-23 16:46:00'),
(UUID(), 'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a68', 'assistant', 'การดูแลผู้ป่วยมะเร็งที่ซึมเศร้า: 1) รับฟังและเข้าใจความรู้สึกของเขา ไม่ตัดสิน 2) ให้กำลังใจและชมเชยเมื่อเขาทำตามแผนการรักษา 3) ชวนทำกิจกรรมที่เขาชอบเบาๆ 4) ติดต่อกลุ่มสนับสนุนผู้ป่วยมะเร็ง 5) ปรึกษาจิตแพทย์หรือนักจิตวิทยาคลินิกหากอาการรุนแรง การมีครอบครัวเข้าใจและสนับสนุนช่วยให้ผู้ป่วยมีกำลังใจสู้โรคมากขึ้นค่ะ', '2025-02-23 16:47:00'),

(UUID(), 'e9eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'user', 'ค่าใช้จ่ายในการรักษามะเร็งกระเพาะปัสสาวะแพงไหมครับ สิทธิ์บัตรทองครอบคลุมหรือเปล่า', '2025-02-24 20:01:00'),
(UUID(), 'e9eebc99-9c0b-4ef8-bb6d-6bb9bd380a69', 'assistant', 'สิทธิ์บัตรทอง (30 บาท) ครอบคลุมการรักษามะเร็งกระเพาะปัสสาวะตามชุดสิทธิประโยชน์ รวมถึงการผ่าตัด การให้เคมีบำบัด และการฉายแสง ผู้ป่วยสามารถเข้ารับการรักษาได้ที่โรงพยาบาลตามสิทธิ์หรือโรงพยาบาลเครือข่าย หากมีข้อสงสัยสามารถสอบถามรายละเอียดเพิ่มเติมได้ที่สายด่วน สปสช. 1330 ค่ะ', '2025-02-24 20:02:00');

-- =====================================================
-- Create indexes for performance optimization
-- =====================================================

-- Additional indexes for foreign keys and common queries
CREATE INDEX idx_patient_cases_patient ON PATIENT_CASES(patient_id);
CREATE INDEX idx_patient_cases_doctor ON PATIENT_CASES(assigned_doctor_id);
CREATE INDEX idx_case_images_case ON CASE_IMAGES(case_id);
CREATE INDEX idx_diagnosis_results_image ON DIAGNOSIS_RESULTS(image_id);
CREATE INDEX idx_ai_feedbacks_result ON AI_FEEDBACKS(result_id);
CREATE INDEX idx_ai_feedbacks_doctor ON AI_FEEDBACKS(doctor_id);
CREATE INDEX idx_appointments_patient ON APPOINTMENTS(patient_id);
CREATE INDEX idx_appointments_doctor ON APPOINTMENTS(doctor_id);
CREATE INDEX idx_chat_sessions_user ON CHAT_SESSIONS(user_id);
CREATE INDEX idx_chat_messages_session ON CHAT_MESSAGES(session_id);
CREATE INDEX idx_audit_logs_user ON AUDIT_LOGS(user_id);
CREATE INDEX idx_audit_logs_timestamp ON AUDIT_LOGS(timestamp);

-- =====================================================
-- Create views for common queries
-- =====================================================

-- View for patient summary with latest case
CREATE OR REPLACE VIEW v_patient_summary AS
SELECT 
    p.patient_id,
    u.email,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.blood_type,
    p.phone_number,
    pc.case_code,
    pc.status as case_status,
    pc.created_at as case_created_at,
    d.first_name as doctor_first_name,
    d.last_name as doctor_last_name
FROM PATIENTS p
JOIN USERS u ON p.user_id = u.id
LEFT JOIN PATIENT_CASES pc ON p.patient_id = pc.patient_id
LEFT JOIN DOCTORS d ON pc.assigned_doctor_id = d.doctor_id
WHERE pc.created_at = (
    SELECT MAX(created_at) 
    FROM PATIENT_CASES 
    WHERE patient_id = p.patient_id
);

-- View for diagnosis details with feedback
CREATE OR REPLACE VIEW v_diagnosis_details AS
SELECT 
    dr.id as diagnosis_id,
    ci.original_dicom_url,
    dr.ai_stage,
    dr.confidence,
    dr.ai_mask_url,
    dr.model_version,
    aif.is_correct as doctor_agreement,
    aif.doctor_comment,
    aif.doctor_corrected_mask_url,
    CONCAT(d.first_name, ' ', d.last_name) as reviewed_by_doctor
FROM DIAGNOSIS_RESULTS dr
JOIN CASE_IMAGES ci ON dr.image_id = ci.id
LEFT JOIN AI_FEEDBACKS aif ON dr.id = aif.result_id
LEFT JOIN DOCTORS d ON aif.doctor_id = d.doctor_id;

-- =====================================================
-- Verification queries (commented out, can be run manually)
-- =====================================================

/*
-- Verify data counts
SELECT 'USERS' as table_name, COUNT(*) as record_count FROM USERS UNION ALL
SELECT 'DOCTORS', COUNT(*) FROM DOCTORS UNION ALL
SELECT 'PATIENTS', COUNT(*) FROM PATIENTS UNION ALL
SELECT 'PATIENT_CASES', COUNT(*) FROM PATIENT_CASES UNION ALL
SELECT 'CASE_IMAGES', COUNT(*) FROM CASE_IMAGES UNION ALL
SELECT 'DIAGNOSIS_RESULTS', COUNT(*) FROM DIAGNOSIS_RESULTS UNION ALL
SELECT 'AI_FEEDBACKS', COUNT(*) FROM AI_FEEDBACKS UNION ALL
SELECT 'APPOINTMENTS', COUNT(*) FROM APPOINTMENTS UNION ALL
SELECT 'AUDIT_LOGS', COUNT(*) FROM AUDIT_LOGS UNION ALL
SELECT 'CHAT_SESSIONS', COUNT(*) FROM CHAT_SESSIONS UNION ALL
SELECT 'CHAT_MESSAGES', COUNT(*) FROM CHAT_MESSAGES;

-- Sample data verification
SELECT * FROM v_patient_summary LIMIT 5;
SELECT * FROM v_diagnosis_details LIMIT 5;
*/

-- =====================================================
-- End of initialization script
-- =====================================================