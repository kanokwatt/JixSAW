import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2, AlertCircle, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';

export function MRIUpload() {
  const { user } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [doctorFeedback, setDoctorFeedback] = useState('');
  const [doctorOpinion, setDoctorOpinion] = useState<'agree' | 'disagree' | null>(null);

  // Mock MRI image
  const mockImageUrl = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtcmklMjBzY2FuJTIwYmxhZGRlcnxlbnwxfHx8fDE3NDA0ODA4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080';

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
    alert(`ความเห็นของแพทย์ถูกบันทึก:\n${doctorOpinion === 'agree' ? 'เห็นด้วยกับ AI' : 'ไม่เห็นด้วยกับ AI'}\n\nหมายเหตุ: ${doctorFeedback || 'ไม่มี'}`);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          MRI Assessment
        </h1>
        <p className="text-muted-foreground text-base font-medium">
          อัปโหลด MRI เพื่อการประเมินมะเร็งกระเพาะปัสสาวะเบื้องต้น
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
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
                    <li>• Possible infiltration into muscle layer</li>
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
                        onClick={() => setDoctorOpinion('agree')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-bold ${
                          doctorOpinion === 'agree'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-lg'
                            : 'bg-card border-border hover:border-emerald-300'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        เห็นด้วย
                      </button>
                      <button
                        onClick={() => setDoctorOpinion('disagree')}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-bold ${
                          doctorOpinion === 'disagree'
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
        </div>

        {/* Image Preview Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
            <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
              <h3 className="text-xl font-bold">MRI Image Preview</h3>
            </div>
            <div className="p-6">
              {selectedImage || analysisComplete ? (
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
                          Area of Concern
                        </text>
                      </svg>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-accent/30 to-accent/70 rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center">
                    <Upload className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-semibold">No image uploaded</p>
                  </div>
                </div>
              )}
            </div>
          </div>

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
      </div>
    </div>
  );
}
