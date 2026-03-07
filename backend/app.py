# อันนี้ดี



# import streamlit as st
# import requests

# st.set_page_config(page_title="BladderAI", layout="wide")

# # แยกหน้าจอด้วย Sidebar
# st.sidebar.title("🏥 BladderAI System")
# app_mode = st.sidebar.radio("เลือกโหมดการใช้งาน", ["คนไข้ (Chat with AI)", "บุคลากรทางการแพทย์ (Doctor Port)"])

# # --- โหมดคนไข้ (ไม่มี Login) ---
# if app_mode == "คนไข้ (Chat with AI)":
#     st.title("💬 คุยกับผู้ช่วยอัจฉริยะ (MedGemma)")
#     st.info("คนไข้สามารถสอบถามข้อมูลเบื้องต้นได้ทันทีโดยไม่ต้องเข้าสู่ระบบ")
    
#     if "messages" not in st.session_state:
#         st.session_state.messages = []

#     for message in st.session_state.messages:
#         with st.chat_message(message["role"]):
#             st.markdown(message["content"])

#     if prompt := st.chat_input("สอบถามอาการเบื้องต้น..."):
#         with st.chat_message("user"):
#             st.markdown(prompt)
        
#         # ส่งหา Backend (ไม่ต้องใช้ Token)
#         res = requests.post("http://127.0.0.1:8000/chat", 
#                              json={"message": prompt, "history": st.session_state.messages})
        
#         if res.status_code == 200:
#             reply = res.json()["reply"]
#             with st.chat_message("assistant"):
#                 st.markdown(reply)
#             st.session_state.messages.append({"role": "user", "content": prompt})
#             st.session_state.messages.append({"role": "assistant", "content": reply})

# # --- โหมดหมอ (ต้อง Login) ---
# elif app_mode == "บุคลากรทางการแพทย์ (Doctor Port)":
#     st.title("👨‍⚕️ ระบบวินิจฉัยสำหรับแพทย์")
    
#     if "token" not in st.session_state:
#         st.subheader("กรุณาเข้าสู่ระบบ")
#         user = st.text_input("Username")
#         pw = st.text_input("Password", type="password")
#         if st.button("Login"):
#             res = requests.post("http://127.0.0.1:8000/login", data={"username": user, "password": pw})
#             if res.status_code == 200:
#                 st.session_state["token"] = res.json()["access_token"]
#                 st.rerun()
#             else:
#                 st.error("รหัสผ่านไม่ถูกต้อง")
#     else:
#         st.success("ล็อกอินในสิทธิ์แพทย์เรียบร้อย")
#         if st.button("Logout"):
#             del st.session_state["token"]
#             st.rerun()
            
#         st.divider()
#         # ส่วนอัปโหลดรูป X-ray
#         file = st.file_uploader("อัปโหลดภาพ X-ray เพื่อให้ AI ช่วยวิเคราะห์", type=["jpg","png"])
#         if file and st.button("เริ่มการวินิจฉัย"):
#             headers = {"Authorization": f"Bearer {st.session_state['token']}"}
#             res = requests.post("http://127.0.0.1:8000/diagnosis/upload", headers=headers, files={"file": file})
#             st.json(res.json())



# ทดสอบ


import streamlit as st
import requests

# 1. ตั้งค่าหน้าจอ
st.set_page_config(page_title="BladderAI Health Plus", layout="wide", page_icon="🏥")

# สร้าง CSS เพื่อตกแต่ง UI ให้ดูทันสมัย
st.markdown("""
    <style>
    .mode-card {
        padding: 40px;
        border-radius: 25px;
        text-align: center;
        transition: 0.3s;
        border: 1px solid #f0f2f6;
        height: 100%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .mode-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    }
    </style>
    """, unsafe_allow_html=True)

# 2. จัดการสถานะหน้าจอ (Navigation)
if "page" not in st.session_state:
    st.session_state.page = "landing"

