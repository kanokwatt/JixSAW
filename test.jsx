import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Upload, 
  FileText, 
  Activity, 
  Shield, 
  User, 
  Menu, 
  Image as ImageIcon, 
  FileDigit, 
  Send,
  Microscope,
  Database,
  ChevronRight,
  Sparkles,
  Volume2,
  Loader2,
  Play,
  Stethoscope,
  HeartPulse,
  ArrowRight,
  LogOut
} from 'lucide-react';

// --- GEMINI API CONFIGURATION ---
const apiKey = ""; // API Key injected by environment

const GEMINI_MODELS = {
  text: "gemini-2.5-flash-preview-09-2025",
  tts: "gemini-2.5-flash-preview-tts"
};

// --- API HELPER FUNCTIONS ---
const callGemini = async (prompt, systemInstruction) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODELS.text}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      }
    );
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ระบบไม่สามารถประมวลผลได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI (Simulated: API Key missing or network error)";
  }
};

const callGeminiTTS = async (text, setAudioSrc) => {
  try {
    // Simulated TTS call for demo purpose (Actual API requires handling binary response)
    console.log("TTS Triggered for:", text);
    return true; 
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return false;
  }
};

// --- MOCK DATA ---
const USERS = [
  { id: 'u-001', email: 'somchai@example.com', full_name: 'คุณสมชาย ใจดี', role: 'patient', created_at: '2024-01-01T10:00:00Z' },
  { id: 'd-001', email: 'dr.woramet@hospital.com', full_name: 'Dr. Woramet', role: 'doctor', created_at: '2023-05-15T08:00:00Z' }
];

const PATIENT_CASES = [
  {
    id: 'c-101',
    case_code: '#4402',
    assigned_doctor_id: 'd-001',
    patient_name: 'สมชาย ใจดี',
    age_years: 65,
    sex: 'male',
    visit_date: '2024-02-18',
    status: 'analyzing',
    priority: 'urgent',
    note: 'Gross Hematuria 2 weeks. History of smoking.',
    created_at: '2024-02-18T09:00:00Z'
  },
  {
    id: 'c-102',
    case_code: '#4399',
    assigned_doctor_id: 'd-001',
    patient_name: 'Unknown Patient',
    age_years: 42,
    sex: 'female',
    visit_date: '2024-02-10',
    status: 'done',
    priority: 'normal',
    note: 'Follow up cystoscopy.',
    created_at: '2024-02-10T14:00:00Z'
  }
];

const DIAGNOSIS_RESULTS = [
  {
    id: 'r-501',
    case_id: 'c-101',
    stage: 'T1',
    confidence: 0.82,
    model_version: 'v2.5.1',
    result_json: {
      differentials: [
        { name: 'Urothelial Carcinoma', prob: 0.82 },
        { name: 'Cystitis', prob: 0.12 }
      ],
      segmentation_mask_available: true
    },
    mask_storage_url: '/mocks/masks/c-101.png'
  }
];

