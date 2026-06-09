import React, { useState, useRef } from 'react';
import { Upload, Briefcase, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { JOB_ROLES } from '../services/mockData';
import { resumeApi } from '../services/api';

export default function ResumeUpload({ onUploadSuccess }) {
  const [jobRole, setJobRole] = useState(JOB_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const loadingMessages = [
    "Uploading resume file to secure workspace...",
    "Extracting metadata and layout structures...",
    "Parsing skill sets, certifications, and experience...",
    "Running semantic match against job description...",
    "Calculating ATS Score and identifying keyword gaps..."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (validTypes.includes(selectedFile.type) || ['pdf', 'docx', 'doc'].includes(extension)) {
      setError(null);
      return true;
    } else {
      setError("Please upload a valid PDF or Word Document (.pdf, .docx, .doc)");
      return false;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume to begin the analysis.");
      return;
    }

    const finalRole = isCustom ? customRole.trim() : jobRole;
    if (!finalRole) {
      setError("Please select or specify a target job role.");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate multi-stage loading messages
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const response = await resumeApi.uploadResume(file, finalRole);
      clearInterval(stepInterval);
      if (response.success) {
        onUploadSuccess(response.data);
      } else {
        setError("Resume analysis failed. Please try again.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError("An error occurred during resume upload. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          {/* Animated Spinner with Amber Ring */}
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-accent animate-spin"></div>
          </div>
          
          <h3 className="text-2xl font-semibold font-display text-white mb-2">Analyzing Resume</h3>
          <p className="text-slate-400 text-sm max-w-md animate-pulse">
            {loadingMessages[loadingStep]}
          </p>
          
          {/* Progress Bar Indicator */}
          <div className="w-full max-w-sm bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 shimmer-progress"
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-display text-white mb-2">
              Start Your Resume Analysis
            </h2>
            <p className="text-slate-400">
              Select your target role and upload your resume to discover skill gaps and start a mock interview.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Job Role Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Target Job Role
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsCustom(false)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    !isCustom
                      ? 'bg-primary/10 border-primary/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="block font-semibold text-sm">Select Preset Role</span>
                  <span className="text-xs text-slate-500">Pick from common tech profiles</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isCustom
                      ? 'bg-primary/10 border-primary/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="block font-semibold text-sm">Custom Target Role</span>
                  <span className="text-xs text-slate-500">Input any specialized job position</span>
                </button>
              </div>

              {!isCustom ? (
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                >
                  {JOB_ROLES.map((role, idx) => (
                    <option key={idx} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g., Senior iOS Engineer or DevOps Consultant"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
                />
              )}
            </div>

            {/* Drag & Drop File Area */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Upload Resume
              </label>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] ${
                  dragActive
                    ? 'border-primary bg-primary/5 scale-[0.99]'
                    : file
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/15 bg-white/5 hover:border-primary/55 hover:bg-white/10'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 p-4 rounded-full inline-block">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-white font-medium break-all text-sm md:text-base">{file.name}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium underline px-3 py-1 bg-rose-500/10 rounded-md"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-full inline-block text-slate-400">
                      <Upload className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Drag and drop your file here, or <span className="text-primary hover:underline">browse</span>
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        Supports PDF, DOCX, DOC (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file}
              className={`w-full py-4 rounded-xl font-bold font-display text-white flex items-center justify-center gap-2 transition-all ${
                file
                  ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 active:scale-[0.98] glow-border-orange'
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              Analyze Resume & Generate Match <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
