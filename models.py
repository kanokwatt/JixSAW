# รอเพื่อนส่งเทรนมาเเล้วค่อยใช้อันนี้นะครับ

# from sqlalchemy import Column, Integer, String, Text, DateTime
# from database import Base
# import datetime

# # 1. ตารางเก็บข้อมูลผู้ใช้งาน
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(50), unique=True, index=True)
#     password = Column(String(255))
#     role = Column(String(20), default="patient")

# # 2. ตารางเก็บประวัติการแชทกับ AI
# class ChatHistory(Base):
#     __tablename__ = "chat_history"
#     id = Column(Integer, primary_key=True, index=True)
#     user_message = Column(Text)
#     ai_reply = Column(Text)
#     timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# # 3. ตารางเก็บผลการวินิจฉัยจากรูปภาพ (เพิ่มใหม่)
# class Diagnosis(Base):
#     __tablename__ = "diagnosis_results"
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(50)) # เก็บว่าใครเป็นคนส่งตรวจ
#     filename = Column(String(255)) # ชื่อไฟล์รูปในเครื่อง
#     prediction = Column(String(100)) # ผลทำนาย (Stage ไหน)
#     confidence = Column(String(20)) # ความมั่นใจกี่ %
#     recommendation = Column(Text) # คำแนะนำเบื้องต้น
#     timestamp = Column(DateTime, default=datetime.datetime.utcnow)
















from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

# 1. ตารางเก็บข้อมูลผู้ใช้งาน
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(20), default="patient")

# 2. ตารางเก็บประวัติการแชทกับ AI
class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text)
    ai_reply = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# 3. ตารางเก็บผลการวินิจฉัยจากรูปภาพ (เพิ่มใหม่)
class Diagnosis(Base):
    __tablename__ = "diagnosis_results"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50)) # เก็บว่าใครเป็นคนส่งตรวจ
    filename = Column(String(255)) # ชื่อไฟล์รูปในเครื่อง
    prediction = Column(String(100)) # ผลทำนาย (Stage ไหน)
    confidence = Column(String(20)) # ความมั่นใจกี่ %
    recommendation = Column(Text) # คำแนะนำเบื้องต้น
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)