# --- [หน้าหลัก: Landing Page] ---
if st.session_state.page == "landing":
    st.markdown("<h1 style='text-align: center; color: #1E3A8A;'>JlxSAW Health Plus</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; font-size: 1.2em;'>เลือกโหมดการใช้งานที่เหมาะสมกับคุณ</p>", unsafe_allow_html=True)
    
    st.write("##") 
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("<div class='mode-card'>", unsafe_allow_html=True)
        st.markdown("<h2 style='color: #10B981;'>💚 โหมดผู้ป่วย</h2>", unsafe_allow_html=True)
        st.write("ปรึกษาปัญหาสุขภาพ รับคำแนะนำเบื้องต้น และคำแนะนำในการดูแลตนเอง")
        st.write("• การสนทนาที่เป็นมิตรและเข้าใจง่าย")
        st.write("• ข้อมูลสุขภาพที่เชื่อถือได้")
        st.write("• คำแนะนำเบื้องต้นและคำเตือนที่ชัดเจน")
        st.write("##")
        if st.button("เริ่มการสนทนา →", key="btn_patient", use_container_width=True):
            st.session_state.page = "patient_chat"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class='mode-card' style='background-color: #1a2634; color: white;'>", unsafe_allow_html=True)
        st.markdown("<h2 style='color: #60A5FA;'>🩺 โหมดแพทย์</h2>", unsafe_allow_html=True)
        st.write("วิเคราะห์ภาพถ่ายทางการแพทย์ จัดการเคสผู้ป่วย และรับข้อมูลทางคลินิกที่ละเอียด")
        st.write("• Dashboard แบบ Dark Mode เพื่อดูภาพสแกน")
        st.write("• AI Image Analysis และ Tumor Segmentation")
        st.write("• จัดการเคสผู้ป่วยหลายรายพร้อมกัน")
        st.write("##")
        if st.button("เข้าสู่ Dashboard →", key="btn_doctor", use_container_width=True):
            st.session_state.page = "doctor_login"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<br><br><p style='text-align: center; font-size: 0.85em; color: gray;'>Medical AI Assistant ไม่ใช่การแทนที่คำวินิจฉัยจากแพทย์ กรุณาปรึกษาแพทย์เพื่อการรักษาที่ถูกต้อง</p>", unsafe_allow_html=True)

# --- [หน้าคนไข้: ChatBot (ไม่ต้อง Login)] ---
elif st.session_state.page == "patient_chat":
    if st.button("← กลับหน้าหลัก"):
        st.session_state.page = "landing"
        st.rerun()
    
    st.title("💬 คุยกับผู้ช่วยอัจฉริยะ (MedGemma AI)")
    st.info("คุณสามารถสอบถามข้อมูลเบื้องต้นเกี่ยวกับสุขภาพได้ทันที")
    
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # แสดงประวัติการแชท
    for m in st.session_state.messages:
        with st.chat_message(m["role"]):
            st.markdown(m["content"])
    
    # รับคำถามจากคนไข้
    if prompt := st.chat_input("พิมพ์อาการหรือข้อสงสัยของคุณที่นี่..."):
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # ส่งไปหา Backend (ไม่ต้องใช้ Token สำหรับแชท)
        try:
            res = requests.post("http://127.0.0.1:8000/chat", 
                                 json={"message": prompt, "history": st.session_state.messages})
            if res.status_code == 200:
                reply = res.json()["reply"]
                with st.chat_message("assistant"):
                    st.markdown(reply)
                st.session_state.messages.append({"role": "user", "content": prompt})
                st.session_state.messages.append({"role": "assistant", "content": reply})
            else:
                st.error("ขออภัย ระบบแชทขัดข้องชั่วคราว")
        except:
            st.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")

# --- [หน้าหมอ: Login Page] ---
elif st.session_state.page == "doctor_login":
    if st.button("← กลับหน้าหลัก"):
        st.session_state.page = "landing"
        st.rerun()
        
    st.markdown("<h2 style='text-align: center;'>🔐 เข้าสู่ระบบบุคลากรทางการแพทย์</h2>", unsafe_allow_html=True)
    
    col_l, col_c, col_r = st.columns([1, 2, 1])
    with col_c:
        with st.container(border=True):
            username = st.text_input("Username (หมอ)")
            password = st.text_input("Password", type="password")
            if st.button("Login เข้าสู่ระบบ", use_container_width=True, type="primary"):
                try:
                    res = requests.post("http://127.0.0.1:8000/login", 
                                         data={"username": username, "password": password})
                    if res.status_code == 200:
                        st.session_state["token"] = res.json()["access_token"]
                        st.session_state.page = "doctor_dashboard"
                        st.rerun()
                    else:
                        st.error("ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด")
                except:
                    st.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้")

