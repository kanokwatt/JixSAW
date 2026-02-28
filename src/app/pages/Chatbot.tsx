import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function Chatbot() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: user?.role === 'doctor' 
        ? 'สวัสดีครับ ดร. ผมเป็น AI Assistant พร้อมช่วยตอบคำถามเกี่ยวกับมะเร็งกระเพาะปัสสาวะ และให้ข้อมูลทางการแพทย์เพิ่มเติมครับ'
        : 'สวัสดีครับ ผมเป็น AI Assistant พร้อมให้คำปรึกษาและตอบคำถามเกี่ยวกับมะเร็งกระเพาะปัสสาวะ คุณมีคำถามอะไรอยากถามไหมครับ?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestionsDoctor = [
    'อธิบายเกี่ยวกับการแบ่งระยะของมะเร็งกระเพาะปัสสาวะ',
    'แนวทางการรักษามะเร็งกระเพาะปัสสาวะ Stage 3',
    'ความแม่นยำของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ',
    'ข้อแนะนำการติดตามผู้ป่วยหลังการรักษา',
  ];

  const suggestedQuestionsPatient = [
    'มะเร็งกระเพาะปัสสาวะมีอาการอย่างไร?',
    'ควรกินอาหารอะไรดีสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ?',
    'การรักษามะเร็งกระเพาะปัสสาวะมีวิธีไหนบ้าง?',
    'ควรหลีกเลี่ยงอะไรบ้างหลังได้รับการรักษา?',
  ];

  const suggestedQuestions = user?.role === 'doctor' ? suggestedQuestionsDoctor : suggestedQuestionsPatient;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses: { [key: string]: string } = {
    'มะเร็งกระเพาะปัสสาวะมีอาการอย่างไร?': 'อาการของมะเร็งกระเพาะปัสสาวะที่พบบ่อย ได้แก่:\n\n1. ปัสสาวะมีเลือดปน (Hematuria) - เป็นอาการที่พบบ่อยที่สุด\n2. ปัสสาวะบ่อยผิดปกติ\n3. เจ็บหรือแสบขณะปัสสาวะ\n4. ปวดบริเวณหลังส่วนล่างหรือท้องน้อย\n5. รู้สึกปัสสาวะไม่สุดเมื่อเข้าห้องน้ำ\n\n⚠️ หากพบอาการเหล่านี้ ควรปรึกษาแพทย์ทันที เพื่อการวินิจฉัยและรักษาที่ถูกต้อง',
    'ควรกินอาหารอะไรดีสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ?': 'แนะนำอาหารสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ:\n\n✅ ควรรับประทาน:\n• ผักและผลไม้สดหลากหลายสี โดยเฉพาะที่มี antioxidants\n• โปรตีนคุณภาพดี เช่น ปลา ไก่ เต้าหู้\n• น้ำสะอาดเพียงพอ 8-10 แก้วต่อวัน\n• ธัญพืชเต็มเมล็ด\n\n❌ ควรหลีกเลี่ยง:\n• อาหารแปรรูป เค็มจัด\n• เนื้อแดงมากเกินไป\n• แอลกอฮอล์และบุหรี่\n• อาหารที่มีสารกันบูด\n\n💡 ควรปรึกษานักโภชนาการเพื่อวางแผนอาหารที่เหมาะกับสภาพร่างกาย',
    'การรักษามะเร็งกระเพาะปัสสาวะมีวิธีไหนบ้าง?': 'วิธีการรักษามะเร็งกระเพาะปัสสาวะ:\n\n1. การผ่าตัด (Surgery)\n   • TURBT - ผ่าตัดผ่านกล้อง สำหรับมะเร็งระยะเริ่มต้น\n   • Radical Cystectomy - ผ่าตัดเอากระเพาะปัสสาวะออก สำหรับระยะลุกลาม\n\n2. เคมีบำบัด (Chemotherapy)\n   • อาจใช้ก่อนหรือหลังผ่าตัด\n   • ใช้ร่วมกับวิธีอื่นๆ\n\n3. รังสีรักษา (Radiation Therapy)\n   • มักใช้ร่วมกับเคมีบำบัด\n\n4. Immunotherapy\n   • กระตุ้นภูมิคุ้มกันให้ต่อสู้กับเซลล์มะเร็ง\n\n⚕️ แพทย์จะเลือกวิธีรักษาตามระยะของโรคและสภาพร่างกายผู้ป่วย',
    'อธิบายเกี่ยวกับการแบ่งระยะของมะเร็งกระเพาะปัสสาวะ': 'การแบ่งระยะมะเร็งกระเพาะปัสสาวะ (TNM Staging):\n\n📊 ระยะที่ 0 (Stage 0)\n• มะเร็งอยู่เฉพาะชั้นผิวสุดของกระเพาะปัสสาวะ\n• รักษาได้ดีที่สุด\n\n📊 ระยะที่ 1 (Stage I)\n• มะเร็งลุกลามเข้าไปในชั้นใต้เยื่อบุผิว แต่ยังไม่ถึงชั้นกล้ามเนื้อ\n\n📊 ระยะที่ 2 (Stage II)\n• มะเร็งลุกลามเข้าชั้นกล้ามเนื้อของกระเพาะปัสสาวะ\n\n📊 ระยะที่ 3 (Stage III)\n• มะเร็งลุกลามทะลุผนังกระเพาะปัสสาวะ หรือลุกลามไปยังอวัยวะใกล้เคียง\n\n📊 ระยะที่ 4 (Stage IV)\n• มะเร็งแพร่กระจายไปยังต่อมน้ำเหลืองหรืออวัยวะอื่นๆ\n\n🔬 การกำหนดระยะช่วยวางแผนการรักษาที่เหมาะสมที่สุด',
    'แนวทางการรักษามะเร็งกระเพาะปัสสาวะ Stage 3': 'แนวทางการรักษา Stage III:\n\n🏥 Standard Treatment:\n1. Neoadjuvant Chemotherapy\n   • เคมีบำบัดก่อนผ่าตัด 3-4 รอบ\n   • ช่วยลดขนาดเนื้องอก\n\n2. Radical Cystectomy\n   • ผ่าตัดเอากระเพาะปัสสาวะและอวัยวะใกล้เคียงที่มีมะเร็งลุกลาม\n   • Urinary diversion สร้างทางเดินปัสสาวะใหม่\n\n3. Adjuvant Therapy\n   • เคมีบำบัดหลังผ่าตัด\n   • พิจารณา Immunotherapy\n\n📋 Multidisciplinary Approach:\n• Urologist\n• Medical Oncologist\n• Radiation Oncologist\n• Nutritionist\n• Psychologist\n\n⚕️ ติดตามผลระยะยาวทุก 3-6 เดือน',
    'ความแม่นยำของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ': 'ประสิทธิภาพของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ:\n\n🔬 ความแม่นยำ:\n• Sensitivity: 85-95%\n• Specificity: 80-90%\n• T-staging accuracy: 85-90%\n• N-staging accuracy: 70-80%\n\n✅ ข้อดี:\n• ความละเอียดสูงในการดูเนื้อเยื่ออ่อน\n• แยกแยะชั้นของผนังกระเพาะปัสสาวะได้ดี\n• ไม่มีรังสี\n• ประเมินการลุกลามไปยังอวัยวะข้างเคียงได้ดี\n\n⚠️ ข้อจำกัด:\n• ราคาแพงกว่า CT\n• ใช้เวลานานกว่า\n• ผู้ป่วยบางรายอาจทำไม่ได้ (มี pacemaker)\n\n🏥 แนะนำใช้ร่วมกับ:\n• Cystoscopy\n• CT Urography\n• Biopsy เพื่อยืนยันผล',
  };

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: messages.length,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[textToSend] || `ขอบคุณสำหรับคำถามครับ สำหรับคำถาม "${textToSend}" ผมแนะนำให้ปรึกษาแพทย์โดยตรงเพื่อข้อมูลที่แม่นยำและเหมาะสมกับสภาวะของคุณครับ\n\n💡 คุณสามารถเลือกคำถามจากตัวอย่างด้านล่าง หรือถามเกี่ยวกับ:\n• อาการและการวินิจฉัย\n• วิธีการรักษา\n• การดูแลตัวเอง\n• คำแนะนำทั่วไป`;

      const aiMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col p-8 bg-background">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Medical AI Assistant</h1>
            <p className="text-muted-foreground text-base font-medium">Powered by JIxSAW Health • Real-time medical guidance</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card rounded-3xl shadow-2xl border-2 border-border flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-accent/20 to-transparent">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-primary to-blue-500 shadow-primary/30'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-2xl ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block px-6 py-4 rounded-2xl shadow-md ${
                      message.role === 'assistant'
                        ? 'bg-card text-foreground border-2 border-border'
                        : 'bg-gradient-to-r from-primary to-emerald-500 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed font-medium">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 px-2 font-medium">
                    {message.timestamp.toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-card border-2 border-border px-6 py-4 rounded-2xl shadow-md">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-8 py-5 border-t-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
            <p className="text-sm font-bold mb-4 text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              คำถามที่พบบ่อย:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSendMessage(question)}
                  className="px-5 py-3 bg-card border-2 border-border rounded-xl text-sm text-left hover:bg-accent hover:border-primary/50 hover:shadow-md transition-all duration-200 font-medium"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t-2 border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="พิมพ์คำถามของคุณที่นี่..."
              disabled={isTyping}
              className="flex-1 px-6 py-4 bg-accent/50 border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all font-medium shadow-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-7 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-2xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">ส่ง</span>
                </>
              )}
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center font-medium">
            ⚠️ AI Assistant ให้ข้อมูลเพื่อการศึกษาและอ้างอิงเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์โดยตรง
          </p>
        </div>
      </div>
    </div>
  );
}