

# รอของเพื่อนส่งมาให้ก่อนนะครับ :)


# import ollama
# import tensorflow as tf  # สมมติว่าเพื่อนใช้ TensorFlow/Keras
# import numpy as np
# from PIL import Image

# # --- ส่วนเดิมของคุณ (ห้ามแก้) ---
# MODEL_NAME = "thiagomoraes/medgemma-4b-it:Q4_K_S"

# def chat_medgemma(messages: list): 
#     try:
#         system_instruction = {
#             'role': 'system',
#             'content': (
#                 "You are a medical assistant. You can use Markdown to show images if relevant. "
#                 "For example: ![description](url). But prioritize safety and consult a doctor."
#             )
#         }
#         full_messages = [system_instruction] + [m for m in messages if m['role'] != 'system']
#         response = ollama.chat(model=MODEL_NAME, messages=full_messages)
#         return response['message']['content']
#     except Exception as e:
#         return f"เกิดข้อผิดพลาดจาก AI: {str(e)}"

# # --- ส่วนที่เพิ่มใหม่: สำหรับวิเคราะห์ภาพมะเร็ง (ของเพื่อน) ---
# # โหลดโมเดลที่เพื่อนเทรนมา (ระบุพาธไฟล์ที่เพื่อนส่งมาให้)
# try:
#     cnn_model = tf.keras.models.load_model("models/bladder_cancer_model.h5")
# except:
#     cnn_model = None

# def predict_bladder_cancer(image_path):
#     if cnn_model is None:
#         return "Error", "0%", "ระบบยังไม่ได้ติดตั้งโมเดลวิเคราะห์ภาพ"
    
#     try:
#         # 1. เตรียมรูปภาพให้ตรงกับที่เพื่อนเทรน (เช่นขนาด 224x224)
#         img = Image.open(image_path).resize((224, 224))
#         img_array = np.array(img) / 255.0  # Normalize
#         img_array = np.expand_dims(img_array, axis=0)

#         # 2. ให้โมเดลของเพื่อนทำนาย
#         predictions = cnn_model.predict(img_array)
        
#         # 3. แปลงผลลัพธ์ (ตัวอย่าง)
#         classes = ["Normal", "Stage 1", "Stage 2", "Stage 3"]
#         result_idx = np.argmax(predictions[0])
#         confidence = f"{np.max(predictions[0]) * 100:.2f}%"
        
#         # ส่งค่ากลับไปบันทึกลงฐานข้อมูลตามตาราง Diagnosis ของคุณ
#         recommendations = {
#             "Normal": "ไม่พบความผิดปกติเบื้องต้น ควรตรวจสุขภาพประจำปี",
#             "Stage 1": "พบเนื้องอกระยะเริ่มต้น แนะนำให้ปรึกษาแพทย์เฉพาะทางทันที",
#             "Stage 2": "พบความผิดปกติชัดเจน จำเป็นต้องตรวจชิ้นเนื้อเพิ่มเติม",
#             "Stage 3": "ระยะลุกลาม โปรดติดต่อศูนย์มะเร็งด่วน"
#         }
        
#         return classes[result_idx], confidence, recommendations.get(classes[result_idx], "โปรดปรึกษาแพทย์")
#     except Exception as e:
#         return "Error", "0%", f"เกิดข้อผิดพลาดในการวิเคราะห์: {str(e)}"


import ollama

# ตั้งค่าโมเดลที่คุณโหลดมา
MODEL_NAME = "thiagomoraes/medgemma-4b-it:Q4_K_S"

def chat_medgemma(messages: list): # ใช้ list เพื่อรองรับประวัติการคุยต่อเนื่อง
    try:
        # เพิ่มคำสั่งให้ AI รู้ว่าแสดงรูปผ่าน Markdown ได้
        system_instruction = {
            'role': 'system',
            'content': (
                "You are a medical assistant. You can use Markdown to show images if relevant. "
                "For example: ![description](url). But prioritize safety and consult a doctor."
            )
        }
        
        # แทรกคำสั่งระบบเข้าไปในประวัติการคุย โดยไม่ให้มี system ซ้ำซ้อน
        full_messages = [system_instruction] + [m for m in messages if m['role'] != 'system']

        response = ollama.chat(model=MODEL_NAME, messages=full_messages)
        return response['message']['content']
    except Exception as e:
        return f"เกิดข้อผิดพลาดจาก AI: {str(e)}"