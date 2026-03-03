import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare, Pen, Eraser, RotateCcw, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'good' | 'bad' | null;
  feedbackComment?: string;
}

"use client";

export function MRIUpload() {
  const { user } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [doctorOpinion, setDoctorOpinion] = useState<'good' | 'bad' | null>(null);
  
  // Drawing tools state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen');

  // Chatbot state
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
  const [showFeedbackForm, setShowFeedbackForm] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestionsDoctor = [
    'อธิบายเกี่ยวกับการแบ่งระยะของมะเร็งกระเพาะปัสสาวะ',
    'แนวทางการรักษามะเร็งกระเพาะปัสสาวะ Stage 3',
    'ความแม่นยำของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ',
  ];

  const suggestedQuestionsPatient = [
    'มะเร็งกระเพาะปัสสาวะมีอาการอย่างไร?',
    'ควรกินอาหารอะไรดีสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ?',
    'การรักษามะเร็งกระเพาะปัสสาวะมีวิธีไหนบ้าง?',
  ];

  const suggestedQuestions = user?.role === 'doctor' ? suggestedQuestionsDoctor : suggestedQuestionsPatient;

  const aiResponses: { [key: string]: string } = {
    'มะเร็งกระเพาะปัสสาวะมีอาการอย่างไร?': 'อาการของมะเร็งกระเพาะปัสสาวะที่พบบ่อย ได้แก่:\n\n1. ปัสสาวะมีเลือดปน (Hematuria) - เป็นอาการที่พบบ่อยที่สุด\n2. ปัสสาวะบ่อยผิดปกติ\n3. เจ็บหรือแสบขณะปัสสาวะ\n4. ปวดบริเวณหลังส่วนล่างหรือท้องน้อย\n5. รู้สึกปัสสาวะไม่สุดเมื่อเข้าห้องน้ำ\n\n⚠️ หากพบอาการเหล่านี้ ควรปรึกษาแพทย์ทันที เพื่อการวินิจฉัยและรักษาที่ถูกต้อง',
    'ควรกินอาหารอะไรดีสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ?': 'แนะนำอาหารสำหรับผู้ป่วยมะเร็งกระเพาะปัสสาวะ:\n\n✅ ควรรับประทาน:\n• ผักและผลไม้สดหลากหลายสี โดยเฉพาะที่มี antioxidants\n• โปรตีนคุณภาพดี เช่น ปลา ไก่ เต้าหู้\n• น้ำสะอาดเพียงพอ 8-10 แก้วต่อวัน\n• ธัญพืชเต็มเมล็ด\n\n❌ ควรหลีกเลี่ยง:\n• อาหารแปรรูป เค็มจัด\n• เนื้อแดงมากเกินไป\n• แอลกอฮอล์และบุหรี่\n• อาหารที่มีสารกันบูด\n\n💡 ควรปรึกษานักโภชนาการเพื่อวางแผนอาหารที่เหมาะกับสภาพร่างกาย',
    'การรักษามะเร็งกระเพาะปัสสาวะมีวิธีไหนบ้าง?': 'วิธีการรักษามะเร็งกระเพาะปัสสาวะ:\n\n1. การผ่าตัด (Surgery)\n   • TURBT - ผ่าตัดผ่านกล้อง สำหรับมะเร็งระยะเริ่มต้น\n   • Radical Cystectomy - ผ่าตัดเอากระเพาะปัสสาวะออก สำหรับระยะลุกลาม\n\n2. เคมีบำบัด (Chemotherapy)\n   • อาจใช้ก่อนหรือหลังผ่าตัด\n   • ใช้ร่วมกับวิธีอื่นๆ\n\n3. รังสีรักษา (Radiation Therapy)\n   • มักใช้ร่วมกับเคมีบำบัด\n\n4. Immunotherapy\n   • กระตุ้นภูมิคุ้มกันให้ต่อสู้กับเซลล์มะเร็ง\n\n⚕️ แพทย์จะเลือกวิธีรักษาตามระยะของโรคและสภาพร่างกายผู้ป่วย',
    'อธิบายเกี่ยวกับการแบ่งระยะของมะเร็งกระเพาะปัสสาวะ': 'การแบ่งระยะมะเร็งกระเพาะปัสสาวะ (TNM Staging):\n\n📊 ระยะที่ 0 (Stage 0)\n• มะเร็งอยู่เฉพาะชั้นผิวสุดของกระเพาะปัสสาวะ\n• รักษาได้ดีที่สุด\n\n📊 ระยะที่ 1 (Stage I)\n• มะเร็งลุกลามเข้าไปในชั้นใต้เยื่อบุผิว แต่ยังไม่ถึงชั้นกล้ามเนื้อ\n\n📊 ระยะที่ 2 (Stage II)\n• มะเร็งลุกลามเข้าชั้นกล้ามเนื้อของกระเพาะปัสสาวะ\n\n📊 ระยะที่ 3 (Stage III)\n• มะเร็งลุกลามทะลุผนังกระเพาะปัสสาวะ หรือลุกลามไปยังอวัยวะใกล้เคียง\n\n📊 ระยะที่ 4 (Stage IV)\n• มะเร็งแพร่กระจายไปยังต่อมน้ำเหลืองหรืออวัยวะอื่นๆ\n\n🔬 การกำหนดระยะช่วยวางแผนการรักษาที่เหมาะสมที่สุด',
    'แนวทางการรักษามะเร็งกระเพาะปัสสาวะ Stage 3': 'แนวทางการรักษา Stage III:\n\n🏥 Standard Treatment:\n1. Neoadjuvant Chemotherapy\n   • เคมีบำบัดก่อนผ่าตัด 3-4 รอบ\n   • ช่วยลดขนาดเนื้องอก\n\n2. Radical Cystectomy\n   • ผ่าตัดเอากระเพาะปัสสาวะและอวัยวะใกล้เคียงที่มีมะเร็งลุกลาม\n   • Urinary diversion สร้างทางเดินปัสสาวะใหม่\n\n3. Adjuvant Therapy\n   • เคมีบำบัดหลังผ่าตัด\n   • พิจารณา Immunotherapy\n\n📋 Multidisciplinary Approach:\n• Urologist\n• Medical Oncologist\n• Radiation Oncologist\n• Nutritionist\n• Psychologist\n\n⚕️ ติดตามผลระยะยาวทุก 3-6 เดือน',
    'ความแม่นยำของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ': 'ประสิทธิภาพของ MRI ในการตรวจมะเร็งกระเพาะปัสสาวะ:\n\n🔬 ความแม่นยำ:\n• Sensitivity: 85-95%\n• Specificity: 80-90%\n• T-staging accuracy: 85-90%\n• N-staging accuracy: 70-80%\n\n✅ ข้อดี:\n• ความละเอียดสูงในการดูเนื้อเยื่ออ่อน\n• แยกแยะชั้นของผนังกระเพาะปัสสาวะได้ดี\n• ไม่มีรังสี\n• ประเมินการลุกลามไปยังอวัยวะข้างเคียงได้ดี\n\n⚠️ ข้อจำกัด:\n• ราคาแพงกว่า CT\n• ใช้เวลานานกว่า\n• ผู้ป่วยบางรายอาจทำไม่ได้ (มี pacemaker)\n\n🏥 แนะนำใช้ร่วมกับ:\n• Cystoscopy\n• CT Urography\n• Biopsy เพื่อยืนยันผล',
  };

  // Mock MRI image
  const mockImageUrl = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080';

  // Chatbot functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleFeedback = (messageId: number, feedback: 'good' | 'bad') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSubmitFeedback = () => {
    if (!doctorOpinion) {
      alert('กรุณาเลือกความเห็นของแพทย์');
      return;
    }
    alert(`ความเห็นของแพทย์ถูกบันทึก:\n${doctorOpinion === 'good' ? 'ดี' : 'ไม่ดี'}\n\nหมายเหตุ: ${doctorFeedback || 'ไม่มี'}`);
  };

  // Canvas drawing functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && analysisComplete) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [analysisComplete]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (drawingTool === 'pen') {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const changeTool = (tool: 'pen' | 'eraser') => {
    setDrawingTool(tool);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1920px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          MRI Assessment
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          อัปโหลด MRI เพื่อการประเมินมะเร็งกระเพาะปัสสาวะเบื้องต้น และรับคำปรึกษาจาก AI Assistant
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Section - Upload and Results (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="bg-gradient-to-br from-card to-accent/30 rounded-3xl border-3 border-dashed border-border p-16 text-center hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Upload MRI Image</h3>
              <p className="text-sm text-muted-foreground mb-6 font-medium">
                Drag and drop or click to browse
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-8 py-3.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 font-semibold"
              >
                Select File
              </button>
            </label>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-7 shadow-lg border-2 border-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="font-bold text-lg">AI Analysis in Progress...</span>
              </div>
              <div className="bg-muted rounded-full h-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-primary to-emerald-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3 font-semibold">{progress}% Complete</p>
            </motion.div>
          )}

          {/* Image Preview Section */}
          {(selectedImage || analysisComplete) && (
            <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
              <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
                <h3 className="text-xl font-bold">MRI Image Preview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Drawing Tools - Only for doctors */}
                  {user?.role === 'doctor' && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-accent/50 to-accent/30 rounded-xl p-4 border-2 border-border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => changeTool('pen')}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                            drawingTool === 'pen'
                              ? 'bg-primary text-white shadow-lg'
                              : 'bg-card hover:bg-accent'
                          }`}
                        >
                          <Pen className="w-4 h-4" />
                          ปากกา
                        </button>
                        <button
                          onClick={() => changeTool('eraser')}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                            drawingTool === 'eraser'
                              ? 'bg-primary text-white shadow-lg'
                              : 'bg-card hover:bg-accent'
                          }`}
                        >
                          <Eraser className="w-4 h-4" />
                          ยางลบ
                        </button>
                        <button
                          onClick={clearCanvas}
                          className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-red-50 hover:text-red-600 rounded-lg font-semibold transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          ล้างทั้งหมด
                        </button>
                      </div>
                      <div className="flex-1" />
                      <div className="text-sm font-semibold text-muted-foreground">
                        {drawingTool === 'pen' ? '🖊️ วาดบนภาพเพื่อระบุตำแหน่ง' : '🧹 ลบรอยวาด'}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={selectedImage || mockImageUrl}
                      alt="MRI Scan"
                      className="w-full h-full object-cover"
                    />
                    {analysisComplete && showOverlay && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* AI Detection Overlay */}
                        <svg className="w-full h-full" viewBox="0 0 400 400">
                          <rect
                            x="120"
                            y="150"
                            width="160"
                            height="120"
                            fill="none"
                            stroke="#FF6B6B"
                            strokeWidth="4"
                            className="animate-pulse"
                          />
                          <rect
                            x="120"
                            y="150"
                            width="160"
                            height="120"
                            fill="#FF6B6B"
                            fillOpacity="0.2"
                          />
                          <text
                            x="200"
                            y="290"
                            textAnchor="middle"
                            fill="#FF6B6B"
                            fontSize="16"
                            fontWeight="bold"
                          >
                            Area of Tumor
                          </text>
                        </svg>
                      </motion.div>
                    )}
                    {/* Doctor Drawing Canvas */}
                    {user?.role === 'doctor' && (
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={600}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Results */}
          {analysisComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden"
            >
              <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
                <h3 className="text-xl font-bold">AI Analysis Results</h3>
              </div>
              <div className="p-7 space-y-6">
                {/* T Staging */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-2 border-purple-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-purple-900 text-base flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Tumor Staging (TNM)
                    </h4>
                    <span className="text-3xl font-bold text-purple-700">T2</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['T1', 'T2', 'T3', 'T4'].map((stage) => (
                      <div
                        key={stage}
                        className={`text-center py-2.5 rounded-lg font-bold text-sm transition-all ${
                          stage === 'T2'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-white/60 text-purple-600 border border-purple-200'
                        }`}
                      >
                        {stage}
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-purple-200">
                    <p className="text-sm text-purple-900 font-semibold mb-1">Stage T2:</p>
                    <p className="text-xs text-purple-800 font-medium">
                      Tumor invades muscularis propria (muscle layer)
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold">Risk Assessment</span>
                    <span className="text-2xl font-bold text-orange-600">Medium Risk</span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      <span className="font-bold text-orange-900">Confidence: 82%</span>
                    </div>
                    <div className="bg-muted rounded-full h-3 overflow-hidden mb-4">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-5">
                  <h4 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    AI Findings
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2 font-medium">
                    <li>• Irregular bladder wall thickening detected in posterior wall</li>
                    <li>• Tumor invasion into muscle layer (T2 classification)</li>
                    <li>• Possible infiltration into muscularis propria</li>
                    <li>• Recommend further evaluation with cystoscopy</li>
                    <li>• No evidence of lymph node involvement</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3 bg-accent/50 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="show-overlay"
                    checked={showOverlay}
                    onChange={(e) => setShowOverlay(e.target.checked)}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <label htmlFor="show-overlay" className="text-sm cursor-pointer font-semibold">
                    Show AI Detection Overlay
                  </label>
                </div>

                {/* Doctor Feedback Section (Only for doctors) */}
                {user?.role === 'doctor' && (
                  <div className="border-t-2 border-border pt-6 space-y-4">
                    <h4 className="font-bold text-base">ความเห็นของแพทย์</h4>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDoctorOpinion('good')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-bold ${
                          doctorOpinion === 'good'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-lg'
                            : 'bg-card border-border hover:border-emerald-300'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        เห็นด้วย
                      </button>
                      <button
                        onClick={() => setDoctorOpinion('bad')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-bold ${
                          doctorOpinion === 'bad'
                            ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-lg'
                            : 'bg-card border-border hover:border-orange-300'
                        }`}
                      >
                        <ThumbsDown className="w-5 h-5" />
                        ไม่เห็นด้วย
                      </button>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold">หมายเหตุและความเห็นเพิ่มเติม</label>
                      <textarea
                        value={doctorFeedback}
                        onChange={(e) => setDoctorFeedback(e.target.value)}
                        placeholder="บันทึกความเห็นและคำแนะนำเพิ่มเติมสำหรับผู้ป่วย..."
                        rows={4}
                        className="w-full px-4 py-3 bg-accent/50 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmitFeedback}
                      className="w-full py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 font-bold flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      บันทึกความเห็น
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Info */}
          {analysisComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6"
            >
              <h4 className="font-bold text-blue-900 mb-3 text-base">
                {user?.role === 'doctor' ? 'แพทย์เป็นผู้ตัดสินใจขั้นสุดท้าย' : 'สำคัญ: AI ให้ข้อมูลเบื้องต้นเท่านั้น'}
              </h4>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                {user?.role === 'doctor'
                  ? 'ผลการประเมินจาก AI เป็นเครื่องมือช่วยในการวินิจฉัย แพทย์เป็นผู้มีอำนาจตัดสินใจสูงสุดในการประเมินและวางแผนการรักษา กรุณาตรวจสอบผลและให้ความเห็นเพิ่มเติม'
                  : 'ผลการประเมินจาก AI เป็นเพียงข้อมูลเบื้องต้น การวินิจฉัยและการรักษาที่แท้จริงต้องได้รับการยืนยันจากแพทย์ผู้เชี่ยวชาญเท่านั้น กรุณารอแพทย์ตรวจสอบและให้คำแนะนำเพิ่มเติม'
                }
              </p>
            </motion.div>
          )}
        </div>

        {/* Right Section - Chatbot (1 column) */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl shadow-lg border-2 border-border flex flex-col sticky top-8" style={{ maxHeight: '90vh' }}>
            {/* Chatbot Header */}
            <div className="p-5 border-b-2 border-border bg-gradient-to-r from-primary/10 to-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground font-medium">ถามคำถามเกี่ยวกับการรักษา</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-accent/20 to-transparent">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                        message.role === 'assistant'
                          ? 'bg-gradient-to-br from-primary to-blue-500 shadow-primary/30'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-3 rounded-xl shadow-sm text-sm ${
                          message.role === 'assistant'
                            ? 'bg-card text-foreground border border-border'
                            : 'bg-gradient-to-r from-primary to-emerald-500 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed font-medium">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1 font-medium">
                        {message.timestamp.toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {/* Feedback Section - Only for doctors */}
                      {message.role === 'assistant' && user?.role === 'doctor' && message.id > 0 && (
                        <div className="mt-2">
                          {message.feedback ? (
                            <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <span>{message.feedback === 'good' ? '👍 ดี' : '👎 ไม่ดี'}</span>
                              {message.feedbackComment && <span>• {message.feedbackComment}</span>}
                            </div>
                          ) : showFeedbackForm === message.id ? (
                            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-lg p-2">
                              <button
                                onClick={() => {
                                  handleFeedback(message.id, 'good');
                                  setShowFeedbackForm(null);
                                  setFeedbackComment('');
                                }}
                                className="flex items-center gap-1 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded text-xs font-semibold transition-all"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                ดี
                              </button>
                              <button
                                onClick={() => setShowFeedbackForm(-1)}
                                className="flex items-center gap-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-xs font-semibold transition-all"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                ไม่ดี
                              </button>
                              <button
                                onClick={() => {
                                  setShowFeedbackForm(null);
                                  setFeedbackComment('');
                                }}
                                className="px-2 py-1 text-muted-foreground hover:text-foreground text-xs font-semibold"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : showFeedbackForm === -1 && message.id === messages[messages.length - 1].id ? (
                            <div className="inline-flex flex-col gap-2 bg-card border border-border rounded-lg p-2 min-w-[250px]">
                              <textarea
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="ระบุความเห็นเพิ่มเติม..."
                                rows={2}
                                className="w-full px-2 py-1 bg-accent/50 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium resize-none text-xs"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    handleFeedback(message.id, 'bad');
                                    if (feedbackComment.trim()) {
                                      setMessages((prev) =>
                                        prev.map((msg) =>
                                          msg.id === message.id
                                            ? { ...msg, feedbackComment: feedbackComment }
                                            : msg
                                        )
                                      );
                                    }
                                    setShowFeedbackForm(null);
                                    setFeedbackComment('');
                                  }}
                                  className="flex-1 px-3 py-1 bg-gradient-to-r from-primary to-emerald-500 text-white rounded hover:shadow-md transition-all font-semibold text-xs"
                                >
                                  บันทึก
                                </button>
                                <button
                                  onClick={() => {
                                    setShowFeedbackForm(null);
                                    setFeedbackComment('');
                                  }}
                                  className="px-3 py-1 bg-accent hover:bg-accent/70 rounded font-semibold text-xs transition-all"
                                >
                                  ยกเลิก
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowFeedbackForm(message.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-accent hover:bg-accent/70 border border-border rounded font-semibold transition-all"
                            >
                              <span>ให้ความเห็น</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-card border border-border px-4 py-3 rounded-xl shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-t border-border bg-gradient-to-r from-accent/50 to-transparent flex-shrink-0">
                <p className="text-xs font-bold mb-2 text-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  คำถามที่พบบ่อย:
                </p>
                <div className="grid gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSendMessage(question)}
                      className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-left hover:bg-accent hover:border-primary/50 transition-all font-medium"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t-2 border-border bg-card flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="พิมพ์คำถาม..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 bg-accent/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all font-medium text-sm shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center font-medium">
                ⚠️ AI ให้ข้อมูลเพื่อการศึกษาเท่านั้น
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}