"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<{ tStage?: string; maskSrc?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (dropped.length) setFiles(prev => [...prev, ...dropped]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files ? Array.from(e.target.files) : [];
    setFiles(prev => [...prev, ...chosen]);
  };

  const startAnalysis = async () => {
    if (!files.length) return;
    setProcessing(true);
    // Mock processing delay
    await new Promise(res => setTimeout(res, 1500));
    // Mock AI result
    setAiResult({ tStage: 'T2', maskSrc: '/ai-mask-sample.png' });
    setProcessing(false);
  };

  const clearFiles = () => setFiles([]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Stats */}
      <section className="col-span-3 lg:col-span-1 bg-card rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending cases</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Analyzed today</p>
              <p className="text-2xl font-bold">34</p>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => inputRef.current?.click()} className="w-full py-2 bg-primary-custom rounded-lg font-semibold">Upload MRI</button>
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFileChange} className="hidden" />
            <button onClick={clearFiles} className="mt-3 w-full py-2 border border-border rounded-lg text-sm flex items-center justify-center gap-2">Clear</button>
          </div>
        </div>
      </section>

      {/* Middle: Upload / Work area */}
      <section
        className="col-span-3 lg:col-span-1 bg-card rounded-2xl p-6 shadow-2xl"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <h3 className="text-lg font-semibold mb-4">Drag & Drop Upload</h3>
        <div className="min-h-[420px] border-2 border-border rounded-xl flex flex-col items-center justify-center p-6">
          {files.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Drag MRI or cystoscopy images here</p>
              <button onClick={() => inputRef.current?.click()} className="py-2 px-4 bg-primary-custom rounded-md text-white font-semibold">Choose files</button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{files.length} file(s) selected</p>
                <button onClick={clearFiles} className="text-sm text-destructive flex items-center gap-2"><Trash2 className="w-4 h-4"/> Remove all</button>
              </div>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {files.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 border border-border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-sm">Img</div>
                      <div>
                        <div className="font-medium text-sm">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{Math.round(f.size/1024)} KB</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{f.type}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-3">
                <button onClick={startAnalysis} disabled={processing} className="flex-1 py-2 bg-primary-custom rounded-lg text-white font-semibold">{processing ? 'Processing...' : 'Run AI Analysis'}</button>
                <button onClick={() => setAiResult(null)} className="py-2 px-4 border border-border rounded-lg">Reset</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Right: AI Analysis panel */}
      <section className="col-span-3 lg:col-span-1 bg-card rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
        <div className="min-h-[520px] border border-border rounded-xl relative overflow-hidden">
          {aiResult ? (
            <div className="w-full h-full relative">
              <img src="/sample-cystoscopy.jpg" alt="cystoscopy" className="w-full h-full object-contain" />
              {/* Mock AI mask overlay */}
              <img src={aiResult.maskSrc} alt="mask" className="absolute inset-0 w-full h-full object-contain mix-blend-multiply pointer-events-none" />

              <div className="absolute bottom-6 left-6 flex gap-3">
                <button className="py-2 px-4 bg-primary-custom rounded-lg text-white font-semibold">Approve</button>
                <button className="py-2 px-4 bg-black text-white rounded-lg">Reject / Edit</button>
              </div>

              <div className="absolute top-6 right-6 bg-white/90 text-sm rounded-lg p-2 shadow">T-stage: <strong>{aiResult.tStage}</strong></div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p className="mb-4">No analysis yet. Upload images and run AI to see results here.</p>
              <p className="text-sm">When AI runs, a mask overlay and suggested T-stage will appear.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
