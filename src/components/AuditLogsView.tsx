import React, { useState } from 'react';
import {
  History,
  Download,
  Upload,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, exportBackup, restoreBackup } = useData();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleExportBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_eval_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (confirm('تحذير: استعادة نسخة احتياطية من قاعدة البيانات ستستبدل الإعدادات وكشوف الدرجات الحالية. هل تريد المتابعة؟')) {
        const res = restoreBackup(content);
        setRestoreStatus(res);
        setTimeout(() => setRestoreStatus(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== 'ALL' && !log.action.includes(actionFilter)) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchActor = log.userName.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      if (!matchActor && !matchDetails && !matchAction) return false;
    }
    return true;
  });

  return (
    <div className="view-shell">
      
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-eyebrow">{t.audit || (language === 'ar' ? 'سجل التدقيق' : 'Audit Logs')}</span>
          <h2 className="font-display text-2xl text-white tracking-tight mt-1">
            {language === 'ar' ? 'سجل نشاط النظام والنسخ الاحتياطي' : 'System Activity & Backups'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar' ? 'تتبع العمليات الهامة، تحميل ملفات النسخ الاحتياطي، ومراجعة التدقيق' : 'Track critical operations, download backups, and review audits'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-600/20 px-4 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-600/40 hover:text-white transition-all shadow-lg"
          >
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تحميل النسخة الاحتياطية' : 'Download Backup'}
          </button>
        </div>
      </div>

      {restoreStatus && (
        <div
          className={`rounded-2xl border p-4 text-xs font-semibold flex items-center gap-2 ${
            restoreStatus.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {restoreStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {restoreStatus.message}
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
            id="input-search-audit"
            type="text"
            placeholder={language === 'ar' ? 'بحث بالاسم، نوع الإجراء، أو التفاصيل...' : 'Search by name, action type, or details...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-xs text-white placeholder-slate-400 focus:border-teal-500/60 focus:outline-none "
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="select-audit-filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none  cursor-pointer"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الإجراءات' : 'All Actions'}</option>
            <option value="EVALUATION">{language === 'ar' ? 'التقييمات وكشوف الدرجات' : 'Evaluations & Scores'}</option>
            <option value="SETTINGS">{language === 'ar' ? 'إعدادات المعادلات والمؤشرات' : 'Formulas & Metrics Settings'}</option>
            <option value="EMPLOYEE">{language === 'ar' ? 'الموظفون والسجلات' : 'Employees & Records'}</option>
            <option value="SYSTEM">{language === 'ar' ? 'النظام والنسخ الاحتياطي' : 'System & Backups'}</option>
          </select>
        </div>
      </div>

      {/* Logs Table in Frosted Container */}
      <div
        className="rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs data-table">
            <thead className="border-b border-white/5 bg-white/2 text-slate-400">
              <tr className="text-slate-500 text-left border-b border-white/5">
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'المستخدم' : 'User'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'العملية (Action)' : 'Action'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'الكيان (Entity)' : 'Entity'}</th>
                <th className={`px-5 py-3.5 font-medium uppercase text-[10px] tracking-widest ${language === 'ar' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'التفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <History className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-400">
                      {language === 'ar' ? 'لا يوجد سجلات نشاط مطابقة.' : 'No audit logs match your search.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className={`px-5 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-400">{log.userRole}</div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-[9px] font-bold text-teal-300 uppercase tracking-wider font-mono">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-300 whitespace-nowrap">
                      {log.targetEntity || 'النظام'}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      <div>{log.details}</div>
                      {log.metadata && (
                        <div className="mt-1 text-[10px] font-mono text-slate-500">
                          المعرّف: {log.entityId || log.id}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
