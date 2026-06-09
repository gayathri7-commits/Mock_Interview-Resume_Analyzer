import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, AlertTriangle, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AnalysisDashboard({ analysisData, onProceed, onBack }) {
  const { fileName, jobRole, atsScore, skillMatch, matchedSkills, keywordGaps, recommendations } = analysisData;
  const [animateProgress, setAnimateProgress] = useState(false);

  // Trigger progress bar animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 70) return 'from-primary to-accent';
    return 'from-rose-500 to-orange-400';
  };

  const getScoreTextClass = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 70) return 'text-primary';
    return 'text-rose-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Analysis Completed
          </span>
          <h2 className="text-3xl font-bold font-display text-white mt-2 mb-1">{jobRole}</h2>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <span>Resume: <strong>{fileName}</strong></span>
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Upload Different Resume
        </button>
      </div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATS Score Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> ATS Score
              </h3>
              <p className="text-xs text-slate-400 mt-1">Overall resume compatibility with parsing systems</p>
            </div>
            <span className={`text-3xl md:text-4xl font-black font-display ${getScoreTextClass(atsScore)}`}>
              {atsScore}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Progress Track */}
            <div className="w-full bg-slate-900/80 h-4 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreColorClass(atsScore)} transition-all duration-[1200ms] ease-out shimmer-progress`}
                style={{ width: animateProgress ? `${atsScore}%` : '0%' }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>Optimizable</span>
              <span>Good Match (80%+)</span>
            </div>
          </div>
        </div>

        {/* Skill Match Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" /> Skill Match
              </h3>
              <p className="text-xs text-slate-400 mt-1">Direct matches against technical requirements</p>
            </div>
            <span className={`text-3xl md:text-4xl font-black font-display ${getScoreTextClass(skillMatch)}`}>
              {skillMatch}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Progress Track */}
            <div className="w-full bg-slate-900/80 h-4 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreColorClass(skillMatch)} transition-all duration-[1200ms] ease-out shimmer-progress`}
                style={{ width: animateProgress ? `${skillMatch}%` : '0%' }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>Basic Skills</span>
              <span>Advanced Stack Coverage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords and Gaps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Key Strengths Found ({matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                {skill}
              </span>
            ))}
            {matchedSkills.length === 0 && (
              <p className="text-slate-500 text-sm">No significant keyword matches detected.</p>
            )}
          </div>
        </div>

        {/* Keyword Gaps */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Keyword & Skill Gaps ({keywordGaps.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2">
            {keywordGaps.map((gap, idx) => (
              <span
                key={idx}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                {gap}
              </span>
            ))}
            {keywordGaps.length === 0 && (
              <p className="text-slate-500 text-sm">Excellent! No keyword gaps detected for this role.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations Checklist */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
          <AlertCircle className="w-5 h-5 text-primary" /> Actionable Resume Recommendations
        </h3>
        <ul className="space-y-4">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5 text-xs font-semibold">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </li>
          ))}
          {recommendations.length === 0 && (
            <p className="text-slate-400 text-sm">Your resume is highly optimized. No improvements needed!</p>
          )}
        </ul>
      </div>

      {/* CTA Box */}
      <div className="glass-card rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h4 className="text-xl font-bold font-display text-white mb-1">Ready to test your skills?</h4>
          <p className="text-slate-400 text-sm">
            Launch an interactive AI Mock Interview session customized to this target job description.
          </p>
        </div>
        <button
          onClick={onProceed}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold font-display flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all glow-border-orange cursor-pointer"
        >
          Proceed to Mock Interview <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
