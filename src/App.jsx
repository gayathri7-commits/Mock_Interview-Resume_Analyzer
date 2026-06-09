import React, { useState } from 'react';
import { Sparkles, Terminal, FileText, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import ResumeUpload from './components/ResumeUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import InterviewPanel from './components/InterviewPanel';
import PerformanceAnalytics from './components/PerformanceAnalytics';

export default function App() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Feedback, 3: Interview, 4: Analytics
  const [analysisData, setAnalysisData] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);

  // Workflow Handlers
  const handleUploadSuccess = (data) => {
    setAnalysisData(data);
    setStep(2);
  };

  const handleStartInterview = () => {
    setStep(3);
  };

  const handleInterviewComplete = (gradeData) => {
    setEvaluationData(gradeData);
    setStep(4);
  };

  const handleRestart = () => {
    setStep(1);
    setAnalysisData(null);
    setEvaluationData(null);
  };

  const stepsTimeline = [
    { num: 1, label: 'Resume Parse', desc: 'Job role & upload' },
    { num: 2, label: 'ATS Scorecard', desc: 'Keyword & gap analysis' },
    { num: 3, label: 'Mock Session', desc: 'AI interactive interview' },
    { num: 4, label: 'AI Report Card', desc: 'Analytics & feedback' }
  ];

  return (
    <div className="bg-grid-pattern min-h-screen text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-accent/5 blur-[150px] pointer-events-none animate-pulse-slow"></div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleRestart}>
            <div className="bg-gradient-to-r from-primary to-accent p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1.5 leading-none">
                TalentGrad 
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">Mock Interview & Resume Analyzer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-semibold text-slate-400 font-mono">SIMULATION LIVE</span>
          </div>
        </div>
      </header>

      {/* Step Progress Timeline Header */}
      <section className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 mt-8">
        <div className="glass-card rounded-2xl p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2">
          {stepsTimeline.map((s) => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            
            return (
              <div 
                key={s.num} 
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-sm font-bold border transition ${
                  isCompleted 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                    : isActive 
                    ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10'
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <div>
                  <span className={`block text-xs font-bold font-display ${isActive ? 'text-primary' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        {step === 1 && (
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {step === 2 && analysisData && (
          <AnalysisDashboard 
            analysisData={analysisData} 
            onProceed={handleStartInterview} 
            onBack={handleRestart}
          />
        )}

        {step === 3 && analysisData && (
          <InterviewPanel 
            jobRole={analysisData.jobRole} 
            onInterviewComplete={handleInterviewComplete}
            onBackToDashboard={() => setStep(2)}
          />
        )}

        {step === 4 && evaluationData && (
          <PerformanceAnalytics 
            evaluationData={evaluationData} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950/10 py-6 text-center text-xs text-slate-600 font-mono mt-8">
        <p>&copy; 2026 TalentGrad AI. Connected via Spring Boot REST Client API Interface.</p>
      </footer>
    </div>
  );
}
