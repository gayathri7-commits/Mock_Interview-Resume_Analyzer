import React, { useState, useEffect } from 'react';
import { Award, Calendar, CheckCircle2, TrendingUp, RefreshCw, BarChart2, Star, ThumbsUp } from 'lucide-react';
import { resumeApi } from '../services/api';

export default function PerformanceAnalytics({ evaluationData, onRestart }) {
  const { overallScore, breakdown, evaluation, feedbackDetails, date, sessionId } = evaluationData;
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load historical interviews
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const response = await resumeApi.getHistoricalAnalytics();
        if (response.success) {
          // Combine preloaded history with current interview session score
          const combined = [
            ...response.data,
            { id: sessionId, date: date, role: "Current Session", score: overallScore, type: "Live Assessment" }
          ];
          setHistory(combined);
        }
      } catch (err) {
        console.error("Failed to load historical analytics", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [evaluationData]);

  // Calculate coordinates for inline SVG Chart
  // viewBox="0 0 600 220"
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const getChartPoints = () => {
    if (history.length === 0) return { pathD: '', areaD: '', points: [] };
    
    const points = history.map((item, idx) => {
      const x = paddingX + (idx * (chartWidth - 2 * paddingX)) / Math.max(1, history.length - 1);
      // Map score 0-100 to chartHeight minus padding
      const y = chartHeight - paddingY - (item.score / 100) * (chartHeight - 2 * paddingY);
      return { x, y, score: item.score, date: item.date, role: item.role };
    });

    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Area starts at (firstX, bottomY), traces to points, then drops to (lastX, bottomY) and closes
    const bottomY = chartHeight - paddingY;
    const areaD = points.length > 0 
      ? `M ${points[0].x} ${bottomY} L ${pathD.substring(2)} L ${points[points.length - 1].x} ${bottomY} Z`
      : '';

    return { pathD, areaD, points };
  };

  const { pathD, areaD, points } = getChartPoints();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Banner congratulating user */}
      <div className="glass-card rounded-2xl p-8 bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-500/10 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Completed Successfully
          </div>
          <h2 className="text-3xl font-bold font-display text-white">Interview Evaluation Complete</h2>
          <p className="text-slate-400 text-sm mt-1">
            Session ID: <span className="font-mono text-slate-500">{sessionId}</span> &bull; Conducted on {date}
          </p>
        </div>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold font-display flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all glow-border-orange cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Start New Assessment
        </button>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Score indicators & Bullet evaluations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Detailed Score Breakdowns */}
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" /> Performance Metrics
              </h3>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Overall Score</span>
                <span className="text-3xl font-black font-display text-primary">{overallScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Coding & Algorithmic</span>
                  <span className="font-bold text-white">{breakdown.coding}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full" style={{ width: `${breakdown.coding}%` }}></div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>HR Delivery & Behavioral</span>
                  <span className="font-bold text-white">{breakdown.hr}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full" style={{ width: `${breakdown.hr}%` }}></div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Communication Confidence</span>
                  <span className="font-bold text-white">{breakdown.communication}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full" style={{ width: `${breakdown.communication}%` }}></div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Technical Accuracy</span>
                  <span className="font-bold text-white">{breakdown.technicalAccuracy}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full" style={{ width: `${breakdown.technicalAccuracy}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Bullet Reviews */}
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <Star className="w-5 h-5 text-accent" /> Key Evaluation Takeaways
            </h3>
            <ul className="space-y-4">
              {evaluation.map((bullet, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300 text-sm md:text-base leading-relaxed">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent border border-accent/20 shrink-0 mt-0.5 text-xs font-semibold">
                    ✓
                  </span>
                  <p>{bullet}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Feedback Snippets */}
          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold font-display text-white pb-3 border-b border-white/5">
              Targeted Feedback Loops
            </h3>
            
            <div className="space-y-4">
              {feedbackDetails.codingFeedback && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-primary uppercase">Code Optimization Recommendation</span>
                  <p className="bg-slate-900 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed">
                    {feedbackDetails.codingFeedback}
                  </p>
                </div>
              )}
              {feedbackDetails.hrFeedback && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-accent uppercase">HR Speech & Star Structure Guidance</span>
                  <p className="bg-slate-900 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-300 leading-relaxed">
                    {feedbackDetails.hrFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Charts & Profile History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Score progression chart */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Performance History Chart
            </h3>

            {/* Custom Responsive SVG Chart */}
            <div className="w-full overflow-hidden bg-slate-950/40 rounded-xl p-4 border border-white/5">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                  </linearGradient>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Gridlines */}
                {[0, 25, 50, 75, 100].map((scoreVal) => {
                  const y = chartHeight - paddingY - (scoreVal / 100) * (chartHeight - 2 * paddingY);
                  return (
                    <g key={scoreVal} className="opacity-25">
                      <line 
                        x1={paddingX} 
                        y1={y} 
                        x2={chartWidth - paddingX} 
                        y2={y} 
                        stroke="#ffffff" 
                        strokeWidth="1" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={paddingX - 10} 
                        y={y + 4} 
                        fill="#ffffff" 
                        fontSize="10" 
                        textAnchor="end"
                        className="font-mono select-none"
                      >
                        {scoreVal}
                      </text>
                    </g>
                  );
                })}

                {/* Plot Paths */}
                {history.length > 1 && (
                  <>
                    {/* Area path */}
                    <path d={areaD} fill="url(#chart-gradient)" />
                    {/* Line path */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="url(#line-gradient)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Circles & Tooltips */}
                {points.map((p, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="5" 
                      className="fill-primary stroke-[#07070a] stroke-2 group-hover:r-7 transition-all duration-150"
                    />
                    
                    {/* Hover tooltip backing */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                      <rect 
                        x={Math.max(10, p.x - 50)} 
                        y={p.y - 45} 
                        width="100" 
                        height="35" 
                        rx="6" 
                        fill="#1e1e24" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={p.x} 
                        y={p.y - 32} 
                        fill="#ffffff" 
                        fontSize="10" 
                        fontWeight="bold" 
                        textAnchor="middle" 
                        className="font-mono"
                      >
                        {p.score}%
                      </text>
                      <text 
                        x={p.x} 
                        y={p.y - 20} 
                        fill="#9ca3af" 
                        fontSize="8" 
                        textAnchor="middle"
                      >
                        {p.date}
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Saved User Profiles/History lists */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> Saved Interview History
            </h3>
            
            {loadingHistory ? (
              <div className="text-center py-6 text-slate-500 text-xs">Loading logs...</div>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {history.map((hist, idx) => (
                  <div 
                    key={hist.id || idx} 
                    className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-3 flex justify-between items-center transition"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-200">{hist.role}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{hist.date} &bull; {hist.type || 'Combined'}</span>
                    </div>
                    <span className="bg-primary/15 text-primary text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-primary/10">
                      {hist.score}%
                    </span>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-slate-500 text-xs py-4 text-center">No assessments found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
