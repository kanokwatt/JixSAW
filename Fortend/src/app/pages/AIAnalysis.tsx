import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

// หน้า AIAnalysis เป็นตัวอย่าง flow อัปโหลดภาพ cystoscopy และรับผลวิเคราะห์แบบ mock
export function AIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMask, setShowMask] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock cystoscopy image
  const mockImageUrl = 'https://images.unsplash.com/photo-1766310550061-7cd0900f7c76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY3lzdG9zY29weSUyMGVuZG9zY29weSUyMGJsYWRkZXJ8ZW58MXx8fHwxNzcyMDQwMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080';

  // รับไฟล์จาก input แล้วเริ่มกระบวนการวิเคราะห์จำลอง
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

  // รองรับ drag and drop image ลงในพื้นที่อัปโหลด
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

  // จำลอง progress ของ AI analysis จนเสร็จสมบูรณ์
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

  // ปุ่ม approve ใช้แทนการบันทึกผลวินิจฉัยในระบบจริง
  const handleApprove = () => {
    alert('Diagnosis approved! This would be saved to the system.');
  };

  // ปุ่ม reject ใช้แทนการส่งต่อเพื่อ manual review
  const handleReject = () => {
    alert('Diagnosis rejected. Manual review required.');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">AI Analysis</h1>
        <p className="text-muted-foreground text-base font-medium">
          Upload cystoscopy images for AI-assisted diagnosis
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
              <h3 className="text-2xl font-bold mb-3">Upload Cystoscopy Image</h3>
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
                    <span className="text-sm font-bold">Confidence Score</span>
                    <span className="text-2xl font-bold text-primary">87%</span>
                  </div>
                  <div className="bg-muted rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: '87%' }} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl p-5">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-900 mb-2 text-base">Findings Detected</h4>
                      <ul className="text-sm text-orange-800 space-y-1.5 font-medium">
                        <li>• Suspicious lesion detected at 3 o'clock position</li>
                        <li>• Irregular vascular pattern observed</li>
                        <li>• Recommend biopsy for histological confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-accent/50 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="show-mask"
                    checked={showMask}
                    onChange={(e) => setShowMask(e.target.checked)}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <label htmlFor="show-mask" className="text-sm cursor-pointer font-semibold">
                    Show AI Detection Overlay
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 font-bold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Diagnosis
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:shadow-lg hover:shadow-gray-900/40 transition-all duration-200 font-bold"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject / Edit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Image Preview Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden">
            <div className="p-6 border-b-2 border-border bg-gradient-to-r from-accent/50 to-transparent">
              <h3 className="text-xl font-bold">Image Preview</h3>
            </div>
            <div className="p-6">
              {selectedImage || analysisComplete ? (
                <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={selectedImage || mockImageUrl}
                    alt="Cystoscopy"
                    className="w-full h-full object-cover"
                  />
                  {analysisComplete && showMask && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      {/* AI Detection Mask Overlay */}
                      <svg className="w-full h-full" viewBox="0 0 400 400">
                        <circle
                          cx="280"
                          cy="180"
                          r="40"
                          fill="none"
                          stroke="#1DCD9F"
                          strokeWidth="4"
                          className="animate-pulse"
                        />
                        <circle
                          cx="280"
                          cy="180"
                          r="40"
                          fill="#1DCD9F"
                          fillOpacity="0.3"
                        />
                        <text
                          x="280"
                          y="240"
                          textAnchor="middle"
                          fill="#1DCD9F"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          Lesion Detected
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

          {/* Quick Info */}
          {analysisComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6"
            >
              <h4 className="font-bold text-blue-900 mb-3 text-base">
                Human-in-the-Loop Verification
              </h4>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                AI provides diagnostic assistance, but final decision and approval must be made by the physician. 
                Please review the findings carefully before approving.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}