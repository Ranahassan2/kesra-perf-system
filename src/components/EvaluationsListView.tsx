import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Award,
  Clock,
  Eye,
  FileEdit,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Evaluation, EvaluationStatus } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface EvaluationsListViewProps {
  onSelectEvaluation: (evaluation: Evaluation) => void;
  onNewEvaluation: (employeeId?: string) => void;
  onAnalyzeWithAI: (evaluation: Evaluation) => void;
}

export const EvaluationsListView: React.FC<EvaluationsListViewProps> = ({
  onSelectEvaluation,
  onNewEvaluation,
  onAnalyzeWithAI,
}) => {
  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();
  const { departments, employees, evaluations, selectedQuarter, selectedYear } = useData();
  const { currentUser, canEvaluateEmployee, isExecutiveOrAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Filter evaluations (memoized for performance)
  const filteredEvaluations = useMemo(() => evaluations.filter((evaluation) => {
    if (evaluation.quarter !== selectedQuarter || evaluation.year !== selectedYear) return false;
    if (currentUser?.systemRole === 'EMPLOYEE') {
      if (evaluation.employeeId !== currentUser.id) return false;
    } else if (currentUser?.systemRole === 'TEAM_LEADER') {
      if (evaluation.departmentId !== currentUser.departmentId && !isExecutiveOrAdmin()) return false;
    }
    if (departmentFilter !== 'ALL' && evaluation.departmentId !== departmentFilter) return false;
    if (statusFilter !== 'ALL' && evaluation.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      if (!evaluation.employeeName.toLowerCase().includes(q) &&
          !evaluation.role.toLowerCase().includes(q) &&
          !evaluation.departmentName.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [evaluations, selectedQuarter, selectedYear, currentUser, departmentFilter, statusFilter, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvaluations.length / PAGE_SIZE));
  const paginatedEvaluations = filteredEvaluations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const resetPage = () => setCurrentPage(1);

  const unevaluatedEmployees = employees.filter((emp) => {
    if (!emp.isActive) return false;
    if (currentUser?.systemRole === 'TEAM_LEADER' && emp.departmentId !== currentUser.departmentId) {
      return false;
    }
    const hasEval = evaluations.some(
      (e) => e.employeeId === emp.id && e.quarter === selectedQuarter && e.year === selectedYear
    );
    return !hasEval && canEvaluateEmployee(emp);
  });

  const getStatusBadge = (status: EvaluationStatus) => {
    switch (status) {
      case 'ACKNOWLEDGED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'PUBLISHED':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'HR_MANAGEMENT_APPROVED':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'SUBMITTED_BY_TEAM_LEADER':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'REVIEWED':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="view-shell">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-eyebrow">
            {t.evaluations || (currentUser?.systemRole === 'TEAM_LEADER' ? 'تقييمات الفريق' : 'التقييمات العامة')}
          </span>
          <h2 className="font-display text-2xl text-white tracking-tight mt-1">
            {currentUser?.systemRole === 'TEAM_LEADER' ? 'سجل تقييمات فريقي' : 'سجل التقييمات الفصلية للشركة'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar' ? 'الدورة' : 'Cycle'}: <span className="font-semibold text-teal-400">{selectedQuarter} {selectedYear}</span> • {language === 'ar' ? 'إدارة كشوف الدرجات، الاعتمادات، وتأكيدات الموظفين' : 'Manage scorecards, approvals, and employee acknowledgments'}
          </p>
        </div>

        {currentUser?.systemRole !== 'EMPLOYEE' && (
          <button
            id="btn-create-new-eval"
            onClick={() => onNewEvaluation()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-500 transition-all "
          >
            <Plus className="h-4 w-4" />
            {t.newEvaluation || 'بدء تقييم جديد'}
          </button>
        )}
      </div>

      {/* Pending Unevaluated Notice in Frosted Amber Box */}
      {unevaluatedEmployees.length > 0 && currentUser?.systemRole !== 'EMPLOYEE' && (
        <div
          className="rounded-2xl border border-amber-500/30 p-4 relative overflow-hidden"
          style={{ background: 'rgba(245, 158, 11, 0.08)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-200">
                  {unevaluatedEmployees.length} {language === 'ar' ? 'موظف مؤهل بانتظار التقييم الأولي' : 'qualified employee(s) awaiting initial evaluation'}
                </h4>
                <p className="text-[11px] text-amber-300/80">
                  {language === 'ar' ? `موظفون أتموا حد الشهرين وينتظرون كشوف الدرجات لـ ${selectedQuarter} ${selectedYear}.` : `Employees who completed the 2-month threshold awaiting scorecards for ${selectedQuarter} ${selectedYear}.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {unevaluatedEmployees.slice(0, 3).map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => onNewEvaluation(emp.id)}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200 hover:bg-amber-500/20 transition-all"
                >
                  + {language === 'ar' ? 'تقييم' : 'Evaluate'} {emp.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar (Frosted Capsule) */}
      <div
        className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="input-search-evaluations"
            type="text"
            placeholder={language === 'ar' ? 'بحث بالاسم، المسمى الوظيفي، أو القسم...' : 'Search by name, role, or department...'}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-xs text-white placeholder-slate-400 focus:border-teal-500/60 focus:outline-none "
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isExecutiveOrAdmin() && (
            <select
              id="select-dept-filter"
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); resetPage(); }}
              className="rounded-xl border border-white/10 bg-neutral-950/90 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">{language === 'ar' ? 'جميع الأقسام' : 'All Departments'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}

          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
            className="rounded-xl border border-white/10 bg-neutral-950/90 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none  cursor-pointer"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="DRAFT">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
            <option value="SUBMITTED_BY_TEAM_LEADER">{language === 'ar' ? 'تم الرفع من قائد الفريق' : 'Submitted by Team Leader'}</option>
            <option value="UNDER_REVIEW">{language === 'ar' ? 'قيد المراجعة' : 'Under Review'}</option>
            <option value="REVIEWED">{language === 'ar' ? 'تمت المراجعة' : 'Reviewed'}</option>
            <option value="HR_MANAGEMENT_APPROVED">{language === 'ar' ? 'معتمد من الإدارة و HR' : 'HR & Management Approved'}</option>
            <option value="PUBLISHED">{language === 'ar' ? 'تم النشر للموظف' : 'Published'}</option>
            <option value="ACKNOWLEDGED">{language === 'ar' ? 'تم التأكيد' : 'Acknowledged'}</option>
          </select>
        </div>
      </div>

      {/* Evaluations Table in Frosted Container */}
      <div
        className="rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs data-table">
            <thead className="border-b border-white/5 bg-white/2 text-slate-400">
              <tr className="text-slate-500 text-left border-b border-white/5">
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.employee}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.department}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.level}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.status || 'Status'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.finalScore}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.classification}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.departmentRank || (language === 'ar' ? 'الترتيب بالقسم' : 'Dept Rank')}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <Award className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-400">
                      {language === 'ar' ? 'لا توجد تقييمات مطابقة لخيارات التصفية المحددة.' : 'No evaluations match the selected filter criteria.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'ar' ? 'عدّل كلمة البحث أو فلتر القسم.' : 'Adjust search keyword or department filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedEvaluations.map((evalItem) => {
                  const isLocked = evalItem.locked || ['HR_MANAGEMENT_APPROVED', 'PUBLISHED', 'ACKNOWLEDGED'].includes(evalItem.status);
                  const isSenior = evalItem.level === 'Senior';
                  const isTL = evalItem.level === 'Team Leader';
                  const isMid = evalItem.level === 'Mid';

                  return (
                    <tr
                      key={evalItem.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {evalItem.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400">{evalItem.role}</div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-300">
                        <div>{evalItem.departmentName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-normal">
                          {language === 'ar' ? 'المدير:' : 'Manager:'} {evalItem.submittedBy || evalItem.evaluatorName}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] border ${
                            isSenior
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                              : isTL
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isMid
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {LEVELS[evalItem.level] || evalItem.level}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                            evalItem.status
                          )}`}
                        >
                          {isLocked && <Lock className="h-2.5 w-2.5 mr-1" />}
                          {STATUSES[evalItem.status]?.label || evalItem.status}
                        </span>
                        {evalItem.submittedAt && (
                          <div className="text-[9px] text-slate-400 mt-1.5 opacity-80" dir="ltr">
                            {new Date(evalItem.submittedAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-sm text-white">
                        {evalItem.finalScore > 0 ? (
                          <span>
                            {evalItem.finalScore}{' '}
                            <span className="text-[10px] text-slate-400">/ 100</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/30">
                          {CLASSIFICATIONS[evalItem.classification]?.label || evalItem.classification}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-300 font-mono">
                        {evalItem.departmentRank
                          ? `#${evalItem.departmentRank} من ${evalItem.totalInDepartment || '—'}`
                          : '—'}
                      </td>

                      <td className="px-5 py-4 text-right space-x-1.5">
                        <button
                          id={`btn-open-eval-${evalItem.id}`}
                          onClick={() => onSelectEvaluation(evalItem)}
                          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-teal-300 hover:bg-white/10 hover:text-white transition-all"
                        >
                          {isLocked ? <Eye className="h-3 w-3" /> : <FileEdit className="h-3 w-3" />}
                          {isLocked ? 'عرض' : 'تعديل / تقييم'}
                        </button>

                        <button
                          id={`btn-ai-eval-${evalItem.id}`}
                          onClick={() => onAnalyzeWithAI(evalItem)}
                          title="توليد تحليل الذكاء الاصطناعي وخطة العمل"
                          className="inline-flex items-center rounded-xl border border-teal-500/30 bg-teal-500/15 p-1 text-teal-300 hover:bg-teal-500/25 transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-white/10 px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-slate-400">
            عرض <span className="text-white font-semibold">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredEvaluations.length)}</span> من <span className="text-white font-semibold">{filteredEvaluations.length}</span> تقييم
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              السابق
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc: (number | string)[], p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`e-${idx}`} className="px-1 text-slate-500 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p ? 'bg-teal-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              التالي
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
