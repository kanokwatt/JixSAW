#  JIxSAW Health: Bladder Cancer AI Web Application
**"Connecting the pieces for better bladder cancer diagnosis and care."**

##  Introduction
**JixSAW** เป็นแพลตฟอร์ม Startup Web Application ที่มุ่งเน้นการวิเคราะห์และคัดกรองระยะของโรคมะเร็งกระเพาะปัสสาวะ ด้วยการนำเทคโนโลยี AI (Vision Transformer / ResNet50) มาผสานกับสถาปัตยกรรม Microservices เพื่อช่วยให้การประเมินความเสี่ยงมีความแม่นยำ เข้าถึงง่าย และรวดเร็ว

##  Key Features (คุณสมบัติเด่น)
* **AI-Powered Image Analysis:** ใช้ Deep Learning วิเคราะห์ภาพถ่าย (X-ray/MRI)
* **Risk Stratification:** ระบบวิเคราะห์ระดับความรุนแรงและโอกาสการกลับมาเป็นซ้ำ
* **Smart Dashboard:** รายงานผลรูปแบบ Interactive สำหรับบุคลากรทางการแพทย์

##  ทีมผู้พัฒนา (Team Members)
| ลำดับ | รายชื่อสมาชิก | บทบาทและความรับผิดชอบ (Role) |
| :---: | :--- | :--- |
| 1 | กนกวรรธน์ เซี่ยงเจ็น | **Project Leader & AI Strategy** |
| 2 | น.ส.สุริยาลักษณ์ สิทธิวงค์ | **AI Specialist (PyTorch & AI API)** |
| 3 | น.ส.อาทิตยา บุญแจ่ม | **Backend Developer (FastAPI, Database Logic)** |
| 4 | น.ส.นภสร ใจซื่อ | **Frontend Developer (React UI/UX & API Integration)** |
| 5 | นายวิษณุ อินทสุวรรณ | **DevOps & Database Admin (Infrastructure & Docker)** |


## 🛠 Technology Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** FastAPI, SQLAlchemy, PyMySQL, JWT Auth
* **AI Engine:** PyTorch, ResNet50, YOLO
* **Database:** MySQL 8.0
* **Infrastructure:** Docker, Docker Compose, VS Code

## ⚙️ วิธีการติดตั้งและรันโปรเจกต์ (How to Run Locally)
โปรเจกต์นี้รันผ่าน Docker ทำให้ไม่ต้องติดตั้ง Environment ให้วุ่นวาย

### สิ่งที่ต้องมี (Prerequisites)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) เปิดใช้งานรันอยู่
- Git
- **⚠️ AI Model File:** เนื่องจากไฟล์โมเดลมีขนาดใหญ่ ให้ดาวน์โหลดไฟล์ `best_model.pth` จาก [คลิกที่นี่เพื่อดาวน์โหลดจาก Google Drive] แล้วนำไปวางไว้ในโฟลเดอร์ `ai_engine/` ก่อนสั่งรัน Docker

**1. Clone the Repository**
```bash
git clone [https://github.com/kanokwatt/JixSAW.git](https://github.com/kanokwatt/JixSAW.git)
cd JixSAW

### ขั้นตอนการรัน (Steps)
1. Clone โปรเจกต์ลงมาที่เครื่อง
   ```bash
   git clone <https://github.com/kanokwatt/JixSAW>
   cd JixSAW