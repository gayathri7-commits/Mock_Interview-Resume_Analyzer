import React, { useState, useEffect, useRef } from 'react';
import { Code, UserCheck, Play, Mic, MicOff, AlertCircle, ArrowLeft, ArrowRight, Check, Send, Award, Clock } from 'lucide-react';
import { resumeApi } from '../services/api';

export default function InterviewPanel({ jobRole, onInterviewComplete, onBackToDashboard }) {
  const [selectedRound, setSelectedRound] = useState(null); // 'tech' or 'hr'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // [{ questionId, answer, language }]
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins default
  const [timerActive, setTimerActive] = useState(false);
  
  // Coding states
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // HR states
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Submission States
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingEvaluation, setSubmittingEvaluation] = useState(false);
  const [evalStep, setEvalStep] = useState(0);
  const [error, setError] = useState(null);
  const recordInterval = useRef(null);

  const evaluationMessages = [
    "Compiling and running coding submissions against test suites...",
    "Analyzing computational complexity (Big O) and memory overhead...",
    "Evaluating semantic structure and confidence cues in HR responses...",
    "Cross-referencing behavioral answers with leadership principles...",
    "Generating report card metrics and performance trends..."
  ];

  // Fetch questions once a round is selected
  const startRound = async (round) => {
    setSelectedRound(round);
    setLoadingQuestions(true);
    setError(null);
    try {
      const response = await resumeApi.getInterviewQuestions(jobRole);
      if (response.success) {
        const roundQuestions = round === 'tech' ? response.data.technical : response.data.hr;
        setQuestions(roundQuestions || []);
        setCurrentIdx(0);
        
        // Initialize user answers state
        const initialAnswers = (roundQuestions || []).map(q => ({
          questionId: q.id,
          answer: '',
          language: round === 'tech' ? 'javascript' : 'text'
        }));
        setUserAnswers(initialAnswers);

        // Setup timer
        const limit = round === 'tech' && roundQuestions[0]?.timeLimit 
          ? roundQuestions[0].timeLimit 
          : 600; // 10 mins for HR
        setTimeLeft(limit);
        setTimerActive(true);

        // Load editor template if tech
        if (round === 'tech' && roundQuestions[0]) {
          const starter = roundQuestions[0].starterCode || {};
          setEditorCode(starter.javascript || starter.text || '');
        }
      }
    } catch (err) {
      setError("Failed to fetch interview questions. Please try again.");
      console.error(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleTimeExpired();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Sync editor starter code when switching questions (Tech Round)
  const syncStarterCode = (qIdx, lang) => {
    if (selectedRound !== 'tech' || !questions[qIdx]) return;
    const starter = questions[qIdx].starterCode || {};
    // Check if user has already entered an answer for this question
    const existingAnswer = userAnswers[qIdx]?.answer;
    if (existingAnswer) {
      setEditorCode(existingAnswer);
    } else {
      setEditorCode(starter[lang] || Object.values(starter)[0] || '');
    }
  };

  // Sync text responses when switching questions (HR Round)
  useEffect(() => {
    if (selectedRound === 'hr' && questions[currentIdx]) {
      setTextAnswer(userAnswers[currentIdx]?.answer || '');
    }
  }, [currentIdx, selectedRound, questions]);

  // Monitor language change
  useEffect(() => {
    syncStarterCode(currentIdx, selectedLang);
  }, [selectedLang]);

  // Handle timer reaching 0
  const handleTimeExpired = () => {
    alert("Time limit reached for this question! Your response has been locked.");
    handleNext();
  };

  // Format timer output
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Run code simulation (Tech Round)
  const runCode = () => {
    setIsRunningCode(true);
    setConsoleOutput("Running code in sandbox execution environment...\n");
    
    setTimeout(() => {
      // Simulate test case result based on simple sanity checks
      if (editorCode.includes("return") || editorCode.includes("def ") || editorCode.includes("public ")) {
        setConsoleOutput(prev => prev + "⚡ Execution success!\n✅ Test Case 1/2: Passed\n✅ Test Case 2/2: Passed\n\nOutput details:\n[2, 3] in 1.2ms (Complexity: O(N) Time, O(N) Space)");
      } else {
        setConsoleOutput(prev => prev + "❌ Compilation Error: Expected return value or matching syntax. Check your solution logic.");
      }
      setIsRunningCode(false);
    }, 1200);
  };

  // Speech Transcription Simulation (HR Round)
  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(recordInterval.current);
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setError(null);
      
      const transcriptionPhrases = [
        "In my past project, I noticed we were getting significant overhead...",
        " so I conducted a detailed audit using Chrome DevTools profiling...",
        " which led us to batching state updates and implementing virtual lists.",
        " This reduced the overall re-render cycle time by approximately 45 percent,",
        " vastly improving customer metrics and time-to-interact."
      ];
      
      let phraseIdx = 0;
      
      // Gradually write phrases to simulate live typing transcription
      recordInterval.current = setInterval(() => {
        if (phraseIdx < transcriptionPhrases.length) {
          setTextAnswer(prev => prev + transcriptionPhrases[phraseIdx]);
          phraseIdx++;
        } else {
          clearInterval(recordInterval.current);
          setIsRecording(false);
        }
      }, 1500);
    }
  };

  // Clean up recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordInterval.current) clearInterval(recordInterval.current);
    };
  }, []);

  const saveCurrentAnswer = () => {
    const updatedAnswers = [...userAnswers];
    if (selectedRound === 'tech') {
      updatedAnswers[currentIdx] = {
        questionId: questions[currentIdx].id,
        answer: editorCode,
        language: selectedLang
      };
    } else {
      updatedAnswers[currentIdx] = {
        questionId: questions[currentIdx].id,
        answer: textAnswer,
        language: 'text'
      };
    }
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    saveCurrentAnswer();
    
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      
      // Update timer for next question
      const nextLimit = selectedRound === 'tech' && questions[nextIdx]?.timeLimit 
        ? questions[nextIdx].timeLimit 
        : 600;
      setTimeLeft(nextLimit);
      setTimerActive(true);
      
      // If tech, sync coding layouts
      if (selectedRound === 'tech') {
        syncStarterCode(nextIdx, selectedLang);
        setConsoleOutput('');
      }
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      
      // If tech, sync code
      if (selectedRound === 'tech') {
        syncStarterCode(prevIdx, selectedLang);
        setConsoleOutput('');
      }
    }
  };

  const finishAssessment = async () => {
    saveCurrentAnswer();
    setTimerActive(false);
    setSubmittingEvaluation(true);

    // Run simulated evaluation ticker
    const stepInterval = setInterval(() => {
      setEvalStep(prev => {
        if (prev < evaluationMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    try {
      const payload = {
        jobRole: jobRole,
        roundType: selectedRound,
        answers: userAnswers
      };
      
      const response = await resumeApi.submitInterviewAnswers(payload);
      clearInterval(stepInterval);
      
      if (response.success) {
        onInterviewComplete(response.data);
      } else {
        setError("AI grading endpoint timed out. Please try again.");
        setTimerActive(true);
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError("Failed to grade assessment. Check client-server connections.");
      setTimerActive(true);
      console.error(err);
    } finally {
      setSubmittingEvaluation(false);
      setEvalStep(0);
    }
  };

  // 1. Loading active questions state
  if (loadingQuestions) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold font-display text-white mb-2">Generating Interview Questions</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Generating custom interview tasks specialized for a {jobRole} position...
        </p>
      </div>
    );
  }

  // 2. Loading active grading evaluation state
  if (submittingEvaluation) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-accent border-l-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Award className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold font-display text-white mb-2">Evaluating Responses</h3>
        <p className="text-slate-400 text-sm max-w-md animate-pulse">
          {evaluationMessages[evalStep]}
        </p>

        {/* Shimmer loading bar */}
        <div className="w-full max-w-md bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 shimmer-progress"
            style={{ width: `${((evalStep + 1) / evaluationMessages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // 3. Selection Screen (HR or Tech)
  if (!selectedRound) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black font-display text-white">Select Interview Format</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Choose your assessment style. You can test your core coding and data structures or practice conversational HR questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tech Card */}
          <div
            onClick={() => startRound('tech')}
            className="glass-card glass-card-hover rounded-2xl p-8 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Code className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2">Technical / Coding Round</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Solve coding algorithms, logical puzzles, or architecture designs. Features a live coding terminal, language compiler simulation, and active constraints.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-primary font-bold text-sm mt-8 border-t border-white/5 pt-4">
              Launch Coding Terminal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* HR Card */}
          <div
            onClick={() => startRound('hr')}
            className="glass-card glass-card-hover rounded-2xl p-8 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2">HR & Behavioral Round</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Practice questions on situational leadership, conflict management, and projects. Type your response or use voice input simulation for transcription.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-accent font-bold text-sm mt-8 border-t border-white/5 pt-4">
              Begin Behavioral Session <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onBackToDashboard}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back to Resume Match Details
          </button>
        </div>
      </div>
    );
  }

  // Current Question
  const activeQuestion = questions[currentIdx];
  if (!activeQuestion) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center">
        <p className="text-slate-400">No questions available. Please try restarting.</p>
        <button onClick={() => setSelectedRound(null)} className="btn-primary mt-4 px-4 py-2 rounded-xl">Go Back</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Assessment Header */}
      <div className="glass-card rounded-xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {selectedRound === 'tech' ? 'Technical Algorithm Panel' : 'HR Behavioral Session'}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Question {currentIdx + 1} of {questions.length}
          </h3>
        </div>

        {/* Timer Container */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
          timeLeft < 60
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
            : 'bg-white/5 border-white/10 text-slate-300'
        }`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Workspace */}
      {selectedRound === 'tech' ? (
        /* ==================== TECHNICAL ROUND DOCK ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Question details (Left Panel) */}
          <div className="lg:col-span-5 glass-card rounded-xl p-6 space-y-4 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white border-b border-white/5 pb-2">Problem Statement</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {activeQuestion.question}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-primary uppercase block">Constraints & Specs</span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Optimize for space complexity where possible.</li>
                  <li>Handle empty arrays or edge input formats.</li>
                  <li>Runtime limit: 2000ms.</li>
                </ul>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Console / Editor (Right Panel) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="glass-card rounded-xl overflow-hidden flex flex-col flex-grow">
              {/* Editor controls */}
              <div className="bg-white/[0.02] border-b border-white/10 px-4 py-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 font-mono">editor.js</span>
                
                {/* Language Picker */}
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-slate-900 text-xs text-white border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary font-mono"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  {activeQuestion.starterCode?.java && <option value="java">Java</option>}
                </select>
              </div>

              {/* Textarea Code Console */}
              <div className="relative flex-grow flex">
                {/* Simulated Line numbers */}
                <div className="bg-white/[0.01] border-r border-white/5 px-3 py-4 text-right select-none font-mono text-xs text-slate-600 space-y-1">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="w-full bg-transparent p-4 focus:outline-none text-slate-200 font-mono text-sm resize-none min-h-[300px]"
                  style={{ tabSize: 2 }}
                />
              </div>

              {/* Terminal Console Output */}
              <div className="bg-black/45 border-t border-white/10 p-4 font-mono text-xs text-slate-300 min-h-[120px] max-h-[160px] overflow-y-auto">
                <div className="text-slate-500 mb-1 border-b border-white/5 pb-1 flex justify-between">
                  <span>SANDBOX TERMINAL OUTPUT</span>
                  {isRunningCode && <span className="text-primary animate-pulse">Running...</span>}
                </div>
                <pre className="whitespace-pre-wrap">{consoleOutput || "Terminal ready. Compile code to see output logs."}</pre>
              </div>

              {/* Editor Actions bar */}
              <div className="bg-white/[0.02] border-t border-white/10 px-4 py-3 flex justify-between">
                <button
                  onClick={runCode}
                  disabled={isRunningCode}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition border border-white/5"
                >
                  <Play className="w-3.5 h-3.5" /> Run Code
                </button>
                <div className="flex gap-2">
                  {currentIdx > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-lg transition"
                    >
                      Previous
                    </button>
                  )}
                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="text-xs bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-lg transition hover:opacity-90 glow-border-orange"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={finishAssessment}
                      className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg transition"
                    >
                      Finish Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== HR BEHAVIORAL ROUND ==================== */
        <div className="glass-card rounded-xl p-8 space-y-6 min-h-[450px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Display Question */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Behavioral Question</h4>
              <p className="text-lg font-medium text-white leading-relaxed font-sans">
                {activeQuestion.question}
              </p>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-300">Your Answer Response</label>
                <span className="text-xs text-slate-500">{(textAnswer || '').length} characters</span>
              </div>
              
              <div className="relative">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your response here or click the voice input icon to simulate transcription..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-accent transition min-h-[160px] pb-12"
                />
                
                {/* Voice Sim Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute bottom-3 right-3 p-3 rounded-full transition-all flex items-center justify-center border ${
                    isRecording 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Simulate speech transcription"
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-xs text-rose-400 animate-pulse">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span>AI Transcribing simulated response... Speak now.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-white/5 pt-6 flex justify-between items-center">
            <button
              onClick={() => setSelectedRound(null)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Quit Session
            </button>

            <div className="flex gap-2">
              {currentIdx > 0 && (
                <button
                  onClick={handlePrevious}
                  className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-lg transition"
                >
                  Previous
                </button>
              )}
              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="text-xs bg-gradient-to-r from-primary to-accent text-white font-bold px-5 py-2.5 rounded-lg transition hover:opacity-90 glow-border-orange"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={finishAssessment}
                  className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg transition"
                >
                  Submit & Finish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