const INITIAL_CHAT_MESSAGES = [
  {
    id: 'm-001',
    session_id: 's-881',
    role: 'assistant',
    content: 'สวัสดีครับ ผมคือผู้ช่วยอัจฉริยะสำหรับการดูแลสุขภาพกระเพาะปัสสาวะ วันนี้มีอาการอะไรที่กังวลเป็นพิเศษไหมครับ?',
    created_at: '2024-02-18T10:00:00Z'
  },
  {
    id: 'm-901',
    session_id: 's-882',
    role: 'system',
    content: 'System Ready. Gemini 2.5 Flash Connected. Waiting for clinical input...',
    created_at: '2024-02-18T08:00:00Z'
  }
];

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-[#f3e8d8] text-[#023222] font-sans flex flex-col relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#023222]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#023222]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#023222] p-2 rounded-lg text-[#f3e8d8]">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">BladderCare AI</span>
        </div>
        <div className="text-sm font-medium opacity-60 hidden md:block">
          AI-Powered Bladder Cancer Support System
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 py-12">
        <div className="text-center max-w-3xl mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Advanced Care <br />
            <span className="text-[#023222]/70">Simplified by Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-[#023222]/60 max-w-2xl mx-auto">
            แพลตฟอร์มผู้ช่วยอัจฉริยะสำหรับการดูแลและวินิจฉัยโรคมะเร็งกระเพาะปัสสาวะ
            เชื่อมต่อผู้ป่วยและบุคลากรทางการแพทย์ด้วยเทคโนโลยี AI
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/* Patient Card */}
          <button 
            onClick={() => onSelectRole('patient')}
            className="group relative bg-white hover:bg-[#fffdf9] p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#023222]/5 flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f3e8d8] flex items-center justify-center text-[#023222] group-hover:scale-110 transition-transform">
              <HeartPulse size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">สำหรับผู้ป่วย</h2>
              <p className="text-[#023222]/60">
                ปรึกษาอาการเบื้องต้น บันทึกข้อมูลสุขภาพ และรับคำแนะนำที่เข้าใจง่ายจาก AI
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-sm font-bold text-[#023222] group-hover:gap-2 transition-all">
              เข้าสู่ระบบ <ArrowRight size={16} />
            </div>
          </button>

          {/* Doctor Card */}
          <button 
            onClick={() => onSelectRole('doctor')}
            className="group relative bg-[#023222] text-[#f3e8d8] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#f3e8d8]/10 flex items-center justify-center text-[#f3e8d8] group-hover:scale-110 transition-transform border border-[#f3e8d8]/20">
              <Stethoscope size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">สำหรับบุคลากรทางการแพทย์</h2>
              <p className="text-[#f3e8d8]/60">
                ระบบสนับสนุนการวินิจฉัย (CDS), วิเคราะห์ผล Lab/DICOM และจัดการเคสผู้ป่วย
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-sm font-bold text-[#f3e8d8] group-hover:gap-2 transition-all">
              Login to Dashboard <ArrowRight size={16} />
            </div>
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#023222]/40 z-10">
        © 2024 BladderCare AI Project. HIPAA Compliant.
      </footer>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const MainApp = ({ user, onLogout }) => {
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState('c-101');
  const [isTyping, setIsTyping] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const scrollRef = useRef(null);
  const mode = user.role;
  const currentSessionId = mode === 'patient' ? 's-881' : 's-882';
  
  const visibleMessages = useMemo(() => {
    return chatMessages.filter(m => m.session_id === currentSessionId);
  }, [chatMessages, currentSessionId]);

  const activeCase = PATIENT_CASES.find(c => c.id === selectedCaseId);
  const activeDiagnosis = DIAGNOSIS_RESULTS.find(r => r.case_id === selectedCaseId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const handleTTS = async (text) => {
    console.log("Playing audio for:", text);
    alert(`🔊 Gemini TTS Playing: "${text.substring(0, 30)}..."`);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = {
      id: `m-${Date.now()}`,
      session_id: currentSessionId,
      role: 'user',
      content: inputValue,
      created_at: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const systemPrompt = mode === 'patient' 
      ? "You are a specialized medical assistant for Bladder Cancer patients. Respond in Thai. Be empathetic, reassuring, and explain medical terms simply. If the user mentions symptoms like blood in urine, advise seeing a doctor immediately but stay calm. Do not provide a definitive diagnosis."
      : "You are an expert Urologist assistant AI. Respond in English (or Thai if asked). Provide concise clinical differentials, suggest next steps based on NCCN guidelines for Bladder Cancer. Use professional medical terminology.";

    const botResponseText = await callGemini(inputValue, systemPrompt);

    const botMsg = {
      id: `m-${Date.now() + 1}`,
      session_id: currentSessionId,
      role: 'assistant',
      content: botResponseText,
      created_at: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleGenerateReport = async () => {
    if (!activeCase || !activeDiagnosis) return;
    setReportLoading(true);

    const prompt = `
      Generate a formal medical report summary for:
      Patient Name: ${activeCase.patient_name}
      Age/Sex: ${activeCase.age_years}/${activeCase.sex}
      Symptoms: ${activeCase.note}
      AI Diagnosis Stage: ${activeDiagnosis.stage} (Confidence: ${(activeDiagnosis.confidence * 100).toFixed(0)}%)
      Differentials: ${JSON.stringify(activeDiagnosis.result_json.differentials)}
      
      Format: Professional, concise, bullet points. Include "Recommended Action Plan".
    `;

    const report = await callGemini(prompt, "You are a medical documentation specialist.");
    setGeneratedReport(report);
    setReportLoading(false);
  };

  // Theme Config
  const theme = {
    patient: {
      bg: 'bg-[#f3e8d8]',
      sidebarBg: 'bg-[#fcfaf7]',
      sidebarText: 'text-[#023222]/80',
      activeItem: 'bg-[#023222]/10 text-[#023222]',
      mainBg: 'bg-[#f3e8d8]',
      headerBg: 'bg-[#fcfaf7]',
      headerText: 'text-[#023222]',
      inputBg: 'bg-[#fcfaf7]',
      placeholder: 'text-[#023222]/40',
      accent: 'text-[#023222]',
      button: 'bg-[#023222] hover:bg-[#034430] text-[#f3e8d8]',
      border: 'border-[#023222]/10',
    },
    doctor: {
      bg: 'bg-[#023222]',
      sidebarBg: 'bg-[#012217]',
      sidebarText: 'text-[#f3e8d8]/60',
      activeItem: 'bg-[#f3e8d8]/10 text-[#f3e8d8] border-r-2 border-[#f3e8d8]',
      mainBg: 'bg-[#023222]',
      headerBg: 'bg-[#023222]',
      headerText: 'text-[#f3e8d8]',
      inputBg: 'bg-[#012217]',
      placeholder: 'text-[#f3e8d8]/30',
      accent: 'text-[#f3e8d8]',
      button: 'bg-[#f3e8d8] hover:bg-white text-[#023222]',
      border: 'border-[#f3e8d8]/20',
    }
  };
  const currentTheme = theme[mode];

  return (
    <div className={`flex h-screen w-full overflow-hidden ${currentTheme.bg} transition-colors duration-500 font-sans`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 transition-all duration-300 ${currentTheme.sidebarBg} shadow-lg border-r ${currentTheme.border} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${mode === 'patient' ? 'bg-[#023222] text-[#f3e8d8]' : 'bg-[#f3e8d8] text-[#023222]'}`}>
            <Activity size={24} />
          </div>
          <div className={`${!isSidebarOpen && 'hidden'}`}>
            <h1 className={`font-bold text-lg ${mode === 'patient' ? 'text-[#023222]' : 'text-[#f3e8d8]'}`}>
              {mode === 'patient' ? 'BladderCare' : 'OncoAI Pro'}
            </h1>
            <p className={`text-xs opacity-60 ${mode === 'patient' ? 'text-[#023222]' : 'text-[#f3e8d8]'}`}>
              {mode === 'patient' ? 'Health Companion' : 'Clinician Dashboard'}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {mode === 'patient' ? (
            <>
              <NavItem icon={<MessageSquare size={20} />} label="Chat Session" active theme={currentTheme} />
              <NavItem icon={<FileText size={20} />} label="My Cases" theme={currentTheme} />
              <NavItem icon={<Shield size={20} />} label="Knowledge Base" theme={currentTheme} />
            </>
          ) : (
            <>
              <div className="mb-4">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider opacity-50 text-[#f3e8d8] mb-2">My Patient Cases</p>
                {PATIENT_CASES.filter(c => c.assigned_doctor_id === user.id).map(c => (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`flex flex-col gap-1 px-3 py-3 rounded-lg cursor-pointer transition-all mb-1 border border-transparent
                      ${selectedCaseId === c.id 
                        ? 'bg-[#f3e8d8]/10 border-[#f3e8d8]/20' 
                        : 'hover:bg-[#f3e8d8]/5 text-[#f3e8d8]/60'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-mono font-bold ${selectedCaseId === c.id ? 'text-[#f3e8d8]' : 'text-[#f3e8d8]/80'}`}>
                        {c.case_code}
                      </span>
                      {c.priority === 'urgent' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </div>
                    <span className="text-xs truncate opacity-70 text-[#f3e8d8]">{c.patient_name}</span>
                  </div>
                ))}
              </div>
              <NavItem icon={<Database size={20} />} label="All Records" theme={currentTheme} />
              <NavItem icon={<User size={20} />} label="User Management" theme={currentTheme} />
            </>
          )}
        </nav>
        
        {/* User Profile Mini */}
        <div className={`p-4 border-t ${currentTheme.border}`}>
           <div className={`flex items-center gap-3 p-3 rounded-xl ${mode === 'patient' ? 'bg-[#023222]/5' : 'bg-[#f3e8d8]/10'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
               ${mode === 'patient' ? 'bg-[#023222] text-[#f3e8d8]' : 'bg-[#f3e8d8] text-[#023222]'}`}>
               {user.full_name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className={`text-sm font-medium truncate ${mode === 'patient' ? 'text-[#023222]' : 'text-[#f3e8d8]'}`}>
                 {user.full_name}
               </p>
             </div>
             <button onClick={onLogout} title="Logout" className={`p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors ${mode === 'patient' ? 'text-[#023222]/40' : 'text-[#f3e8d8]/40'}`}>
               <LogOut size={16} />
             </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${currentTheme.mainBg} relative`}>
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-6 border-b ${currentTheme.border} ${currentTheme.headerBg}/90 backdrop-blur`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-black transition-colors ${currentTheme.headerText}`}>
              <Menu size={20} />
            </button>
            <h2 className={`font-semibold ${currentTheme.headerText}`}>
              {mode === 'patient' ? 'ปรึกษาปัญหาสุขภาพ' : `Dashboard: ${activeCase?.case_code}`}
            </h2>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            <div className={`max-w-3xl mx-auto rounded-xl p-3 mb-6 text-center text-xs flex items-center justify-center gap-2 
              ${mode === 'patient' 
                ? 'bg-[#023222]/10 text-[#023222]' 
                : 'bg-[#f3e8d8]/10 border border-[#f3e8d8]/20 text-[#f3e8d8]/80'}`}>
               <Sparkles size={12} />
               <span>
                 {mode === 'patient' 
                   ? `AI Health Assistant (Gemini 2.5 Flash) พร้อมให้บริการ` 
                   : `AI Clinical Support Active. Model: Gemini 2.5 Flash`}
               </span>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {visibleMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} mode={mode} onPlayAudio={handleTTS} />
              ))}
              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${mode === 'patient' ? 'bg-white border border-[#023222]/10' : 'bg-[#023222] border border-[#f3e8d8]/20'}`}>
                    <Loader2 className={`animate-spin ${mode === 'patient' ? 'text-[#023222]' : 'text-[#f3e8d8]'}`} size={16} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-4 ${mode === 'patient' ? 'bg-[#fcfaf7] border-t border-[#023222]/10' : 'bg-[#012217] border-t border-[#f3e8d8]/10'}`}>
            <div className="max-w-3xl mx-auto flex items-center gap-3">
               <button className={`p-2 rounded-full transition-colors ${mode === 'patient' ? 'text-[#023222]/40 hover:bg-[#023222]/5' : 'text-[#f3e8d8]/40 hover:bg-[#f3e8d8]/10'}`}>
                  <ImageIcon size={20} />
               </button>
               <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={mode === 'patient' ? "พิมพ์อาการของคุณ..." : "Type clinical query..."}
                  className={`flex-1 bg-transparent outline-none p-2 ${mode === 'patient' ? 'text-[#023222] placeholder-[#023222]/30' : 'text-[#f3e8d8] placeholder-[#f3e8d8]/30'}`}
               />
               <button onClick={handleSend} className={`p-2 rounded-xl shadow-sm ${currentTheme.button}`}>
                  <Send size={18} />
               </button>
            </div>
          </div>
        </main>

        {/* Doctor Panel */}
        {mode === 'doctor' && activeCase && (
          <div className="hidden xl:flex w-96 flex-col border-l border-[#f3e8d8]/10 bg-[#011c13]">
            <div className="p-4 border-b border-[#f3e8d8]/10">
               <h3 className="text-[#f3e8d8] font-semibold flex items-center gap-2">
                 <Microscope size={18} className="text-[#f3e8d8]"/> 
                 AI Diagnostic Tools
               </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              <div className="bg-[#023222] rounded-lg p-4 border border-[#f3e8d8]/10">
                <p className="text-lg font-bold text-[#f3e8d8]">{activeCase.patient_name}</p>
                <p className="text-xs text-[#f3e8d8]/50 mb-2">PID: {activeCase.id}</p>
                {!generatedReport ? (
                  <button onClick={handleGenerateReport} disabled={reportLoading} className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-[#f3e8d8]/10 hover:bg-[#f3e8d8]/20 text-[#f3e8d8] text-xs rounded border border-[#f3e8d8]/30 transition-all">
                    {reportLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {reportLoading ? "Generating Report..." : "Generate AI Summary"}
                  </button>
                ) : (
                  <div className="mt-4 p-3 bg-[#f3e8d8]/5 rounded border border-[#f3e8d8]/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#f3e8d8] uppercase">Gemini Report</span>
                      <button onClick={() => setGeneratedReport(null)} className="text-[#f3e8d8]/40 hover:text-[#f3e8d8]"><ChevronRight size={14} className="rotate-90"/></button>
                    </div>
                    <p className="text-xs text-[#f3e8d8]/80 whitespace-pre-line leading-relaxed">{generatedReport}</p>
                  </div>
                )}
              </div>
              {activeDiagnosis && (
                <div className="bg-[#023222] rounded-lg p-4 border border-[#f3e8d8]/10 space-y-3">
                  <div className="flex justify-between text-xs text-[#f3e8d8]/60">
                    <span>AI Confidence</span>
                    <span className="text-[#f3e8d8] font-bold">{(activeDiagnosis.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#f3e8d8]/10 h-1.5 rounded-full">
                    <div className="bg-[#f3e8d8] h-1.5 rounded-full" style={{ width: `${activeDiagnosis.confidence * 100}%` }}></div>
                  </div>
                  <div className="space-y-1 mt-2">
                    {activeDiagnosis.result_json.differentials.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-[#f3e8d8]/80">{d.name}</span>
                        <span className="text-[#f3e8d8]/60">{(d.prob * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP ROOT (ROUTING) ---
export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [currentUser, setCurrentUser] = useState(null);

  const handleRoleSelect = (role) => {
    const user = USERS.find(u => u.role === role);
    setCurrentUser(user);
    setView('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  if (view === 'landing') {
    return <LandingPage onSelectRole={handleRoleSelect} />;
  }

  return <MainApp user={currentUser} onLogout={handleLogout} />;
}

// --- SUB COMPONENTS ---

const ChatBubble = ({ message, mode, onPlayAudio }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isDoctor = mode === 'doctor';
  const isBot = message.role === 'assistant';

  if (isSystem && isDoctor) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs font-mono text-[#023222] bg-[#f3e8d8] px-2 py-1 rounded border border-[#023222]/20">
          &gt; {message.content}
        </span>
      </div>
    );
  }

  const userBubbleClass = isDoctor 
    ? 'bg-[#f3e8d8] text-[#023222]' 
    : 'bg-[#023222] text-[#f3e8d8]';

  const botBubbleClass = isDoctor
    ? 'bg-[#023222] border border-[#f3e8d8]/20 text-[#f3e8d8]'
    : 'bg-white border border-[#023222]/10 text-[#023222]';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm relative group
          ${isUser 
            ? `${userBubbleClass} rounded-br-none` 
            : `${botBubbleClass} rounded-bl-none`
          }
        `}>
          <p className={`text-sm whitespace-pre-line ${isDoctor ? 'font-mono' : 'font-sans'}`}>{message.content}</p>
          {isBot && (
             <button 
               onClick={() => onPlayAudio(message.content)}
               className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-200/20 text-gray-400 hover:text-cyan-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
               title="Read Aloud"
             >
               <Volume2 size={14} />
             </button>
          )}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 px-1">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

function NavItem({ icon, label, active, theme }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
      ${active ? theme.activeItem : `hover:bg-opacity-10 hover:bg-black ${theme.sidebarText}`}
    `}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </div>
  );
}