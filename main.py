
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
import shutil
import uuid
import os

# Import ไฟล์ที่เราสร้างเอง
import models, auth, ai_service
from database import engine, get_db

# สร้างตารางใน Database (ถ้ายังไม่มี)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- ตั้งค่าโฟลเดอร์สำหรับเก็บรูป ---
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- ส่วนกำหนดรูปแบบข้อมูล (Pydantic Models) ---
class UserRegister(BaseModel):
    username: str
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
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="ชื่อนี้มีคนใช้แล้ว")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "สมัครสมาชิกสำเร็จ!"}

# 2. ระบบล็อกอิน
@app.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# 3. เช็คสถานะผู้ใช้ (เฉพาะคน Login)
@app.get("/users/me")
def read_users_me(current_user: str = Depends(auth.get_current_user)):
    return {"username": current_user, "status": "คุณล็อกอินอยู่"}

# 4. ระบบแชทกับ AI สำหรับ "คนไข้" (*** ปลดล็อก Login ออกแล้ว ***)
@app.post("/chat")
def chat_with_ai(chat_data: ChatRequest, db: Session = Depends(get_db)):
    # เตรียม Messages สำหรับ AI (รวมประวัติ + คำถามใหม่)
    messages_for_ai = chat_data.history if chat_data.history else []
    messages_for_ai.append({"role": "user", "content": chat_data.message})

    # เรียก AI Service
    ai_reply_text = ai_service.chat_medgemma(messages_for_ai)
    
    # บันทึกข้อมูลลง Database (ในชื่อ guest หรือ patient เพราะไม่ได้ login)
    new_chat = models.ChatHistory(
        user_message = chat_data.message,
        ai_reply = ai_reply_text
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return {
        "status": "success",
        "user": "guest_patient",
        "reply": ai_reply_text,
        "saved_id": new_chat.id
    }

# 5. ระบบอัปโหลดรูปภาพวินิจฉัย สำหรับ "คุณหมอ" (*** ต้อง Login เท่านั้น ***)
@app.post("/diagnosis/upload")
async def upload_xray(file: UploadFile = File(...), 
                      current_user: str = Depends(auth.get_current_user), 
                      db: Session = Depends(get_db)):
    
    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_extension}"
    file_location = f"uploads/{new_filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    mock_prediction = "Stage T2 (Muscle Invasive Bladder Cancer)"
    mock_conf = "87.5%"
    mock_rec = "ควรทำการส่องกล้องกระเพาะปัสสาวะ (Cystoscopy) เพื่อยืนยันผล"

    new_diagnosis = models.Diagnosis(
        username=current_user,
        filename=new_filename,
        prediction=mock_prediction,
        confidence=mock_conf,
        recommendation=mock_rec
    )
    db.add(new_diagnosis)
    db.commit()
    db.refresh(new_diagnosis)

    return {
        "id": new_diagnosis.id,
        "filename": file.filename,
        "saved_as": new_filename,
        "prediction": mock_prediction,
        "confidence": mock_conf,
        "recommendation": mock_rec,
        "processed_by": "MedGemma-CNN-Ensemble"
    }