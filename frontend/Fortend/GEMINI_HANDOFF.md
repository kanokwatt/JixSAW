# Gemini Handoff Prompt (พร้อมวาง)

คัดลอกข้อความในหัวข้อ **Prompt for Gemini** ด้านล่างไปวางใน Gemini ได้ทันที

---

## Prompt for Gemini

คุณเป็นผู้ช่วยโค้ดในโปรเจกต์ React + Vite ชื่อ JIxSAW Plus

### เป้าหมาย
- ช่วยตรวจคุณภาพโค้ดและเสนอการลดขนาด bundle เพิ่มเติม โดยไม่เปลี่ยน UX เดิม
- แก้เฉพาะจุดที่จำเป็นและคงดีไซน์เดิม

### Stack ปัจจุบัน
- Vite 6
- React 18
- React Router 7
- TailwindCSS 4
- lucide-react
- motion

### สถานะล่าสุดของโปรเจกต์
- build ผ่านแล้ว (`npm run build`)
- routes ถูกปรับเป็น lazy loading แล้ว
- ลบไฟล์ legacy/unused หลายไฟล์แล้ว
- ลด dependencies เหลือเท่าที่ใช้งานจริง
- เพิ่ม `.gitignore` แล้ว (ignore `node_modules/`, `dist/`)

### ไฟล์สำคัญที่ควรอ่านก่อน
- `package.json`
- `src/app/routes.ts`
- `src/app/pages/CaseSearch.tsx`
- `src/app/pages/PatientReviewNew.tsx`
- `src/styles/index.css`
- `vite.config.ts`

### ข้อกำหนดในการแก้
1. ห้ามเปลี่ยนพฤติกรรม UX ที่ผู้ใช้เห็น
2. ห้ามเพิ่มไลบรารีใหม่ถ้าไม่จำเป็น
3. ถ้าแก้โค้ด ให้เสนอเป็น patch แบบไฟล์ต่อไฟล์
4. เน้นลด bundle size และลดโค้ดซ้ำ
5. หลังเสนอแก้ ให้มี checklist ตรวจว่า build ยังผ่าน

### งานที่อยากให้ทำต่อ (เรียงลำดับ)
1. วิเคราะห์ว่า chunk ไหนใหญ่ผิดปกติ และเสนอแนวทางลด (ไม่เปลี่ยน UX)
2. ตรวจหา dead code / imports ที่ลบได้เพิ่ม
3. เสนอ refactor เล็กๆ ที่ช่วยให้ maintain ง่ายขึ้น
4. ทำแผน 2 ระดับ:
   - Quick wins (ทำได้ทันที)
   - Safe refactor (ความเสี่ยงต่ำ)

### รูปแบบคำตอบที่ต้องการ
- สรุปสั้นก่อน 5-8 บรรทัด
- ตามด้วยรายการแก้แบบ actionable
- ถ้ามีโค้ด ให้บอก path ชัดเจน
- ปิดท้ายด้วย “ลำดับลงมือทำทีละขั้น”

---

## หมายเหตุ
- โฟลเดอร์ `node_modules` ใช้สำหรับรันในเครื่องเท่านั้น ไม่ควรส่งต่อในแชตหรือ commit
- ถ้าจะส่งให้คนอื่น ให้ส่งเฉพาะ source code + `package.json` แล้วให้ปลายทางรัน `npm install`

---

## วิธีอัปโหลดเข้า Gemini (ไม่ชนลิมิต)

### ข้อจำกัดที่ต้องเช็ก
- อัปโหลดได้ไม่เกิน 10 ไฟล์ต่อพรอมต์
- ไฟล์ทั่วไปต้องไม่เกิน 100 MB ต่อไฟล์
- ถ้าแนบโฟลเดอร์โค้ด: ได้ 1 โฟลเดอร์, สูงสุด 5,000 ไฟล์, ขนาดรวมไม่เกิน 100 MB

### วิธีที่แนะนำสำหรับโปรเจกต์นี้
1. **ห้ามแนบ `node_modules/` และ `dist/`**
2. แนบเป็น **โฟลเดอร์โค้ด 1 โฟลเดอร์** (ทั้งโปรเจกต์) โดยให้เหลือเฉพาะ source
3. ถ้าขนาดยังเกิน 100 MB ให้แนบแบบ “ไฟล์สำคัญ 6-10 ไฟล์” ตามรายการนี้แทน:
   - `package.json`
   - `vite.config.ts`
   - `src/app/routes.ts`
   - `src/app/App.tsx`
   - `src/app/pages/CaseSearch.tsx`
   - `src/app/pages/PatientReviewNew.tsx`
   - `src/styles/index.css`
   - `src/styles/theme.css`
   - `README.md`
   - `GEMINI_HANDOFF.md`

### Prompt สั้นสำหรับแปะพร้อมไฟล์
"ช่วยรีวิวและปรับโค้ดโปรเจกต์นี้โดยไม่เปลี่ยน UX เดิม เน้นลด bundle size, ลดโค้ดซ้ำ, และแก้ error ที่เหลือทั้งหมด พร้อมสรุปเป็น patch รายไฟล์และลำดับลงมือทำ"
