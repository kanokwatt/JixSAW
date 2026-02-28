# JixSAW

โปรเจค Next.js เบื้องต้น (TypeScript) — scaffolded โดย Copilot

การใช้งานเบื้องต้น

1. ติดตั้ง dependencies

```bash
npm install
```

2. รันในโหมดพัฒนา

```bash
npm run dev
```

3. สร้าง build และรัน

```bash
npm run build
npm start
```

ไฟล์ที่สร้างให้ (ตัวอย่าง)

- `package.json` — สคริปต์ `dev`, `build`, `start`, `lint`
- `tsconfig.json` — การตั้งค่า TypeScript
- `next.config.js` — การตั้งค่า Next.js (app router)
- `.eslintrc.json`, `.prettierrc` — lint / format
- `src/app/layout.tsx`, `src/app/page.tsx` — หน้าเริ่มต้น (app router)
- `src/styles/globals.css` — สไตล์ทั่วโปรเจค

ถ้าต้องการให้ผมติดตั้ง dependencies ให้ด้วย ผมจะรัน `npm install` ให้ (ต้องอนุญาตการใช้งานเทอร์มินัล)
