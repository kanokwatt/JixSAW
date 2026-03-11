# JixSAW Thai Overview

เอกสารนี้สรุปโครงสร้างการทำงานของหน้าและ context หลักในโปรเจกต์ JixSAW ฝั่ง frontend เพื่อให้อ่านโค้ดต่อได้เร็วขึ้น

## ภาพรวมระบบ

- แอปเริ่มที่ App และครอบทั้งระบบด้วย UserProvider และ SidebarProvider ก่อนส่งต่อให้ RouterProvider
- ระบบยังใช้ mock flow สำหรับ authentication และข้อมูลตัวอย่าง ยังไม่มี API client หรือ service แยกที่เรียก backend จริง
- หน้าหลักหลังล็อกอินใช้ Layout เป็น shell กลาง โดยมี Sidebar, top bar และ Outlet สำหรับ render หน้าย่อย
- การตัดสินใจว่าเข้า dashboard แบบแพทย์หรือผู้ป่วยอยู่ใน DashboardWrapper โดยดูจาก role ของ user ใน UserContext

## Context หลัก

### UserContext

ไฟล์: src/app/context/UserContext.tsx

- เก็บข้อมูลผู้ใช้ปัจจุบันไว้ใน state กลางของแอป
- เปิดให้ component อื่นเรียกใช้ผ่าน useUser
- มี logout สำหรับล้าง session ฝั่ง frontend
- Login และ Register จะเรียก setUser เพื่อจำลองการเข้าสู่ระบบหรือสมัครสมาชิกสำเร็จ

### SidebarContext

ไฟล์: src/app/context/SidebarContext.tsx

- เก็บสถานะเปิดปิด sidebar
- มี toggleSidebar สำหรับสลับสถานะ
- มี closeSidebar สำหรับบังคับปิดเมนู
- Layout และ Sidebar ใช้งาน context นี้ร่วมกัน

## Routing

ไฟล์: src/app/routes.ts

- /login แสดงหน้าเข้าสู่ระบบ
- /register แสดงหน้าสมัครสมาชิก
- / ใช้ Layout เป็นหน้าครอบหลัก
- route ย่อยภายใต้ Layout ได้แก่ dashboard, MRI upload, case search, patient history และ patient review
- ถ้า path ไม่ตรงกับ route ที่กำหนด จะไปหน้า NotFound

## หน้าหลักของระบบ

### Login

ไฟล์: src/app/pages/Login.tsx

- รับ email และ password จากฟอร์ม
- ใช้ setTimeout จำลองเวลารอจาก backend
- ตีความ role แบบง่ายจาก email ที่มีคำว่า doctor หรือ dr
- บันทึกข้อมูลลง UserContext แล้วพาไปหน้า /

### Register

ไฟล์: src/app/pages/Register.tsx

- รับข้อมูลพื้นฐานของผู้ใช้ เช่น ชื่อ อีเมล บทบาท และประเทศ
- ตรวจว่ามีการเลือก role ก่อน submit
- เรียก setUser โดยตรงเพื่อจำลองการสมัครสำเร็จ
- พาผู้ใช้ไปหน้า dashboard ทันทีหลังสมัคร

### Layout

ไฟล์: src/app/components/Layout.tsx

- เป็นโครงของหน้าหลังล็อกอิน
- มี Sidebar ทางซ้ายและ top bar ด้านบน
- ปุ่ม hamburger เรียก toggleSidebar
- ใช้ Outlet เพื่อ render เนื้อหาของ route ลูก

### Sidebar

ไฟล์: src/app/components/Sidebar.tsx

- แสดงเมนูตาม role ของ user
- ถ้าเป็นแพทย์จะเห็นเมนูค้นหาเคส
- ถ้าเป็นผู้ป่วยจะเห็นเมนูประวัติการรักษา
- ปุ่มออกจากระบบจะเรียก logout และพากลับไปหน้า login

## Dashboard

### DashboardWrapper

ไฟล์: src/app/pages/DashboardWrapper.tsx

- เป็นตัวเลือกว่าจะ render DashboardDoctor หรือ DashboardPatient
- ถ้า role เป็น doctor จะเข้าหน้าแพทย์
- นอกนั้นจะเข้าหน้าผู้ป่วย

### DashboardDoctor

ไฟล์: src/app/pages/DashboardDoctor.tsx

- แสดงสถิติภาพรวมที่แพทย์สนใจ เช่นจำนวนผู้ป่วย งานที่รอรีวิว และความแม่นยำเฉลี่ยของ AI
- มีตารางเคสล่าสุดที่ต้องตรวจสอบ
- ปุ่ม Review พาไปหน้าค้นหาเคส

### DashboardPatient

ไฟล์: src/app/pages/DashboardPatient.tsx

- แสดงข้อความต้อนรับตามชื่อผู้ใช้
- มีตัวนับถอยหลังถึงวันนัดครั้งถัดไป
- มี quick actions ไปหน้า MRI upload และ patient history
- แสดงผลประเมินล่าสุดที่ผู้ป่วยเคยได้รับ

### Dashboard

ไฟล์: src/app/pages/Dashboard.tsx