# --- [หน้าหมอ: Dashboard (หลัง Login สำเร็จ)] ---
elif st.session_state.page == "doctor_dashboard":
    # Sidebar สำหรับจัดการเคส
    with st.sidebar:
        st.markdown("### 👨‍⚕️ Doctor Dashboard")
        st.text_input("🔍 ค้นหาเคส...", placeholder="ระบุชื่อ หรือ HN...")
        
        st.markdown("---")
        st.markdown("#### PATIENT CASES")
        if st.button("🔴 สมชาย วงศ์ดี (58 ปี, ชาย) - ด่วน", use_container_width=True): pass
        if st.button("🟢 สมหญิง ใจดี (45 ปี, หญิง)", use_container_width=True): pass
        if st.button("🟡 ประยุทธ์ ศรีสุข (62 ปี, ชาย)", use_container_width=True): pass
        
        st.divider()
        if st.button("🚪 ออกจากระบบ", use_container_width=True): 
            if "token" in st.session_state: del st.session_state["token"]
            st.session_state.page = "landing"
            st.rerun()

    # ส่วนเนื้อหาหลักของหมอ
    st.header("📋 แผงควบคุมการวินิจฉัย: สมชาย วงศ์ดี")
    st.caption("Case ID: #000001 | HN: HN-000001 | วันที่ตรวจ: 14 กุมภาพันธ์ 2569")

    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.subheader("🧬 Medical Imaging (AI Analysis)")
        file = st.file_uploader("ลากไฟล์ภาพถ่าย CT/X-Ray วางที่นี่ หรือคลิกเพื่อเลือกไฟล์", type=["jpg", "png", "jpeg"])
        
        if file:
            st.image(file, caption="ภาพทางการแพทย์ที่กำลังตรวจสอบ", use_container_width=True)
            if st.button("🪄 เริ่มการวิเคราะห์ด้วย MedGemma-CNN", type="primary", use_container_width=True):
                headers = {"Authorization": f"Bearer {st.session_state['token']}"}
                with st.spinner("AI กำลังประมวลผล Segmentation และวิเคราะห์พยาธิสภาพ..."):
                    try:
                        res = requests.post("http://127.0.0.1:8000/diagnosis/upload", 
                                             headers=headers, files={"file": file})
                        if res.status_code == 200:
                            data = res.json()
                            st.success(f"**ผลการวิเคราะห์:** {data['prediction']}")
                            st.metric("ความแม่นยำ (Confidence Score)", data['confidence'])
                            st.info(f"**ข้อเสนอแนะ:** {data['recommendation']}")
                        else:
                            st.error("การส่งรูปวิเคราะห์ล้มเหลว กรุณาล็อกอินใหม่")
                    except:
                        st.error("เซิร์ฟเวอร์ Backend ไม่ตอบสนอง")

    with col_right:
        st.subheader("📄 ข้อมูลผู้ป่วย")
        with st.container(border=True):
            st.write("**อายุ:** 58 ปี")
            st.write("**เพศ:** ชาย")
            st.write("**อาการสำคัญ:** ปัสสาวะเป็นเลือดปน (Hematuria)")
            st.write("**ประวัติโรคประจำตัว:** ความดันโลหิตสูง")
            st.divider()
            st.markdown("**✍️ บันทึกเพิ่มเติมโดยแพทย์**")
            doctor_note = st.text_area("ระบุความเห็นทางการแพทย์เพิ่มเติม...", height=150)
            if st.button("💾 บันทึกผลลงฐานข้อมูล", use_container_width=True):
                st.success("บันทึกข้อมูลเรียบร้อยแล้ว")