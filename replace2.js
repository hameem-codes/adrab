const fs = require('fs');
const text = fs.readFileSync('client/src/App.tsx', 'utf8');
const startMarker = 'function OverviewPhase({ record, patient, onPhase }:';
const endMarker = 'function BeforePhase({ onReview }:';
const startIdx = text.indexOf(startMarker);
const endIdx = text.indexOf(endMarker);
const newComponent =  + "" + function OverviewPhase({ record, patient, onPhase }: { record: CaseRecord; patient: Patient; onPhase: (phase: CasePhase) => void }) {
  return (
    <div className="phase-content flex flex-col gap-6 w-full max-w-full">
      <!-- Top Row: 3 columns -->
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Case Information -->
        <section className="panel flex flex-col">
          <PanelHeading title="Case Information" action= {<button className="button button-quiet button-small" style={{height: '28px', padding: '0 8px'}}><Pencil size={14} className="mr-1" /> Edit</button>} />
          <div className="flex flex-col gap-3 mt-4 flex-1">
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Case ID</span><span className="font-medium text-slate-800">MF-2024-001</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Patient</span><span className="font-medium text-blue-600 hover:underline cursor-pointer">Aman Verma (PT-2024-001)</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Age / Sex</span><span className="font-medium text-slate-800">28 / Male</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Procedure</span><span className="font-medium text-slate-800">Mandibular Fracture (ORIF)</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Surgery Date</span><span className="font-medium text-slate-800">10 Jul 2024</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Surgeon</span><span className="font-medium text-slate-800">Dr. Rahul Mehta</span></div>
            <div className="flex justify-between text-[13px] items-center"><span className="text-slate-500">Status</span><span className="bg-[#e0f2f1] text-[#00695c] text-[11px] p-[4px] px-2 py-0.5 rounded-full font-medium">Evaluation</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Last Updated</span><span className="font-medium text-slate-800">2 hours ago</span></div>
          </div>
        </section>

        <!-- Timeline -->
        <section className="panel flex flex-col">
          <PanelHeading title="Timeline" />
          <div className="relative pl-5 mt-4 flex-1 pt-1">
            <div className="absolute left-[7px] top-3 bottom-5 w-[2px] bg-slate-200"></div>
            {[
              { label: "Case Created", time: "08 Jul 2024, 10:12 AM", active: true },
           { label: "Pre-op Scans", time: "09 Jul 2024, 04:30 PM", active: true },
              { label: "Surgery", time: "10 Jul 2024, 09:00 AM", active: true },
              { label: "Post-op Scans", time: "12 Jul 2024, 02:15 PM", active: true },
              { label: "AI Evaluation", time: "12 Jul 2024, 04:20 PM", active: true },
              { label: "Review", badge: "Pending", active: false, pending: true },
            ].map((step, i) => (
              <div key={i} className="mb-[18px] last:mb-0 relative">
                <div className={`absolute -left-[25px] top-1 h-[14px] w-[14px] rounded-full border-2 bg-white flex items-center justify-center ${step.active ? "border-blue-500" : step.pending ? "border-amber-400" : "border-slate-300"}`}>
                  {step.active && <div className="h-[6px] w-[6px] bg-blue-500 rounded-full" />}
                </div>
                <div className="flex justify-between items-start text-[13px] ml-1">
                  <span className={`font-medium ${!step.active && !step.pending ? "text-slate-400" : "text-slate-800"}`}>{step.label}</span>
                  {step.time && <span className="text-slate-500 text-[12px]">{step.time}</span>}
                  {step.badge && <span className="bg-[#fff8e1] text-[#f57f17] text-[11px] px-2 py-0.5 rounded-full font-medium">{step.badge}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <!-- Procedure Details -->
        <section className="panel flex flex-col">
          <PanelHeading title="Procedure Details" action={<button className="button button-quiet button-small" style={{height: '28px', padding: '0 8px'}}><Pencil size={14} className="mr-1" /> Edit</button>} />
          <div className="flex flex-col gap-3 mt-4 flex-1">
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Procedure Type</span><span className="font-medium text-slate-800">Mandibular Fracture</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Surgical Approach</span><span className="font-medium text-slate-800">ORIF</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Fixation</span><span className="font-medium text-slate-800">Titanium Plates & Screws</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Anesthesia</span><span className="font-medium text-slate-800">General</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Duration</span><span className="font-medium text-slate-800">3 hours 20 mins</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Intra-op Notes</span><span className="font-medium text-slate-800">No complications</span></div>
            <div className="flex justify-between text-[13px] items-center"><span className="text-slate-500">Plan Followed</span><span className="bg-[#e0f2f1] text-[#00695c] text-[11px] px-2 py-0.5 rounded-full font-medium">Yes</span></div>
          </div>
        </section>
      </div>

      <!-- Key Images -->
      <section className="panel flex flex-col p-0 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-[16px] font-semibold text-slate-900 m-0">Key Images</h2>
          <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700 flex items-center">View in Viewer <ArrowRight size={14} className="ml-1" /></button>
        </div>
        <div className="flex flex-col">
          <!-- Tabs -->
          <div className="flex border-b border-slate-100 px-4 gap-6 text-[13px] font-medium">
            <button className="py-3 border-b-2 border-blue-600 text-blue-600">Pre-op CT</button>
            <button className="py-3 text-slate-500 hover:text-slate-800">Post-op CT</button>
            <button className="py-3 text-slate-500 hover:text-slate-800">3D Reconstruction</button>
            <button className="py-3 text-slate-500 hover:text-slate-800">Segmentation</button>
            <button className="py-3 text-slate-500 hover:text-slate-800">Side-by-side</button>
          </div>
          <!-- Image Area -->
          <div className="flex bg-[#000] p-4 gap-4 h-[380px]">
             <!-- Axial View -->
             <div className="flex-1 relative border border-slate-800/60 rounded-md bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><ZoomIn size={14}/></button>
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><Hand size={14}/></button>
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><ArrowDownUp size={14}/></button>
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><Sun size={14}/></button>
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><Layers size={14}/></button>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                   <button className="p-1.5 bg-black/60 text-white/80 rounded hover:bg-black hover:text-white"><Box size={14}/></button>
                </div>
                <div className="absolute bottom-2 left-2 text-white/70 text-[11px] font-medium">Axial</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 text-[11px]">L</div>
                <div className="absolute bottom-2 right-4 text-white/50 text-[11px]">R</div>
                <!-- Image Placeholder -->
                <div className="w-full h-full flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=400&h=400" className="opacity-60 object-cover w-full h-full max-w-[280px] max-h-[280px] mix-blend-screen" style={{filter: 'grayscale(1)'}} alt="Axial CT" />
                </div>
             </div>
             <!-- 3D Recon View -->
             <div className="flex-[1.4] relative border border-slate-800/60 rounded-md bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                   <button className="p-1.5 bg-black/60+ext-white/80 rounded hover:bg-black hover:text-white"><Box size={14}/></button>
                </div>
                <div className="absolute bottom-2 left-2 text-white/70 text-[11px] font-medium">3D Reconstruction</div>
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800&h=600" className="opacity-90 object-cover w-full h-full mix-blend-screen" style={{filter: 'hue-rotate(190deg) saturate(1.5)'}} alt="3D Skull" />
                </div>
             </div>
             <!-- Right sidebar with small views -->
             <div className="w-[110px] flex flex-col gap-2">
                <div className="flex-1 relative border border-slate-800/60 rounded-md bg-[#0a0a0a] overflow-hidden">
                  <div className="absolute bottom-1 left-2 text-white/70 text-[10px]">Coronal</div>
                  <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=150&h=150" className="opacity-50 object-cover w-full h-full max-w-[80px]" style={{filter: 'grayscale(1)'}} alt="Coronal CT" /></div>
                </div>
                <div className="flex-1 relative border border-slate-800/60 rounded-md bg-[#0a0a0a] overflow-hidden">
                  <div className="absolute bottom-1 left-2 text-white/70 text-[10px]">Sagittal</div>
                  <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=150&h=150" className="opacity-50 object-cover w-full h-full max-w-[80px]" style={{filter: 'grayscale(1)'}} alt="Sagittal CT" /></div>
                </div>
                <div className="h-[60px] flex gap-1">
                   <div className="flex-1 border-2 border-blue-500 rounded bg-[#0a0a0a] overflow-hidden relative cursor-pointer">
                     <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=50&h=50" className="opacity-70 object-cover mix-blend-screen" style={{filter: 'hue-rotate(190deg)'}} alt="3D thumbnail" /></div>
                     <div className="absolute bottom-0 w-full text-center text-blue-400 text-[9px] pb-[1px] bg-black/60 font-medium">3D</div>
                   </div>
                   <div className="flex-1 border border-slate-800/60 rounded bg-[#0a0a0a] overflow-hidden relative cursor-pointer opacity-70 hover:opacity-100">
                     <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=50&h=50" className="opacity-50 object-cover" style={{filter: 'grayscale(1)'}} alt="Axial thumbnail" /></div>
                     <div className="absolute bottom-0 w-full text-center text-white/70 text-[9px] pb-[1px] bg-black/60">Axial</div>
                   </div>
                   <div className="flex-1 border border-slate-800/60 rounded bg-[#0a0a0a] overflow-hidden relative cursor-pointer opacity-70 hover:opacity-100">
                     <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=50&h=50" className="opacity-50 object-cover" style={{filter: 'grayscale(1)'}} alt="Coronal thumbnail" /></div>
                     <div className="absolute bottom-0 w-full text-center text-white/70 text-[9px] pb-[1px] bg-black/60">Coronal</div>
                   </div>
                   <div className="flex-1 border border-slate-800/60 rounded bg-[#0a0a0a] overflow-hidden relative cursor-pointer opacity-70 hover:opacity-100">
                     <div className="w-full h-full flex items-center justify-center"><img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=50&h=50" className="opacity-50 object-cover" style={{filter: 'grayscale(1)'}} alt="Sagittal thumbnail" /></div>
                     <div className="absolute bottom-0 w-full text-center text-white/70 text-[9px] pb-[1px] bg-black/60">Sagittal</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section className="flex flex-col mb-4">
        <h2 className="text-[16px] font-semibold text-slate-900 m-0 mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <div className="bg-slate-50 p-2 rounded-lg {roup-hover:bg-slate-100} transition-colors border border-slate-100"><CloudUpload size={18} className="text-slate-600"/></div>
            <div>
              <div className="font-semibold text-[13px] text-slate-800 leading-tight">Upload Imaging</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Add DICOM or images</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <div className="bg-slate-50 p-2 rounded-lg {group-hover:bg-slate-100} transition-colors border border-slate-100"><FileText size={18} className="text-slate-600"/></div>
            <div>
              <div className="font-semibold text-[13px] text-slate-800 leading-tight">Add Note</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Add case note</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <div className="bg-slate-50 p-2 rounded-lg {wroup-hover:bg-slate-100} transition-colors border border-slate-100"><Play size={18} className="text-slate-600"/></div>
            <div>
              <div className="font-semibold text-[13px] text-slate-800 leading-tight">Run Evaluation</div>
              <div className="text-[11px] text-slate-500 mt-0.5">AI evaluation</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <div className="bg-slate-50 p-2 rounded-lg {group-hover:bg-slate-100} transition-colors border border-slate-100"><FileBarChart2 size={18} className="text-slate-600"/></div>
            <div className="font-semibold text-[13px] text-slate-800 leading-tight">Generate Report</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Create case report</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <div className="bg-slate-50 p-2 rounded-lg {wroup-hover:bg-slate-100} transition-colors border border-slate-100"><UsersRound size={18} className="text-slate-600"/></div>
            <div>
              <div className="font-semibold text-[13px] text-slate-800 leading-tight">Send for Review</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Request surgeon review</div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
} + "" + ;
const newText = text.substring(0, startIdx) + newComponent + text.substring(endIdx);
fs.writeFileSync('client/src/App.tsx', newText, 'utf8');
console.log('Replaced');
