# ใช้ Node.js version 18 (หรือ 20) แบบ alpine เพื่อให้ไฟล์มีขนาดเล็ก
FROM node:18-alpine

# ตั้งค่า Directory หลักใน Container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้าไปก่อน
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดในโปรเจกต์เข้าไป
COPY . .

# เปิด Port 3000
EXPOSE 3000

# รันคำสั่ง dev (อ้างอิงจาก package.json ที่เราแก้เป็น next dev -H 0.0.0.0 -p 3000)
CMD ["npm", "run", "dev"]