"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-slate-800 p-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">ระบบรัน Next.js สำเร็จแล้ว! 🎉</h1>
      <p className="text-lg text-gray-600 mb-8">
        พร้อมสำหรับการพัฒนาต่อด้วย Tailwind CSS และเครื่องมืออื่นๆ
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 max-w-lg w-full text-center leading-relaxed">
        <p className="text-gray-600">
          💡 <b>ขั้นตอนต่อไป:</b> <br />
          คุณสามารถคัดลอกโค้ด UI จากไฟล์ <code className="bg-gray-100 text-pink-600 px-2 py-1 rounded text-sm font-mono">App.tsx</code> หรือหน้าจอหลักจากโปรเจกต์เดิม 
          มาวางแทนที่ <code>&lt;main&gt;...&lt;/main&gt;</code> ในไฟล์นี้ได้เลยครับ
        </p>
      </div>
    </main>
  );
}