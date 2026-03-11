
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import shutil
import uuid
import os
import requests  

# Import ไฟล์ที่เราสร้างเอง
import models, auth, ai_service
from database import engine, get_db

# สร้างตารางใน Database (ถ้ายังไม่มี)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Middleware (อนุญาตทุก Origin) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ตั้งค่าโฟลเดอร์สำหรับเก็บรูป ---
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- ส่วนกำหนดรูปแบบข้อมูล (Pydantic Models) ---
class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "patient"

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    message: str
    history: list = [] 

# --- API Routes ---

@app.get("/")
def read_root():
    return {"message": "BladderAI System Online"}

# 1. ระบบสมัครสมาชิก
@app.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="อีเมลนี้มีคนใช้แล้ว")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "สมัครสมาชิกสำเร็จ!"}

# 2. ระบบล็อกอิน
@app.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm ใช้ username field แต่เราจะใช้เป็น email
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# 3. เช็คสถานะผู้ใช้ (เฉพาะคน Login)
@app.get("/users/me")
def read_users_me(current_user: str = Depends(auth.get_current_user)):
    return {"email": current_user, "status": "คุณล็อกอินอยู่"}

# 4. ระบบแชทกับ AI สำหรับ "คนไข้" (*** ปลดล็อก Login ออกแล้ว ***)
@app.post("/chat")
def chat_with_ai(chat_data: ChatRequest, db: Session = Depends(get_db)):
    # เรียก AI Service
    ai_reply_text = ai_service.chat_medgemma(chat_data.history + [{"role": "user", "content": chat_data.message}])
    
    # พยายามหาผู้ใช้ที่เป็น patient คนแรกในระบบมาจำลองเป็น guest
    guest_user = db.query(models.User).filter(models.User.role == "patient").first()
    
    if not guest_user:
        # ถ้าไม่มีในระบบเลย ให้ตอบกลับไปเฉยๆ โดยไม่บันทึกลง Database
        return {"status": "success", "user": "guest", "reply": ai_reply_text}

    # สร้าง ChatSession ใหม่ โดยใช้ ID ของ User ที่มีจริงใน DB
    new_session = models.ChatSession(user_id=guest_user.id)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    # บันทึกข้อความผู้ใช้
    user_message = models.ChatMessage(
        session_id=new_session.session_id,
        sender_type="user",
        message=chat_data.message
    )
    db.add(user_message)
    
    # บันทึกข้อความ AI
    ai_message = models.ChatMessage(
        session_id=new_session.session_id,
        sender_type="assistant",
        message=ai_reply_text
    )
    db.add(ai_message)
    
    db.commit()

    return {
        "status": "success",
        "user": guest_user.email,
        "session_id": new_session.session_id,
        "reply": ai_reply_text
    }
  

# 5. ระบบอัปโหลดรูปภาพวินิจฉัย สำหรับ "คุณหมอ" (*** ต้อง Login เท่านั้น ***)
@app.post("/diagnosis/upload")
async def upload_xray(file: UploadFile = File(...), 
                      current_user: str = Depends(auth.get_current_user), 
                      db: Session = Depends(get_db)):
    
    # 1. เช็คก่อนว่าใครล็อกอิน และหา Patient จำลอง
    user_db = db.query(models.User).filter(models.User.email == current_user).first()
    doctor_db = db.query(models.Doctor).filter(models.Doctor.user_id == user_db.id).first()
    patient_db = db.query(models.Patient).first() # ดึงคนไข้คนแรกมาจำลองเคส

    if not doctor_db or not patient_db:
        raise HTTPException(status_code=400, detail="ไม่พบข้อมูลแพทย์ของคุณ หรือไม่มีข้อมูลคนไข้ในระบบ")

    # 2. จัดการไฟล์
    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_extension}"
    file_location = f"uploads/{new_filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 3. สร้าง PatientCase โดยใช้ ID ที่มีอยู่จริง
    new_case = models.PatientCase(
        case_code=f"HN-68-{uuid.uuid4().hex[:8].upper()}",
        patient_id=patient_db.patient_id,      # ใช้ ID จริงของคนไข้
        assigned_doctor_id=doctor_db.doctor_id, # ใช้ ID จริงของหมอที่ล็อกอิน
        icd_10_code="C67.9",
        status="active"
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    
    # 4. สร้าง CaseImage
    new_image = models.CaseImage(
        case_id=new_case.id,
        file_type=file.content_type or "image/jpeg",
        original_dicom_url=f"uploads/{new_filename}"
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    
    # 5. เรียก AI Engine เพื่อทำนาย
    try:
        with open(file_location, "rb") as f:
            files = {"file": (new_filename, f, file.content_type)}
            response = requests.post("http://ai-engine:5000/predict", files=files, timeout=30)
            response.raise_for_status()
            ai_result = response.json()
        
        prediction = ai_result.get("stage", "Indeterminate")
        confidence = str(ai_result.get("confidence", "0.0"))
        recommendation = ai_result.get("recommendation", "โปรดปรึกษาแพทย์")
        processed_by = ai_result.get("model", "AI-Engine-v1")
    except Exception as e:
        prediction = "Error"
        confidence = "0"
        recommendation = f"เกิดข้อผิดพลาดในการวิเคราะห์: {str(e)}"
        processed_by = "AI-Engine-Error"

    # 6. สร้าง DiagnosisResult 
    
    stage_mapping = {
        "t0": "low_risk",
        "t1": "medium_risk",
        "t2": "high_risk",
        "t3": "cancerous",
        "t4": "cancerous"
    }
    
    ai_raw_stage = prediction.lower()
    # แปลง T0-T4 เป็นค่า Enum ที่ Database รู้จัก
    ai_stage_enum = stage_mapping.get(ai_raw_stage, 'medium_risk') 
        
    new_diagnosis = models.DiagnosisResult(
        image_id=new_image.id,
        ai_stage=ai_stage_enum,
        confidence=float(confidence.replace("%", "")) / 100 if "%" in confidence else 0.0,
        model_version=processed_by
    )
    
    db.add(new_diagnosis)
    db.commit()
    db.refresh(new_diagnosis)

    return {
        "id": new_diagnosis.id,
        "prediction": prediction,
        "confidence": confidence,
        "recommendation": recommendation,
        "processed_by": processed_by
    
    }
    