import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Upload,
  UserPlus,
  X,
  FileText,
  Play
} from 'lucide-react';
import { Employee, EmployeeLevel, SystemRole } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CalculationEngine } from '../services/calculationEngine';
import { useLanguage } from '../context/LanguageContext';

interface EmployeesManagementViewProps {
  onOpenGoogleSheets?: () => void;
  onStartEvaluation?: (id: string) => void;
  onViewEvaluation?: (id: string) => void;
}

export const EmployeesManagementView: React.FC<EmployeesManagementViewProps> = ({
  onOpenGoogleSheets,
  onStartEvaluation,
  onViewEvaluation,
}) => {
  const { t, language, ROLES, LEVELS, STATUSES, QUARTERS, CATEGORIES, CLASSIFICATIONS } = useLanguage();
  const { employees, departments, saveEmployee, deleteEmployee, settings, evaluations, selectedYear, selectedQuarter } = useData();
  const { canManageEmployees, currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeptId, setFormDeptId] = useState(departments[0]?.id || 'dept-am');
  const [formRole, setFormRole] = useState('');
  const [formLevel, setFormLevel] = useState<EmployeeLevel>('Mid');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formSystemRole, setFormSystemRole] = useState<SystemRole>('EMPLOYEE');
  const [formTeamLeadName, setFormTeamLeadName] = useState('');

  const openCreateModal = () => {
    setEditingEmp(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormPhone('');
    const defaultDeptId = currentUser?.systemRole === 'TEAM_LEADER' ? currentUser.departmentId : (departments[0]?.id || 'dept-am');
    setFormDeptId(defaultDeptId);
    setFormRole('');
    setFormLevel('Mid');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormSystemRole('EMPLOYEE');
    const defaultDept = departments.find(d => d.id === defaultDeptId);
    setFormTeamLeadName(defaultDept?.teamLeaderName || '');
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmp(emp);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormPassword(emp.password || '');
    setFormPhone(emp.phone || '');
    setFormDeptId(emp.departmentId);
    setFormRole(emp.role);
    setFormLevel(emp.level);
    setFormStartDate(emp.startDate);
    setFormSystemRole(emp.systemRole);
    setFormTeamLeadName(emp.teamLeaderName || '');
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    const dept = departments.find((d) => d.id === formDeptId) || departments[0];

    const payload: Employee = {
      id: editingEmp ? editingEmp.id : `emp-${Date.now()}`,
      name: formName,
      email: formEmail,
      password: formPassword || undefined,
      phone: formPhone,
      departmentId: dept.id,
      departmentName: dept.name,
      role: formRole || 'Team Member',
      level: formLevel,
      startDate: formStartDate,
      teamLeaderName: formTeamLeadName || dept.teamLeaderName,
      systemRole: formSystemRole,
      isActive: true,
      createdAt: editingEmp?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEmployee(payload);
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    if (currentUser?.systemRole === 'TEAM_LEADER' && emp.departmentId !== currentUser.departmentId) return false;

    if (deptFilter !== 'ALL' && emp.departmentId !== deptFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchName = emp.name.toLowerCase().includes(q);
      const matchEmail = emp.email.toLowerCase().includes(q);
      const matchPhone = emp.phone?.toLowerCase().includes(q);
      const matchRole = emp.role.toLowerCase().includes(q);
      const matchDept = emp.departmentName.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchRole && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="view-shell">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-eyebrow">{t.employees || (language === 'ar' ? 'إدارة الموظفين' : 'Employees Management')}</span>
          <h2 className="font-display text-2xl text-white tracking-tight mt-1">
            {language === 'ar' ? 'دليل موظفي الشركة' : 'Company Employee Directory'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar' ? 'إدارة موظفي الشركة، توزيعهم على الأقسام، المستويات الوظيفية، وأهلية التقييم' : 'Manage company employees, department distribution, functional levels, and evaluation eligibility'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-import-export-sheets"
            onClick={onOpenGoogleSheets}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all "
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            {language === 'ar' ? 'استيراد / تصدير CSV' : 'Import / Export CSV'}
          </button>

          {canManageEmployees() && (
            <button
              id="btn-add-employee"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-500 transition-all "
            >
              <UserPlus className="h-4 w-4" />
              {language === 'ar' ? 'إضافة موظف' : 'Add Employee'}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar (Frosted Capsule) */}
      <div
        className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 md:flex-row md:items-center md:justify-between"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="input-search-employees"
            type="text"
            placeholder={language === 'ar' ? 'بحث بالاسم، المسمى الوظيفي، البريد، أو القسم...' : 'Search by name, role, email, or department...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-xs text-white placeholder-slate-400 focus:border-teal-500/60 focus:outline-none "
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser?.systemRole !== 'TEAM_LEADER' && (
            <select
              id="select-dept-filter-employees"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">{language === 'ar' ? 'جميع الأقسام السبعة' : 'All Departments'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Employees Table in Frosted Container */}
      <div
        className="rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs data-table">
            <thead className="border-b border-white/5 bg-white/2 text-slate-400">
              <tr>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'الموظف' : 'Employee'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'الهاتف' : 'Phone'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'القسم' : 'Department'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'المستوى' : 'Level'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'دور النظام' : 'System Role'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'تاريخ التعيين والمدة' : 'Start Date & Tenure'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'أهلية التقييم' : 'Eligibility'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-left' : 'text-right'}`}>{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-400">
                      {language === 'ar' ? 'لم يتم العثور على موظفين مطابقين للبحث.' : 'No matching employees found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const eligibility = CalculationEngine.checkEligibility(
                    emp.startDate,
                    new Date().toISOString(),
                    settings.minEmploymentMonths
                  );

                  const isSenior = emp.level === 'Senior';
                  const isTL = emp.level === 'Team Leader';
                  const isMid = emp.level === 'Mid';
                  
                  const currentEval = evaluations.find(
                    (e) => e.employeeId === emp.id && e.year === selectedYear && e.quarter === selectedQuarter
                  );

                  return (
                    <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>

                      <td className="px-5 py-4 font-mono">
                        {emp.phone ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 border border-white/10">
                            {emp.phone}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-300">{emp.departmentName}</div>
                        <div className="text-[10px] text-slate-500">{emp.role}</div>
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
                          {LEVELS[emp.level] || emp.level}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-300">
                          {ROLES[emp.systemRole]?.label || emp.systemRole}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-300">
                        <div>{emp.startDate}</div>
                        <div className="text-[10px] text-slate-500">
                          {eligibility.tenureMonths} {language === 'ar' ? 'شهر خدمة' : 'months service'}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {eligibility.isEligible ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> {language === 'ar' ? 'مؤهل' : 'Eligible'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                            <AlertCircle className="h-3 w-3" /> {language === 'ar' ? 'غير مؤهل (أقل من شهرين)' : 'Not Eligible (< 2 months)'}
                          </span>
                        )}
                      </td>

                      <td className={`px-5 py-4 ${language === 'ar' ? 'text-left' : 'text-right'} space-x-2`}>
                        {canManageEmployees() && (
                          <>
                            <button
                              id={`btn-edit-emp-${emp.id}`}
                              onClick={() => openEditModal(emp)}
                              className="text-slate-400 hover:text-teal-300 transition-colors p-1"
                              title={language === 'ar' ? 'تعديل الموظف' : 'Edit Employee'}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              id={`btn-del-emp-${emp.id}`}
                              onClick={() => {
                                if (confirm(language === 'ar' ? `هل تريد إزالة ${emp.name} من السجل النشط؟` : `Do you want to remove ${emp.name} from active records?`)) {
                                  deleteEmployee(emp.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                              title={language === 'ar' ? 'حذف الموظف' : 'Delete Employee'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            {(onStartEvaluation || onViewEvaluation) && (
                              <button
                                onClick={() => currentEval && onViewEvaluation ? onViewEvaluation(currentEval.id) : onStartEvaluation?.(emp.id)}
                                className={`text-[10px] px-2 py-1 rounded-lg border font-bold ${
                                  currentEval 
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' 
                                    : 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20'
                                }`}
                              >
                                {currentEval 
                                  ? (language === 'ar' ? 'عرض التقييم' : 'View')
                                  : (language === 'ar' ? 'بدء التقييم' : 'Evaluate')}
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10, 13, 17, 0.85)' }}>
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4"
            style={{ background: 'rgba(10, 13, 17, 0.95)' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingEmp ? (language === 'ar' ? 'تعديل بيانات الموظف' : 'Edit Employee') : (language === 'ar' ? 'إضافة عضو فريق جديد' : 'Add New Team Member')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohammed'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: name@kesraa.com' : 'e.g. name@kesraa.com'}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'كلمة المرور (اختياري)' : 'Password (Optional)'}</label>
                <input
                  type="text"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={language === 'ar' ? 'افتراضي: 123456' : 'Default: 123456'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'القسم' : 'Department'}</label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    disabled={currentUser?.systemRole === 'TEAM_LEADER'}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: أخصائي SEO' : 'e.g. SEO Specialist'}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'المستوى الوظيفي' : 'Employment Level'}</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as EmployeeLevel)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Junior">{language === 'ar' ? 'مبتدئ (Junior)' : 'Junior'}</option>
                    <option value="Mid">{language === 'ar' ? 'متوسط (Mid)' : 'Mid'}</option>
                    <option value="Senior">{language === 'ar' ? 'سينيور (Senior)' : 'Senior'}</option>
                    <option value="Team Leader">{language === 'ar' ? 'قائد فريق (Team Leader)' : 'Team Leader'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'دور صلاحيات النظام' : 'System Role'}</label>
                  <select
                    value={formSystemRole}
                    onChange={(e) => setFormSystemRole(e.target.value as SystemRole)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="EMPLOYEE">{language === 'ar' ? 'موظف (عرض عادي)' : 'Employee (Standard)'}</option>
                    <option value="TEAM_LEADER">{language === 'ar' ? 'قائد فريق (مقيّم)' : 'Team Leader (Evaluator)'}</option>
                    <option value="HR">{language === 'ar' ? 'أخصائي موارد بشرية' : 'HR Specialist'}</option>
                    <option value="CEO">{language === 'ar' ? 'الرئيس التنفيذي' : 'CEO'}</option>
                    <option value="ADMIN">{language === 'ar' ? 'مسؤول النظام' : 'System Admin'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">{language === 'ar' ? 'تاريخ التعيين (لتحديد الأهلية)' : 'Start Date (for eligibility)'}</label>
                <input
                  type="date"
                  required
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-500"
                >
                  {editingEmp ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'إنشاء السجل' : 'Create Record')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
