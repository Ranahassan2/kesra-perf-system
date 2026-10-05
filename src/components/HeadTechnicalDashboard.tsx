import React, { useState } from 'react';
import {
  Users,
  Award,
  Clock,
  ChevronDown,
  ChevronRight,
  Building2,
  Crown,
  Star,
  Search,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Employee, EmployeeLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeadTechnicalDashboardProps {
  onStartEvaluation: (employeeId: string) => void;
  onViewEvaluation: (evaluation: any) => void;
}

export const HeadTechnicalDashboard: React.FC<HeadTechnicalDashboardProps> = ({
  onStartEvaluation,
  onViewEvaluation,
}) => {
  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();
  const { currentUser } = useAuth();
  const { employees, evaluations, departments, selectedQuarter, selectedYear, saveEmployee, deleteEmployee } = useData();

  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Add Employee Modal
  const [modalType, setModalType] = useState<'EMPLOYEE' | 'TEAM_LEADER' | null>(null);
  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    level: 'Junior' as EmployeeLevel,
    departmentId: '',
    teamLeaderId: '',
  });

  if (!currentUser || currentUser.systemRole !== 'HEAD_TECHNICAL') {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        عذراً، هذه الصفحة مخصصة للمدير التقني فقط.
      </div>
    );
  }

  const toggleDept = (deptId: string) => {
    setExpandedDepts((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email || !newEmp.role || !newEmp.departmentId) return;

    const isTL = modalType === 'TEAM_LEADER' || newEmp.level === 'Team Leader';
    const dept = departments.find(d => d.id === newEmp.departmentId);
    
    let finalTlId = dept?.teamLeaderId;
    let finalTlName = dept?.teamLeaderName;

    if (modalType === 'EMPLOYEE' && newEmp.teamLeaderId) {
      const selectedTl = employees.find(e => e.id === newEmp.teamLeaderId);
      if (selectedTl) {
        finalTlId = selectedTl.id;
        finalTlName = selectedTl.name;
      }
    }

    const employeeToSave: Employee = {
      id: 'emp-' + Date.now().toString(),
      name: newEmp.name,
      email: newEmp.email,
      password: newEmp.password || undefined,
      departmentId: newEmp.departmentId,
      departmentName: dept?.name || '',
      role: newEmp.role,
      level: isTL ? 'Team Leader' : newEmp.level,
      teamLeaderId: finalTlId,
      teamLeaderName: finalTlName,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      systemRole: isTL ? 'TEAM_LEADER' : 'EMPLOYEE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEmployee(employeeToSave);
    setModalType(null);
    setNewEmp({ name: '', email: '', password: '', role: '', level: 'Junior', departmentId: '', teamLeaderId: '' });
  };

  const handleDelete = (empId: string, empName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(language === 'ar' ? `هل أنت متأكد من حذف الموظف ${empName}؟` : `Are you sure you want to delete employee ${empName}?`)) {
      deleteEmployee(empId);
    }
  };

  // Group employees by department, excluding Toqa herself, and upper management
  const activeEmps = employees.filter(
    (e) => e.isActive && e.id !== currentUser.id && !['CEO', 'ADMIN', 'HR'].includes(e.systemRole)
  );

  // Filter by search
  const filteredEmps = activeEmps.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get departments that have employees
  const deptsWithEmps = departments.filter((d) =>
    filteredEmps.some((e) => e.departmentId === d.id)
  );

  // Stats
  const totalEmps = activeEmps.length;
  const evaluatedEmps = activeEmps.filter((emp) =>
    evaluations.some(
      (e) => e.employeeId === emp.id && e.quarter === selectedQuarter && e.year === selectedYear
    )
  ).length;
  const pendingEmps = totalEmps - evaluatedEmps;

  const getEval = (empId: string) =>
    evaluations.find(
      (e) => e.employeeId === empId && e.quarter === selectedQuarter && e.year === selectedYear
    );

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-teal-400';
    if (score >= 55) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="view-shell animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-eyebrow">{language === 'ar' ? 'المدير الفني' : 'Head Technical'}</span>
          <h2 className="font-display text-2xl text-white tracking-tight mt-1">
            {language === 'ar' ? 'المراقبة الفنية اللحظية للتقييمات' : 'Real-time Technical Evaluation Monitoring'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar' ? `الدورة:` : `Cycle:`} <span className="text-teal-400 font-semibold">{selectedQuarter} {selectedYear}</span> • {language === 'ar' ? 'نظرة شاملة على أداء مدراء الأقسام وقادة الفرق لضمان الجودة' : 'Comprehensive overview of department managers and team leaders to ensure quality'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewEmp({ name: '', email: '', password: '', role: 'Team Leader', level: 'Team Leader', departmentId: '', teamLeaderId: '' });
              setModalType('TEAM_LEADER');
            }}
            className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition-colors shrink-0 shadow-lg shadow-teal-600/20"
          >
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة قائد فريق' : 'Add Team Leader'}
          </button>
          <button
            onClick={() => {
              setNewEmp({ name: '', email: '', password: '', role: '', level: 'Junior', departmentId: '', teamLeaderId: '' });
              setModalType('EMPLOYEE');
            }}
            className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-semibold text-white transition-colors shrink-0 shadow-lg shadow-purple-600/20"
          >
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            {language === 'ar' ? 'إجمالي المقيّمين الفنيين' : 'Total Technical Evaluators'}
          </p>
          <div className="flex items-end gap-2 mt-1">
            <p className="font-display text-white text-3xl font-tabular">{departments.length}</p>
            <p className="text-xs text-slate-500 mb-1">{language === 'ar' ? 'قسم' : 'Departments'}</p>
          </div>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            {language === 'ar' ? 'إجمالي التقييمات المكتملة' : 'Total Completed Evaluations'}
          </p>
          <div className="flex items-end gap-2 mt-1">
            <p className="font-display text-emerald-400 text-3xl font-tabular">{evaluatedEmps}</p>
            <p className="text-xs text-emerald-500/80 mb-1">{language === 'ar' ? 'تمت مراجعتها' : 'Reviewed'}</p>
          </div>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            {language === 'ar' ? 'بانتظار تدخلك' : 'Awaiting Your Review'}
          </p>
          <div className="flex items-end gap-2 mt-1">
            <p className="font-display text-amber-400 text-3xl font-tabular">{evaluations.filter(e => e.status === 'UNDER_REVIEW').length}</p>
            <p className="text-xs text-amber-500/80 mb-1">{language === 'ar' ? 'تقييم' : 'Evaluations'}</p>
          </div>
        </div>

        <div className="stat-card">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            {language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
          </p>
          <div className="flex items-end gap-2 mt-1">
            <p className="font-display text-purple-400 text-3xl font-tabular">{totalEmps}</p>
            <p className="text-xs text-slate-500 mb-1">{language === 'ar' ? 'موظف' : 'Employees'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-white text-base">
          {language === 'ar' ? 'متابعة أداء الأقسام (قادة الفرق)' : 'Department Performance Monitoring (Team Leaders)'}
        </h3>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={language === 'ar' ? 'ابحث عن موظف أو مسمى وظيفي...' : 'Search for employee or role...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pr-10 pl-4 text-xs text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none"
        />
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {deptsWithEmps.map((dept) => {
          const deptEmps = filteredEmps.filter((e) => e.departmentId === dept.id);
          const teamLeaders = deptEmps.filter((e) => e.systemRole === 'TEAM_LEADER' || e.level === 'Team Leader');
          const regularEmps = deptEmps.filter((e) => e.systemRole !== 'TEAM_LEADER' && e.level !== 'Team Leader');
          const deptEvaluated = deptEmps.filter((e) => getEval(e.id)).length;
          const isExpanded = expandedDepts[dept.id] !== false; // default expanded

          return (
            <div
              key={dept.id}
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              {/* Department Header */}
              <button
                onClick={() => toggleDept(dept.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/20 p-2 text-purple-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white text-sm">{dept.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {deptEmps.length} {language === 'ar' ? 'موظف' : 'employees'} •{' '}
                      <span className="text-emerald-400">{deptEvaluated} {language === 'ar' ? 'تم تقييمهم' : 'evaluated'}</span>
                      {deptEmps.length - deptEvaluated > 0 && (
                        <span className="text-amber-400"> • {deptEmps.length - deptEvaluated} {language === 'ar' ? 'متبقي' : 'remaining'}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">{language === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate'}</div>
                    <div className="text-sm font-bold text-white">
                      {deptEmps.length > 0 ? Math.round((deptEvaluated / deptEmps.length) * 100) : 0}%
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-white/5">

                  {/* Team Leaders Section */}
                  {teamLeaders.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-purple-500/10 border-b border-white/5 flex items-center gap-2">
                        <Crown className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                          {language === 'ar' ? 'قادة الفرق (Team Leaders)' : 'Team Leaders'}
                        </span>
                      </div>
                      {teamLeaders.map((emp) => {
                        const ev = getEval(emp.id);
                        return (
                          <div
                            key={emp.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs uppercase shrink-0">
                                {emp.name.substring(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-white">{emp.name}</h4>
                                  <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full font-bold">TL</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">{emp.role}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {ev ? (
                                <>
                                  <div className="text-right">
                                    <div className={`text-lg font-bold ${getScoreColor(ev.finalScore)}`}>
                                      {ev.finalScore}
                                      <span className="text-xs font-normal text-slate-400">/100</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400">{ev.classification}</div>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap">
                                    {STATUSES[ev.status]?.label || ev.status}
                                  </span>
                                  <button
                                    onClick={() => onViewEvaluation(ev)}
                                    className="shrink-0 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                                  >
                                    {language === 'ar' ? 'عرض' : 'View'}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                    {language === 'ar' ? 'بانتظار التقييم' : 'Pending Evaluation'}
                                  </span>
                                  <button
                                    onClick={() => onStartEvaluation(emp.id)}
                                    className="shrink-0 rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                                  >
                                    {language === 'ar' ? 'تقييم الآن' : 'Evaluate Now'}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={(e) => handleDelete(emp.id, emp.name, e)}
                                className="shrink-0 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-colors flex items-center justify-center border border-rose-500/30"
                                title={language === 'ar' ? 'حذف القائد' : 'Delete Leader'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Regular Employees Section */}
                  {regularEmps.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-white/2 border-b border-white/5 flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'ar' ? 'الموظفون' : 'Employees'}
                        </span>
                      </div>
                      {regularEmps.map((emp) => {
                        const ev = getEval(emp.id);
                        return (
                          <div
                            key={emp.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-teal-900/40 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-xs uppercase shrink-0">
                                {emp.name.substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white">{emp.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-[11px] text-slate-400">{emp.role}</p>
                                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 rounded">
                                    {LEVELS[emp.level] || emp.level}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {ev ? (
                                <>
                                  <div className="text-right">
                                    <div className={`text-lg font-bold ${getScoreColor(ev.finalScore)}`}>
                                      {ev.finalScore}
                                      <span className="text-xs font-normal text-slate-400">/100</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400">{ev.classification}</div>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap">
                                    {STATUSES[ev.status]?.label || ev.status}
                                  </span>
                                  <button
                                    onClick={() => onViewEvaluation(ev)}
                                    className="shrink-0 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                                  >
                                    {language === 'ar' ? 'عرض' : 'View'}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                                    {language === 'ar' ? 'بانتظار التقييم' : 'Pending Evaluation'}
                                  </span>
                                  <button
                                    onClick={() => onStartEvaluation(emp.id)}
                                    className="shrink-0 rounded-xl bg-teal-600 hover:bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                                  >
                                    {language === 'ar' ? 'تقييم الآن' : 'Evaluate Now'}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={(e) => handleDelete(emp.id, emp.name, e)}
                                className="shrink-0 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-colors flex items-center justify-center border border-rose-500/30"
                                title={language === 'ar' ? 'حذف الموظف' : 'Delete Employee'}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Employee / Team Leader Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10, 13, 17, 0.85)' }}>
          <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className={`rounded-xl p-2 ${modalType === 'TEAM_LEADER' ? 'bg-teal-500/20 text-teal-400' : 'bg-purple-500/20 text-purple-400'}`}>
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {modalType === 'TEAM_LEADER' ? 'إضافة قائد فريق جديد (Team Leader)' : 'إضافة موظف جديد'}
              </h3>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">القسم</label>
                <select
                  required
                  value={newEmp.departmentId}
                  onChange={e => setNewEmp({ ...newEmp, departmentId: e.target.value, teamLeaderId: '' })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                >
                  <option value="">اختر القسم...</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {modalType === 'EMPLOYEE' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">تعيين تحت إدارة (Team Leader)</label>
                  <select
                    required
                    disabled={!newEmp.departmentId}
                    value={newEmp.teamLeaderId}
                    onChange={e => setNewEmp({ ...newEmp, teamLeaderId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!newEmp.departmentId ? (
                      <option value="">يرجى اختيار القسم أولاً...</option>
                    ) : (
                      <>
                        <option value="">اختر قائد الفريق...</option>
                        {employees
                          .filter(e => e.departmentId === newEmp.departmentId && (e.systemRole === 'TEAM_LEADER' || e.level === 'Team Leader'))
                          .map(tl => (
                            <option key={tl.id} value={tl.id}>{tl.name}</option>
                          ))}
                      </>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم الموظف</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  placeholder="الاسم كامل..."
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={newEmp.email}
                  onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none text-left"
                  placeholder="employee@kesraa.com"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  required
                  value={newEmp.role}
                  onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  placeholder={modalType === 'TEAM_LEADER' ? "مثال: Head of SEO" : "مثال: Graphic Designer"}
                />
              </div>

              {modalType === 'TEAM_LEADER' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">كلمة المرور (للدخول كقائد فريق)</label>
                  <input
                    type="text"
                    required
                    value={newEmp.password}
                    onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-teal-500/50 focus:outline-none"
                    placeholder="كلمة المرور الافتراضية..."
                  />
                </div>
              )}

              {modalType === 'EMPLOYEE' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">المستوى</label>
                  <select
                    value={newEmp.level}
                    onChange={e => setNewEmp({ ...newEmp, level: e.target.value as EmployeeLevel })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-3 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  >
                    <option value="Junior">مبتدئ (Junior)</option>
                    <option value="Mid">متوسط (Mid)</option>
                    <option value="Senior">متقدم (Senior)</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 transition-colors"
                >
                  حفظ وإضافة للقسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