- เป็น dashboard อีกรูปแบบหนึ่งที่ใช้ mockCases และ dashboardStats
- แสดงการ์ดสถิติและตารางเคสล่าสุด
- ใช้ mockData.ts เป็นต้นทางข้อมูล
- ปัจจุบัน route หลักใช้ DashboardWrapper มากกว่าไฟล์นี้

## หน้าประเมินและติดตามผล

### MRIUpload

ไฟล์: src/app/pages/MRIUpload.tsx

- เป็นหน้าที่รวมการอัปโหลดภาพ MRI, การจำลองการวิเคราะห์ AI, annotation บน canvas และ AI chat
- รองรับการเลือกไฟล์จาก input และการลากวาง
- startAnalysis จำลอง progress จนวิเคราะห์เสร็จ
- มีเครื่องมือ pen และ eraser สำหรับวาดทับภาพ
- มีแชตบอทที่ตอบจากชุดคำตอบตัวอย่างในตัวแอป
- หากเป็นแพทย์ ผู้ช่วยจะแนะนำคำถามที่มีเนื้อหาทางคลินิกมากกว่า

### AIAnalysis

ไฟล์: src/app/pages/AIAnalysis.tsx

- เป็น flow ตัวอย่างของการวิเคราะห์ภาพ cystoscopy แบบ mock
- โครงสร้างคล้าย MRIUpload แต่เรียบง่ายกว่า
- มีผลวิเคราะห์, confidence score, findings และปุ่ม approve/reject
- ยังไม่ถูกผูกเข้ากับ route หลักใน routes.ts

### PatientHistory

ไฟล์: src/app/pages/PatientHistory.tsx

- แสดงประวัติผลประเมินย้อนหลังของผู้ป่วย
- แต่ละรายการมีผล AI, confidence และความเห็นแพทย์
- ใช้ mockHistory ภายในไฟล์เป็นแหล่งข้อมูล

### CaseSearch

ไฟล์: src/app/pages/CaseSearch.tsx

- ใช้ค้นหาเคสจากชื่อผู้ป่วยหรือ patient id
- สามารถกรองตาม status ได้
- แสดงทั้งผล AI และความเห็นแพทย์ในแต่ละเคส
- ปุ่มดูประวัติผู้ป่วยจะส่ง id ไปที่หน้า patient-review ผ่าน query string

### PatientReviewNew

ไฟล์: src/app/pages/PatientReviewNew.tsx

- ใช้สำหรับเปรียบเทียบ MRI สองช่วงเวลาของผู้ป่วย
- อ่าน id จาก query string แต่ตอนนี้ยังใช้ mockPatient และ mockScans คงที่
- selectedScans เก็บ index ของภาพซ้ายและขวาที่กำลังเปรียบเทียบ
- มี helper สำหรับแปลงสถานะและ risk เป็นสีที่เหมาะสม

### PatientReview

ไฟล์: src/app/pages/PatientReview.tsx

- เป็นหน้ารีวิวผู้ป่วยเวอร์ชันเก่าที่ยังอยู่ใน repo
- routes.ts ไม่ได้ใช้งานไฟล์นี้แล้ว
- ใช้ mockScans ชุดอีกแบบและมี search/filter ภายในหน้า

## หน้าข้อมูลประกอบอื่น

### Appointments

ไฟล์: src/app/pages/Appointments.tsx

- แสดงรายการนัดหมายจาก mockAppointments ใน mockData.ts
- ยังไม่ถูกผูกเข้ากับ route หลักใน routes.ts
- ปุ่ม Search และ New Appointment ยังเป็น UI placeholder

### AuditLog

ไฟล์: src/app/pages/AuditLog.tsx

- แสดงตารางประวัติการอนุมัติ แก้ไข และปฏิเสธผลวินิจฉัย
- ใช้ mockAuditLogs จาก mockData.ts
- มี helper เลือก icon ตามสถานะ
- ปุ่ม export และ filter ยังเป็น UI placeholder

### NotFound

ไฟล์: src/app/pages/NotFound.tsx

- เป็นหน้า 404 สำหรับ path ที่ไม่ถูกต้อง
- มีลิงก์กลับไปหน้า dashboard

## แหล่งข้อมูล mock

ไฟล์: src/app/data/mockData.ts

- mockCases ใช้กับ dashboard และบางหน้าค้นหาเคส
- mockAppointments ใช้กับหน้านัดหมาย
- mockAuditLogs ใช้กับหน้า audit log
- dashboardStats ใช้กับ dashboard สำหรับค่าตัวเลขสรุป

## ข้อสังเกตทางสถาปัตยกรรม

- ตอนนี้หลายหน้ามี mock data ของตัวเองภายในไฟล์ และบางหน้าดึงจาก mockData.ts
- ยังไม่มี service layer หรือ API abstraction กลาง
- ยังไม่มีการ persist session เมื่อ refresh หน้า user จะหายเพราะเก็บใน state เท่านั้น
- มีทั้ง PatientReview และ PatientReviewNew อยู่ร่วมกัน ควรตัดสินใจว่าจะเก็บไฟล์ใดเป็นเวอร์ชันหลัก