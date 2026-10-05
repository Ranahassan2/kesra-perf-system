import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Lock,
  Save,
  Send,
  Eye,
  CheckCheck,
  TrendingUp,
  User,
  Building2,
  Calendar,
  Brain,
  Star,
  Info,
  MessageSquare
} from 'lucide-react';
import {
  Evaluation,
  Employee,
  KPIDefinition,
  EvaluationScoreItem,
  EvaluationStatus
} from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CalculationEngine } from '../services/calculationEngine';
import { AiRecommendationsModal } from './AiRecommendationsModal';
import { ENGLISH_KPIS } from '../config/englishKpis';
import { ENGLISH_KPIS_2 } from '../config/englishKpis2';
import { ENGLISH_KPIS_3 } from '../config/englishKpis3';
import { useLanguage } from '../context/LanguageContext';

const ALL_ENGLISH_KPIS = { ...ENGLISH_KPIS, ...ENGLISH_KPIS_2, ...ENGLISH_KPIS_3 };

interface EvaluationFormModalProps {
  evaluation?: Evaluation | null;
  employee?: Employee | null;
  onClose: () => void;
  onSaved: (evaluation: Evaluation) => void;
}

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  evaluation,
  employee: propEmployee,
  onClose,
  onSaved,
}) => {
  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();
  const { currentUser, canViewKPIWeights, canApproveEvaluations, canPublishEvaluations, canEvaluateEmployee } = useAuth();
  const { settings, employees, saveEvaluation, acknowledgeEvaluation, selectedQuarter, selectedYear } = useData();

  // Find evaluatable employees for the dropdown
  const evaluatableEmployees = React.useMemo(() => {
    return employees.filter((emp) => {
      if (!emp.isActive) return false;
      return canEvaluateEmployee(emp);
    });
  }, [employees, currentUser, canEvaluateEmployee]);

  const [selectedNewEmpId, setSelectedNewEmpId] = useState<string>(
    evaluatableEmployees.length > 0 ? evaluatableEmployees[0].id : ''
  );

  // Determine target employee
  const targetEmployee =
    propEmployee ||
    (evaluation ? employees.find((e) => e.id === evaluation.employeeId) : null) ||
    employees.find((e) => e.id === selectedNewEmpId) ||
    evaluatableEmployees[0];

  // Eligibility calculation (minimum 2 months)
  const eligibility = CalculationEngine.checkEligibility(
    targetEmployee?.startDate || '2024-01-01',
    new Date().toISOString(),
    settings.minEmploymentMonths || 2
  );

  const isLocked = evaluation?.locked || ['HR_MANAGEMENT_APPROVED', 'PUBLISHED', 'ACKNOWLEDGED'].includes(evaluation?.status || '');
  const isEmployeeView = currentUser?.systemRole === 'EMPLOYEE' && currentUser.id === targetEmployee?.id;
  const isTeamLeader = targetEmployee?.level === 'Team Leader';
  const isHeadTech = targetEmployee?.isHeadTechnical;
  
  const isRegularTL = isTeamLeader && !isHeadTech;
  const commonPercent = isRegularTL ? 15 : settings.commonSkillsPercent;
  const deptPercent = isRegularTL ? 35 : (isHeadTech ? 40 : settings.deptKpiPercent);
  const leadPercent = isRegularTL ? 50 : settings.tlLeadershipPercent;

  const canSubmit = !isLocked && eligibility.isEligible;
  const canApproveHead = !isLocked && currentUser?.systemRole === 'HEAD_TECHNICAL';
  const canApproveCEO = !isLocked && canApproveEvaluations();
  const canPublish = !isLocked && canPublishEvaluations();

  // Active or Snapshot KPIs
  const activeKpis: KPIDefinition[] = React.useMemo(() => {
    if (evaluation?.snapshotConfig?.kpis) {
      return evaluation.snapshotConfig.kpis;
    }
    const common = settings.commonKPIs.filter((k) => 
      k.isActive && (isRegularTL ? k.isForTeamLeader : !k.isForTeamLeader)
    );
    const dept = settings.departmentKPIs.filter(
      (k) => k.departmentId === targetEmployee?.departmentId && k.isActive && (isRegularTL ? k.isForTeamLeader : !k.isForTeamLeader)
    );
    const leadership = isTeamLeader ? settings.leadershipKPIs.filter((k) => k.isActive && (isRegularTL ? k.isForTeamLeader : !k.isForTeamLeader)) : [];
    const headTechMgmt = isHeadTech ? settings.headTechManagementKPIs.filter((k) => k.isActive && !k.isForTeamLeader) : [];
    return [...common, ...dept, ...leadership, ...headTechMgmt];
  }, [evaluation, settings, targetEmployee, isTeamLeader, isHeadTech]);

  // Local state for scores
  const [scoresState, setScoresState] = useState<Record<string, { score: number; notes: string }>>({});
  const [strengths, setStrengths] = useState(evaluation?.strengths || '');
  const [improvements, setImprovements] = useState(evaluation?.improvements || '');
  const [developmentActions, setDevelopmentActions] = useState(evaluation?.developmentActions || '');
  const [ackNotes, setAckNotes] = useState(evaluation?.acknowledgementNotes || '');
  const [activeGuideKpiId, setActiveGuideKpiId] = useState<string | null>(null);
  const [activeNoteKpiId, setActiveNoteKpiId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Initialize scores
  useEffect(() => {
    const initial: Record<string, { score: number; notes: string }> = {};
    if (evaluation?.scores && evaluation.scores.length > 0) {
      evaluation.scores.forEach((s) => {
        initial[s.kpiId] = { score: s.score, notes: s.notes || '' };
      });
    } else {
      activeKpis.forEach((k) => {
        initial[k.id] = { score: 0, notes: '' }; // Default score 0 (unevaluated)
      });
    }
    setScoresState(initial);
  }, [evaluation, activeKpis]);

  // Live score calculation
  const calculated = React.useMemo(() => {
    const inputList = Object.entries(scoresState).map(([kpiId, val]) => ({
      kpiId,
      score: (val as { score: number; notes: string }).score,
      notes: (val as { score: number; notes: string }).notes,
    }));

    return CalculationEngine.calculateScores(
      inputList,
      activeKpis,
      targetEmployee?.level || 'Mid',
      targetEmployee?.isHeadTechnical || false,
      settings.classifications
    );
  }, [scoresState, activeKpis, targetEmployee, settings.classifications]);

  const handleScoreChange = (kpiId: string, newScore: number) => {
    if (isLocked) return;
    setScoresState((prev) => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], score: Math.max(0, Math.min(10, Math.round(newScore))) },
    }));
  };

  const handleNotesChange = (kpiId: string, notes: string) => {
    if (isLocked) return;
    setScoresState((prev) => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], notes },
    }));
  };

  // Build Evaluation Payload
  const buildEvaluationPayload = (newStatus: EvaluationStatus): Evaluation => {
    return {
      id: evaluation?.id || `eval-${targetEmployee.id}-${selectedQuarter}-${selectedYear}`,
      employeeId: targetEmployee.id,
      employeeName: targetEmployee.name,
      evaluatorId: currentUser?.id || 'emp-admin',
      evaluatorName: currentUser?.name || 'مسؤول النظام',
      evaluatorRole: currentUser?.role || 'مقيّم',
      departmentId: targetEmployee.departmentId,
      departmentName: targetEmployee.departmentName,
      role: targetEmployee.role,
      level: targetEmployee.level,
      quarter: evaluation?.quarter || selectedQuarter,
      year: evaluation?.year || selectedYear,
      cycleId: `cycle-${selectedQuarter}-${selectedYear}`,
      version: settings.activeVersion || 'v1.0',
      status: newStatus,
      isEligible: eligibility.isEligible,
      eligibilityReason: eligibility.reason,
      tenureMonths: eligibility.tenureMonths,
      commonScore: calculated.commonScore,
      departmentScore: calculated.departmentScore,
      leadershipScore: calculated.leadershipScore,
      finalScore: calculated.finalScore,
      classification: calculated.classification,
      departmentRank: evaluation?.departmentRank || 1,
      totalInDepartment: evaluation?.totalInDepartment || 1,
      strengths,
      improvements,
      developmentActions,
      locked: ['HR_MANAGEMENT_APPROVED', 'PUBLISHED', 'ACKNOWLEDGED'].includes(newStatus) || evaluation?.locked || false,
      scores: calculated.itemScores,
      snapshotConfig: evaluation?.snapshotConfig || {
        version: settings.activeVersion,
        minEmploymentMonths: settings.minEmploymentMonths,
        commonSkillsPercent: settings.commonSkillsPercent,
        departmentKpiPercent: settings.deptKpiPercent,
        tlLeadershipPercent: settings.tlLeadershipPercent,
        headTechManagementPercent: settings.headTechManagementPercent,
        kpis: activeKpis,
        classifications: settings.classifications,
      },
      submittedAt: newStatus === 'SUBMITTED_BY_TEAM_LEADER' ? new Date().toISOString() : evaluation?.submittedAt,
      submittedBy: newStatus === 'SUBMITTED_BY_TEAM_LEADER' ? currentUser?.name : evaluation?.submittedBy,
      approvedAt: newStatus === 'HR_MANAGEMENT_APPROVED' ? new Date().toISOString() : evaluation?.approvedAt,
      approvedBy: newStatus === 'HR_MANAGEMENT_APPROVED' ? currentUser?.name : evaluation?.approvedBy,
      publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : evaluation?.publishedAt,
      publishedBy: newStatus === 'PUBLISHED' ? currentUser?.name : evaluation?.publishedBy,
      createdAt: evaluation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleAction = async (newStatus: EvaluationStatus) => {
    if (newStatus !== 'DRAFT') {
      const missingScores = activeKpis.filter(kpi => !scoresState[kpi.id] || scoresState[kpi.id].score === 0);
      if (missingScores.length > 0) {
        alert('يرجى تقييم جميع المؤشرات (من 1 إلى 10) قبل الاعتماد أو الإرسال للمراجعة.\n\nPlease evaluate all KPIs from 1 to 10 before submitting.');
        return;
      }
    }

    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = buildEvaluationPayload(newStatus);
      await saveEvaluation(payload);
      onSaved(payload);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!evaluation || isSaving) return;
    setIsSaving(true);
    try {
      await acknowledgeEvaluation(evaluation.id, ackNotes);
      onSaved({
        ...evaluation,
        status: 'ACKNOWLEDGED',
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: currentUser?.name,
        acknowledgementNotes: ackNotes,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // AI Generation of qualitative narrative using Gemini API
  const handleAIFeedback = async () => {
    try {
      setAiLoading(true);
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        alert(language === 'ar' ? 'مفتاح API غير مضبوط. يرجى التحقق من ملف .env' : 'API Key is not configured. Please check your .env file.');
        return;
      }
      
      const detailedScores = activeKpis.map(kpi => {
        const val = scoresState[kpi.id]?.score ?? 0;
        return `- ${kpi.name}: ${val}/10`;
      }).join('\n');

      const englishClassification = {
        'ممتاز': 'Excellent',
        'جيد جداً': 'Very Good',
        'جيد': 'Good',
        'يحتاج إلى تحسين': 'Needs Improvement',
        'يحتاج إلى متابعة دقيقة': 'Needs Attention'
      }[calculated.classification] || calculated.classification;

      const promptText = `You are an executive HR and performance evaluation expert. Analyze the following evaluation entered by a team leader for an employee, and write customized, highly accurate qualitative notes based exactly on the assigned scores (1-10) for each indicator.

Employee Details:
- Name: ${targetEmployee?.name}
- Role: ${targetEmployee?.role} (${targetEmployee?.level})
- Department: ${targetEmployee?.departmentName}

Detailed scores selected by the Team Leader in this evaluation:
${detailedScores}

Overall Score: ${calculated.finalScore}/100 (${englishClassification})

Required:
Write an analysis specifically for these scores (focus on low skills 1-5 in improvements and action plan, and high skills 7-10 in strengths):

Provide the response in English and in JSON format ONLY with this structure:
{
  "strengths": "• Strength based on high indicators 1\\n• Strength 2",
  "improvements": "• Area of improvement based on low indicators 1\\n• Area of improvement 2",
  "developmentActions": "• 30-day goal to raise weak indicators: ...\\n• 60-day goal: ...\\n• 90-day goal: ..."
}`;

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
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const parsed = JSON.parse(jsonStr);

      if (parsed.strengths) setStrengths(parsed.strengths);
      if (parsed.improvements) setImprovements(parsed.improvements);
      if (parsed.developmentActions) setDevelopmentActions(parsed.developmentActions);

    } catch (error) {
      console.error('Error generating AI notes:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء توليد ملاحظات الذكاء الاصطناعي. يرجى التأكد من الاتصال بالشبكة أو إعادة المحاولة.' : 'An error occurred while generating AI notes. Please check your network connection or try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Group KPIs for structured section rendering
  const commonKpis = activeKpis.filter((k) => k.category === 'COMMON');
  const deptKpis = activeKpis.filter((k) => k.category === 'DEPARTMENT');
  const leadershipKpis = activeKpis.filter(
    (k) => k.category === 'LEADERSHIP' || k.category === 'MANAGEMENT'
  );

  const showWeights = canViewKPIWeights();

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(10, 13, 17, 0.85)' }}>
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-white/10 my-8 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'rgba(10, 13, 17, 0.9)' }}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-white text-base">
                Quarterly Scorecard
              </h2>
              <p className="text-xs text-slate-400">
                Cycle: <span className="font-semibold text-teal-400">{evaluation?.quarter || selectedQuarter} {evaluation?.year || selectedYear}</span>
                {evaluation?.version && ` • Version ${evaluation.version}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked && (
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Lock className="h-3.5 w-3.5" />
                Archived & Locked
              </span>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Employee Metadata Banner */}
          <div
            className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 p-4 sm:grid-cols-4"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'ar' ? 'الموظف' : 'Employee'}
              </span>
              
              {!evaluation && !propEmployee ? (
                <div className="mt-1">
                  <select
                    value={targetEmployee?.id || ''}
                    onChange={(e) => setSelectedNewEmpId(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-neutral-900/80 py-1.5 px-2 text-sm text-white focus:border-teal-500/50 focus:outline-none"
                  >
                    {evaluatableEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {targetEmployee?.name}
                  </div>
                  <div className="text-xs text-slate-400">{targetEmployee?.email}</div>
                </>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
              <div className="font-semibold text-slate-200 text-sm mt-0.5">
                {targetEmployee?.departmentName}
              </div>
              <div className="text-xs text-teal-400 font-medium">
                {targetEmployee?.role} ({targetEmployee?.level})
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenure & Eligibility</span>
              <div className="font-semibold text-slate-200 text-sm mt-0.5">
                {eligibility.tenureMonths} months
              </div>
              <div className="text-xs">
                {eligibility.isEligible ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Eligible for evaluation
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Requires at least 2 months
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status & Evaluator</span>
              <div className="font-semibold text-slate-200 text-sm mt-0.5">
                {evaluation ? (STATUSES[evaluation.status]?.label || evaluation.status) : 'Not started yet'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {evaluation?.submittedAt && (
                  <div className="text-teal-400">
                    {language === 'ar' ? 'بواسطة' : 'By'}: {evaluation.submittedBy || targetEmployee?.teamLeaderName}
                    <br />
                    {language === 'ar' ? 'في' : 'On'}: {new Date(evaluation.submittedAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
                {!evaluation?.submittedAt && (
                  <div>{language === 'ar' ? `المدير: ${targetEmployee?.teamLeaderName || 'الإدارة المباشرة'}` : `Manager: ${targetEmployee?.teamLeaderName || 'Direct Management'}`}</div>
                )}
              </div>
            </div>
          </div>

          {/* Warning Banner if Employee is NOT ELIGIBLE (<2 months tenure) */}
          {!eligibility.isEligible && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-300">
                    Employee is not eligible for quarterly evaluation
                  </h4>
                  <p className="text-xs text-rose-300/80 mt-1">
                    {eligibility.reason ||
                      `This employee has completed ${eligibility.tenureMonths} months of service. Company policy requires a minimum of ${settings.minEmploymentMonths} months before conducting quarterly evaluations.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Real-Time Scorecard Summary Box */}
          <div
            className="rounded-2xl border border-teal-500/30 p-4"
            style={{ background: 'rgba(20, 184, 166, 0.08)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    {`Common Skills (${commonPercent}%)`}
                  </span>
                  <div className="text-lg font-bold text-white">
                    {calculated.commonScore} <span className="text-xs font-normal text-slate-400">/ {commonPercent}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    {`Department KPIs (${deptPercent}%)`}
                  </span>
                  <div className="text-lg font-bold text-white">
                    {calculated.departmentScore} <span className="text-xs font-normal text-slate-400">/ {deptPercent}</span>
                  </div>
                </div>

                {(isTeamLeader || isHeadTech) && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      {`Leadership (${leadPercent}%)`}
                    </span>
                    <div className="text-lg font-bold text-white">
                      {calculated.leadershipScore} <span className="text-xs font-normal text-slate-400">/ {leadPercent}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">
                    Calculated Final Score
                  </span>
                  <div className="font-display font-tabular text-2xl text-teal-400">
                    {calculated.finalScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center ">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Classification
                  </span>
                  <span className="text-sm font-extrabold text-teal-300">
                    {{
                      'ممتاز': 'Excellent',
                      'جيد جداً': 'Very Good',
                      'جيد': 'Good',
                      'يحتاج إلى تحسين': 'Needs Improvement',
                      'يحتاج إلى متابعة دقيقة': 'Needs Attention'
                    }[calculated.classification] || calculated.classification}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Matrices */}
          <div className="space-y-6">
            
            {/* Section 1: Common Skills (9 KPIs, 40%) */}
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {`1. Common Skills Matrix (${commonPercent}% Total)`}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {`${commonKpis.length} Core Competencies`}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {commonKpis.map((kpi) => renderKpiRow(kpi))}
              </div>
            </div>

            {/* Section 2: Department Functional KPIs (60% / 40%) */}
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {`2. Department KPIs: ${targetEmployee?.departmentName} (${deptPercent}% Total)`}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {`${deptKpis.length} Functional Outputs`}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {deptKpis.map((kpi) => renderKpiRow(kpi))}
              </div>
            </div>

            {/* Section 3: Leadership KPIs (20% for Team Leaders / Head Tech) */}
            {(isTeamLeader || isHeadTech) && leadershipKpis.length > 0 && (
              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {`3. Leadership & Team Development Matrix (${leadPercent}% Total)`}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {`${leadershipKpis.length} Leadership Competencies`}
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {leadershipKpis.map((kpi) => renderKpiRow(kpi))}
                </div>
              </div>
            )}

          </div>

          {/* Qualitative Performance Feedback & Development Plan */}
          <div
            className="rounded-2xl border border-white/10 p-5 space-y-4"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Qualitative Performance Feedback & Development Plan
                </h3>
                <p className="text-xs text-slate-400">
                  Specific achievements, growth opportunities, and 30-90 day development steps
                </p>
              </div>

              {!isLocked && (
                <button
                  id="btn-ai-generate-narrative"
                  type="button"
                  onClick={handleAIFeedback}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/20 px-3.5 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/30 transition-all "
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                  {aiLoading ? 'Analyzing...' : 'AI Assistance'}
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-inner">
              <h3 className="font-display text-white text-lg mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                Notes & Recommendations
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">
                    Strengths & Achievements
                  </label>
                  <textarea
                    required
                    readOnly={isLocked}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="What did the employee excel at during this quarter?"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">
                    Areas for Improvement
                  </label>
                  <textarea
                    required
                    readOnly={isLocked}
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="Where are the gaps that need attention?"
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 text-left">
                    Development Plan & Next Quarter Goals
                  </label>
                  <textarea
                    required
                    readOnly={isLocked}
                    value={developmentActions}
                    onChange={(e) => setDevelopmentActions(e.target.value)}
                    placeholder="Practical steps and training to improve efficiency..."
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Employee Acknowledgement Box (if published) */}
            {evaluation?.status === 'PUBLISHED' && isEmployeeView && (
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4">
                <h4 className="text-xs font-bold text-teal-200 mb-1">Employee Review & Official Acknowledgment</h4>
                <p className="text-xs text-teal-300/80 mb-2">Please review the quarterly scorecard above. Clicking confirm records your acknowledgment timestamped.</p>
                <textarea
                  id="textarea-ack-notes"
                  rows={2}
                  value={ackNotes}
                  onChange={(e) => setAckNotes(e.target.value)}
                  placeholder='Optional notes or comments upon acknowledgment...'
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            )}

            {evaluation?.status === 'ACKNOWLEDGED' && (
              <div className="rounded-xl bg-emerald-500/15 p-3 text-xs text-emerald-300 border border-emerald-500/30 space-y-2">
                <div>
                  ✓ 'Acknowledged by' <span className="font-bold">{evaluation.acknowledgedBy}</span> 'on' 
                  {new Date(evaluation.acknowledgedAt || '').toLocaleString()}.
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">Evaluator</div>
                  <div className="text-xs font-semibold text-slate-200">
                    {evaluation?.evaluatorName || currentUser?.name || 'N/A'}
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium whitespace-pre-wrap text-left`}>
                  {evaluation?.acknowledgementNotes || ackNotes}
                </div>
              </div>
            )}

          </div>

          {/* ReadOnly Notice */}
          {isLocked && !isEmployeeView && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-200">Read-Only Form</h4>
                <p className="text-[11px] text-blue-300/80 mt-1 leading-relaxed">This evaluation is locked and cannot be modified. Data is shown for review purposes only.</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/10 px-6 py-4" style={{ background: 'rgba(10, 13, 17, 0.95)' }}>
          <div className="text-xs text-slate-400">
            {isLocked
              ? 'Scorecard is permanently locked and archived in audit logs.'
              : eligibility.isEligible
              ? 'Make sure to evaluate all KPIs from 1 to 10 before submitting.'
              : 'Action disabled: Employee has not met tenure requirement (2 months).'}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-modal-cancel"
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >Close</button>

            {/* Smart Analysis Button (For TL, HR, Admin, Head Tech) AFTER evaluation exists */}
            {evaluation && ['SUBMITTED_BY_TEAM_LEADER', 'HR_MANAGEMENT_APPROVED', 'PUBLISHED', 'ACKNOWLEDGED'].includes(evaluation.status) && (
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 hover:bg-purple-500 transition-all"
              >
                <Brain className="h-3.5 w-3.5" />Expert Analysis (AI)</button>
            )}

            {!isLocked && (
              <button
                type="button"
                onClick={() => handleAction('DRAFT')}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {language === 'ar' ? 'حفظ مسودة' : 'Save Draft'}
              </button>
            )}
            {canSubmit && (
              <button
                id="btn-submit-evaluation"
                type="button"
                onClick={() => handleAction('SUBMITTED_BY_TEAM_LEADER')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-500 transition-colors"
              >
                <Send className="h-4 w-4" />
                {language === 'ar' ? 'إرسال للمراجعة' : 'Submit for Review'}
              </button>
            )}
            {canApproveHead && (
              <button
                id="btn-approve-head"
                type="button"
                onClick={() => handleAction('REVIEWED')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors"
              >
                <Eye className="h-4 w-4" />
                {language === 'ar' ? 'اعتماد كرئيس تقني' : 'Mark as Reviewed'}
              </button>
            )}
            {canApproveCEO && (
              <button
                id="btn-approve-hr"
                type="button"
                onClick={() => handleAction('HR_MANAGEMENT_APPROVED')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                {language === 'ar' ? 'اعتماد الإدارة' : 'HR Approve'}
              </button>
            )}
            {canPublish && (
              <button
                id="btn-publish-evaluation"
                type="button"
                onClick={() => handleAction('PUBLISHED')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
              >
                <Eye className="h-4 w-4" />
                {language === 'ar' ? 'نشر للموظف' : 'Publish to Employee'}
              </button>
            )}
            {isEmployeeView && evaluation?.status === 'PUBLISHED' && (
              <button
                id="btn-acknowledge-evaluation"
                type="button"
                onClick={() => handleAcknowledge()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                {language === 'ar' ? 'تأكيد الاستلام' : 'Acknowledge'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>

    {evaluation && targetEmployee && (
      <AiRecommendationsModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        employee={targetEmployee}
        evaluation={evaluation}
      />
    )}
    </>
  );

  // Helper row renderer for individual KPIs
  function renderKpiRow(kpi: KPIDefinition) {
    const currentScore = scoresState[kpi.id]?.score || 0;
    const isGuideOpen = activeGuideKpiId === kpi.id;

    // Translation logic for TLs and Toqa
    const isEnglishUser = true;
    const transKpi = isEnglishUser ? ALL_ENGLISH_KPIS[kpi.id] : null;
    const kpiName = transKpi?.name || kpi.name;
    const kpiDesc = transKpi?.description || kpi.description;

    const kpiScoringGuide = transKpi?.scoringGuide || kpi.scoringGuide;

    return (
      <div key={kpi.id} className="p-4 hover:bg-white/5 transition-colors">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* KPI Title & Description */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {kpiName}
              </span>
              {/* Only show weight if user has permission */}
              {showWeights && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {kpi.weight}%
                </span>
              )}
              {isLocked ? (
                <span className="text-[10px] text-rose-300 font-bold bg-rose-500/20 px-2 py-1 rounded border border-rose-500/30">Locked (Read Only)</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveNoteKpiId(activeNoteKpiId === kpi.id ? null : kpi.id)}
                  className="flex items-center gap-1 text-[10px] text-teal-300 font-bold bg-teal-500/20 px-2 py-1 rounded border border-teal-500/30 hover:bg-teal-500/30 transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3" />
                  {scoresState[kpi.id]?.notes ? 'Edit Note' : 'Add Note'}
                </button>
              )}
              {kpiScoringGuide && (
                <button
                  type="button"
                  onClick={() => setActiveGuideKpiId(isGuideOpen ? null : kpi.id)}
                  className="text-slate-400 hover:text-teal-400 transition-colors"
                  title='View scoring guide from 1 to 10'
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {kpiDesc}
            </p>
          </div>

          {/* Score Selector (Integers 1..10) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                disabled={isLocked}
                onClick={() => handleScoreChange(kpi.id, num)}
                className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                  currentScore === num
                    ? num >= 9
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 border border-emerald-400'
                      : num >= 7
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105 border border-teal-400'
                      : num >= 5
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 border border-amber-400'
                      : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 border border-rose-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                } disabled:cursor-not-allowed`}
              >
                {num}
              </button>
            ))}
          </div>

        </div>

        {/* Note Textarea */}
        {activeNoteKpiId === kpi.id && (
          <div className="mt-3">
            <textarea
              value={scoresState[kpi.id]?.notes || ''}
              onChange={(e) => handleNotesChange(kpi.id, e.target.value)}
              readOnly={isLocked}
              placeholder="Add specific notes or feedback for this KPI..."
              className="w-full h-20 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/50 resize-none"
            />
          </div>
        )}

        {/* Expandable Scoring Guide Rubric */}
        {isGuideOpen && kpiScoringGuide && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] space-y-1 ">
            <div className="font-bold text-slate-200 mb-1">
              {`Evaluation criteria for ${kpiName}:`}
            </div>
            <div className="text-emerald-300">
              • <span className="font-semibold">Excellent:</span> {kpiScoringGuide.excellent || '9-10'}
            </div>
            <div className="text-teal-300">
              • <span className="font-semibold">Good:</span> {kpiScoringGuide.good || '7-8'}
            </div>
            <div className="text-amber-300">
              • <span className="font-semibold">Needs Improvement:</span> {kpiScoringGuide.needsImprovement || '5-6'}
            </div>
            <div className="text-orange-300">
              • <span className="font-semibold">Poor:</span> {kpiScoringGuide.poor || '3-4'}
            </div>
            <div className="text-rose-300">
              • <span className="font-semibold">Critical:</span> {kpiScoringGuide.critical || '1-2'}
            </div>
          </div>
        )}
      </div>
    );
  }
};
