import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  Brain,
  Building2,
  User,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Department, Evaluation, Employee } from '../types';

interface AIInsightsModalProps {
  initialEvaluation?: Evaluation | null;
  onClose: () => void;
  onApply?: (insights: any) => void;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  initialEvaluation,
  onClose,
  onApply,
}) => {
  const { departments, employees, evaluations, selectedQuarter, selectedYear } = useData();
  const { language } = useLanguage();

  const [mode, setMode] = useState<'DEPARTMENT' | 'EMPLOYEE'>(
    initialEvaluation ? 'EMPLOYEE' : 'DEPARTMENT'
  );
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    initialEvaluation?.departmentId || departments[0]?.id || 'dept-am'
  );
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    initialEvaluation?.employeeId || employees[0]?.id || 'emp-01'
  );

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeDepartment = departments.find((d) => d.id === selectedDeptId);
  const activeEmployee = employees.find((e) => e.id === selectedEmpId);
  const activeEvaluation = evaluations.find(
    (e) => e.employeeId === selectedEmpId && e.quarter === selectedQuarter && e.year === selectedYear
  );

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      let promptText = '';
      if (mode === 'DEPARTMENT') {
          const deptEvals = evaluations.filter(
            (e) => e.departmentId === selectedDeptId && e.quarter === selectedQuarter && e.year === selectedYear
          );
          promptText = `أنت خبير في الموارد البشرية وتقييم الأداء. قم بتحليل بيانات أداء القسم التالية وقدم رؤى باللغة العربية.
القسم: ${activeDepartment?.name}
الدورة: ${selectedQuarter} ${selectedYear}
بيانات التقييمات: ${JSON.stringify(deptEvals)}

قم بتقديم الاستجابة بتنسيق JSON فقط بهذا الهيكل:
{
  "executiveSummary": "ملخص تنفيذي لأداء القسم (فقرة واحدة)",
  "topDepartmentStrengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "systemicWeaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "leadershipRecommendations": ["توصية 1", "توصية 2"],
  "attritionRiskAssessment": "تقييم مخاطر ترك العمل (جملة واحدة)"
}`;
        } else {
          promptText = `أنت خبير في الموارد البشرية وتقييم الأداء. قم بتحليل بيانات أداء الموظف التالية وقدم رؤى باللغة العربية.
الموظف: ${activeEmployee?.name} (${activeEmployee?.role})
القسم: ${activeEmployee?.departmentName}
بيانات التقييم: ${JSON.stringify(activeEvaluation || { finalScore: 0, classification: 'غير مقيم' })}

قم بتقديم الاستجابة بتنسيق JSON فقط بهذا الهيكل:
{
  "executiveSummary": "ملخص تنفيذي لأداء الموظف",
  "keyStrengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "criticalImprovementAreas": ["مجال تحسين 1", "مجال تحسين 2"],
  "promotionReadinessScore": 85,
  "promotionVerdict": "رأي مبدئي حول الترقية",
  "coachingPlan": [
    { "timeframe": "30 يوم", "action": "وصف الإجراء", "metric": "مؤشر النجاح" }
  ]
}`;
        }

        const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
          throw new Error('Gemini API Key is not configured in .env file.');
        }
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              response_mime_type: "application/json"
            }
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(`HTTP Error ${res.status}: ${JSON.stringify(errData)}`);
        }
        
        const data = await res.json();
        const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        setInsights(JSON.parse(jsonStr));
      
    } catch (err: any) {
      console.warn('AI Fetch Error:', err);
      setError(err.message || 'حدث خطأ أثناء التواصل مع الذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [mode, selectedDeptId, selectedEmpId]);

  const handleCopy = () => {
    if (!insights) return;
    navigator.clipboard.writeText(JSON.stringify(insights, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(10, 13, 17, 0.85)' }}>
      <div
        className="relative w-full max-w-4xl rounded-3xl border border-white/10 my-8 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'rgba(10, 13, 17, 0.95)' }}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                {language === 'ar' ? 'تحليل الأداء المتقدم (AI)' : 'Advanced Performance Analysis (AI)'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي • تحليلات على مستوى القسم والفرد' : 'Powered by AI • Department & Individual Analytics'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onApply && (
              <button
                onClick={() => {
                  if (insights && onApply) {
                    onApply(insights);
                  }
                }}
                disabled={!insights}
                className="hidden sm:inline-flex items-center rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                {language === 'ar' ? 'إدراج التوصيات' : 'Apply'}
              </button>
            )}

            <button
              onClick={handleCopy}
              disabled={!insights}
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>

            <button
              onClick={fetchInsights}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
              title={language === 'ar' ? 'إعادة توليد التحليل' : 'Regenerate Analysis'}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector & Filter Bar (Frosted Pills) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-3" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('DEPARTMENT')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                mode === 'DEPARTMENT'
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              {language === 'ar' ? 'تحليل القسم' : 'Department Analysis'}
            </button>

            <button
              onClick={() => setMode('EMPLOYEE')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                mode === 'EMPLOYEE'
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              {language === 'ar' ? 'تحليل معمق لموظف' : 'Employee Deep-Dive'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'DEPARTMENT' ? (
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="rounded-xl border border-white/10 bg-neutral-950 px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="rounded-xl border border-white/10 bg-neutral-950 px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.departmentName} - {e.level})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-rose-400">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
              <p className="font-semibold">{error}</p>
              <button onClick={fetchInsights} className="mt-2 text-rose-300 underline text-[11px] hover:text-white">
                {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                <Brain className="h-12 w-12 text-purple-400 animate-bounce relative z-10" />
              </div>
              <p className="mt-4 text-sm font-semibold text-purple-200">
                {language === 'ar' ? 'الخبير الاصطناعي يقرأ البيانات...' : 'AI Expert is reading data...'}
              </p>
              <p className="mt-2 text-xs text-slate-400 max-w-xs text-center">
                {language === 'ar' ? 'يتم الآن تحليل نقاط القوة والضعف ومقارنتها بمعايير القسم لإنشاء توصيات تطويرية مخصصة.' : 'Analyzing strengths and weaknesses and comparing with department benchmarks to generate customized development recommendations.'}
              </p>
            </div>
          ) : !insights ? (
            <div className="text-center py-12 text-slate-500">
              <AlertTriangle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p>{language === 'ar' ? 'لا يوجد تحليل متاح. اضغط تحديث للتوليد.' : 'No analysis available. Click refresh to generate.'}</p>
            </div>
          ) : mode === 'DEPARTMENT' ? (
            /* Department Synthesis Display */
            <div className="space-y-5">
              
              {/* Executive Summary Callout */}
              <div
                className="rounded-2xl border border-purple-500/30 p-5 space-y-2"
                style={{ background: 'rgba(168, 85, 247, 0.08)' }}
              >
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  {language === 'ar' ? `التحليل التنفيذي: ${activeDepartment?.name} (${selectedQuarter} ${selectedYear})` : `Executive Analysis: ${activeDepartment?.name} (${selectedQuarter} ${selectedYear})`}
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {insights.executiveSummary}
                </p>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-emerald-300">
                      {language === 'ar' ? 'أبرز نقاط القوة (التي تم رصدها آلياً)' : 'Key Strengths (Auto-detected)'}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {(insights.topDepartmentStrengths || insights.keyStrengths)?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <h4 className="text-sm font-bold text-rose-300">
                      {language === 'ar' ? 'نقاط الاختناق والفجوات المنهجية' : 'Systemic Bottlenecks & Gaps'}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {insights.systemicWeaknesses?.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Leadership Recommendations */}
              <div
                className="rounded-2xl border border-white/10 p-5 space-y-3"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-teal-400" /> {language === 'ar' ? 'توصيات القيادة الاستراتيجية' : 'Strategic Leadership Recommendations'}
                </h4>
                <ul className="space-y-2 text-slate-300">
                  {insights.leadershipRecommendations?.map((r: string, i: number) => (
                    <li key={i} className="rounded-xl border border-white/5 bg-white/5 p-3 flex items-start gap-2">
                      <span className="font-bold text-teal-400">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {insights.attritionRiskAssessment && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-blue-200">
                  <strong>{language === 'ar' ? 'تقييم الاحتفاظ بالكفاءات:' : 'Retention Assessment:'}</strong> {insights.attritionRiskAssessment}
                </div>
              )}

            </div>
          ) : (
            /* Employee Deep-Dive Display */
            <div className="space-y-5">
              
              {/* Executive Summary Banner */}
              <div
                className="rounded-2xl border border-purple-500/30 p-5 space-y-2"
                style={{ background: 'rgba(168, 85, 247, 0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    {language === 'ar' ? `السرد الفردي للأداء: ${activeEmployee?.name}` : `Individual Performance Narrative: ${activeEmployee?.name}`}
                  </div>
                  {insights.promotionReadinessScore && (
                    <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-3 py-0.5 text-xs font-bold text-purple-200">
                      {language === 'ar' ? `جاهزية الترقية: ${insights.promotionReadinessScore}%` : `Promotion Readiness: ${insights.promotionReadinessScore}%`}
                    </span>
                  )}
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {insights.executiveSummary}
                </p>
                {insights.promotionVerdict && (
                  <p className="text-xs font-medium text-purple-300 mt-1">
                    ↳ {insights.promotionVerdict}
                  </p>
                )}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-emerald-300">
                      {language === 'ar' ? 'أبرز نقاط القوة الأساسية الظاهرة' : 'Key Core Strengths'}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {insights.keyStrengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-amber-300">
                      {language === 'ar' ? 'مجالات النمو المستهدفة' : 'Targeted Growth Areas'}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-slate-200">
                    {insights.criticalImprovementAreas?.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 30-60-90 Day Coaching Plan */}
              {insights.coachingPlan && insights.coachingPlan.length > 0 && (
                <div
                  className="rounded-2xl border border-white/10 p-5 space-y-3"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-teal-400" /> {language === 'ar' ? 'خطة التطوير المهني لـ 30-60-90 يوم' : '30-60-90 Day Professional Development Plan'}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {insights.coachingPlan.map((plan: any, i: number) => (
                      <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-3 space-y-1">
                        <span className="font-bold text-teal-400 block text-xs">{plan.timeframe}</span>
                        <p className="text-white font-medium">{plan.action}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'الهدف:' : 'Goal:'} {plan.metric}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-b sm:border-t border-white/10 px-6 py-4" style={{ background: 'rgba(10, 13, 17, 0.95)' }}>
          <div className="text-[11px] text-slate-400">
            {language === 'ar' ? 'التحليل التوليدي بالذكاء الاصطناعي مساعد سياقي لدعم المقيّمين والإدارة التنفيذية.' : 'AI generative analysis is a contextual assistant to support evaluators and executive management.'}
          </div>
          <div className="flex items-center gap-3">
            {onApply && (
              <button
                onClick={() => {
                  if (insights && onApply) {
                    onApply(insights);
                  }
                }}
                disabled={!insights}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                {language === 'ar' ? 'إدراج التوصيات في نموذج التقييم' : 'Apply Recommendations to Form'}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
