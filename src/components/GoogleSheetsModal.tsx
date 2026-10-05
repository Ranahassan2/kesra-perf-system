import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Employee, Evaluation } from '../types';

interface GoogleSheetsModalProps {
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  onClose,
}) => {
  const { employees, evaluations, departments, selectedQuarter, selectedYear, saveEmployee } = useData();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [csvInput, setCsvInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Helper to convert evaluations to CSV
  const generateEvaluationsCSV = () => {
    const headers = language === 'ar' ? [
      'رقم التقييم',
      'اسم الموظف',
      'القسم',
      'المسمى الوظيفي',
      'المستوى',
      'الربع',
      'السنة',
      'المهارات المشتركة (40)',
      'درجة القسم (60/40)',
      'درجة القيادة (20)',
      'الدرجة النهائية (100)',
      'التصنيف',
      'الترتيب بالقسم',
      'الحالة',
      'المقيّم',
      'النسخة',
    ] : [
      'Evaluation ID',
      'Employee Name',
      'Department',
      'Role',
      'Level',
      'Quarter',
      'Year',
      'Common Skills (40)',
      'Department Score (60/40)',
      'Leadership Score (20)',
      'Final Score (100)',
      'Classification',
      'Department Rank',
      'Status',
      'Evaluator',
      'Version',
    ];

    const rows = evaluations.map((e) => [
      e.id,
      `"${e.employeeName}"`,
      `"${e.departmentName}"`,
      `"${e.role}"`,
      `"${e.level}"`,
      e.quarter,
      e.year,
      e.commonScore,
      e.departmentScore,
      e.leadershipScore || 0,
      e.finalScore,
      `"${e.classification}"`,
      e.departmentRank || '',
      e.status,
      `"${e.evaluatorName}"`,
      e.version,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  // Helper to convert employees roster to CSV
  const generateEmployeesCSV = () => {
    const headers = language === 'ar' ? [
      'رقم الموظف',
      'الاسم',
      'البريد الإلكتروني',
      'الهاتف',
      'رقم القسم',
      'اسم القسم',
      'المسمى الوظيفي',
      'المستوى',
      'تاريخ التعيين',
      'قائد الفريق',
      'دور النظام',
      'نشط',
    ] : [
      'Employee ID',
      'Name',
      'Email',
      'Phone',
      'Department ID',
      'Department Name',
      'Role',
      'Level',
      'Hire Date',
      'Team Leader',
      'System Role',
      'Active',
    ];

    const rows = employees.map((emp) => [
      emp.id,
      `"${emp.name}"`,
      `"${emp.email}"`,
      `"${emp.phone || ''}"`,
      emp.departmentId,
      `"${emp.departmentName}"`,
      `"${emp.role}"`,
      `"${emp.level}"`,
      emp.startDate,
      `"${emp.teamLeaderName || ''}"`,
      emp.systemRole,
      emp.isActive ? 'TRUE' : 'FALSE',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleDownloadEvaluations = () => {
    const csv = generateEvaluationsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Performance_Evaluations_${selectedQuarter}_${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadEmployees = () => {
    const csv = generateEmployeesCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Company_Employees_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = () => {
    if (!csvInput.trim()) return;

    try {
      const lines = csvInput.trim().split('\n');
      if (lines.length < 2) throw new Error(language === 'ar' ? 'يجب أن يحتوي ملف CSV على صف عناوين وسجل واحد على الأقل.' : 'CSV file must contain a header row and at least one record.');

      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 3) {
          const name = parts[0] || (language === 'ar' ? `موظف ${Date.now()}` : `Employee ${Date.now()}`);
          const email = parts[1] || `employee_${Date.now()}@company.com`;
          const deptName = parts[2] || (language === 'ar' ? 'إدارة الحسابات' : 'Finance');
          const role = parts[3] || (language === 'ar' ? 'عضو فريق' : 'Team Member');
          const level = (parts[4] as any) || 'Mid';
          const startDate = parts[5] || '2024-01-01';

          const dept =
            departments.find((d) => d.name.toLowerCase() === deptName.toLowerCase()) ||
            departments[0];

          saveEmployee({
            id: `emp-imp-${Date.now()}-${i}`,
            name,
            email,
            departmentId: dept.id,
            departmentName: dept.name,
            role,
            level,
            startDate,
            teamLeaderName: dept.teamLeaderName,
            systemRole: 'EMPLOYEE',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          importedCount++;
        }
      }

      setImportStatus({
        success: true,
        message: language === 'ar' ? `تم تحليل وتسجيل ${importedCount} موظف بنجاح من ملف CSV.` : `Successfully parsed and recorded ${importedCount} employees from CSV file.`,
      });
      setCsvInput('');
      setTimeout(() => setImportStatus(null), 5000);
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: language === 'ar' ? `فشل تحليل ملف CSV: ${err.message || 'بنية أعمدة غير صحيحة'}` : `Failed to parse CSV file: ${err.message || 'Incorrect column structure'}`,
      });
    }
  };

  const syncAppScriptExample = `// Google Apps Script for 2-way Performance Evaluation Sync
function syncEvaluationsToSheet() {
  var url = "${window.location.origin}/api/evaluations?quarter=${selectedQuarter}&year=${selectedYear}";
  var response = UrlFetchApp.fetch(url);
  var json = JSON.parse(response.getContentText());
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Format columns and append live scorecard snapshot
  sheet.clear();
  sheet.appendRow(["ID", "Name", "Department", "Role", "Level", "Final Score", "Classification", "Status"]);
  
  json.evaluations.forEach(function(item) {
    sheet.appendRow([item.id, item.employeeName, item.departmentName, item.role, item.level, item.finalScore, item.classification, item.status]);
  });
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(10, 13, 17, 0.85)' }}>
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-white/10 my-8 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        style={{ background: 'rgba(10, 13, 17, 0.95)' }}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-white text-base">
                {language === 'ar' ? 'مزامنة بيانات Google Sheets و CSV' : 'Google Sheets & CSV Data Synchronization'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' 
                  ? 'استيراد جماعي لسجلات الموظفين، تحميل كشوف الدرجات، أو إعداد مزامنة تلقائية عبر Google Apps Script'
                  : 'Bulk import employee records, download scorecards, or setup automatic sync via Google Apps Script'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation (Frosted Pills) */}
        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'EXPORT'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            {language === 'ar' ? 'تصدير إلى CSV / Sheets' : 'Export to CSV / Sheets'}
          </button>

          <button
            onClick={() => setActiveTab('IMPORT')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'IMPORT'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            {language === 'ar' ? 'استيراد جماعي CSV' : 'Bulk CSV Import'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          
          {importStatus && (
            <div
              className={`rounded-2xl border p-4 font-semibold flex items-center gap-2 ${
                importStatus.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {importStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />}
              {importStatus.message}
            </div>
          )}

          {activeTab === 'EXPORT' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl border border-white/10 p-5 space-y-3"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <h3 className="font-bold text-white text-sm">
                  {language === 'ar' ? '1. تحميل نتائج التقييم الفصلي' : '1. Download Quarterly Evaluation Results'}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'ar' ? 'تصدير تفاصيل كشف الدرجات الكامل لـ' : 'Export full scorecard details for'} <strong className="text-emerald-400">{selectedQuarter} {selectedYear}</strong>{language === 'ar' ? '، متضمناً المهارات المشتركة، مؤشرات القسم، درجات القيادة، والتصنيفات النهائية.' : ', including common skills, department KPIs, leadership scores, and final classifications.'}
                </p>
                <button
                  id="btn-export-evals-csv"
                  onClick={handleDownloadEvaluations}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-600 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500"
                >
                  <Download className="h-4 w-4" />
                  {language === 'ar' ? `تحميل كشوف الدرجات CSV (${evaluations.length} سجل)` : `Download Scorecards CSV (${evaluations.length} records)`}
                </button>
              </div>

              <div
                className="rounded-2xl border border-white/10 p-5 space-y-3"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <h3 className="font-bold text-white text-sm">
                  {language === 'ar' ? '2. تحميل دليل الموظفين النشطين' : '2. Download Active Employee Directory'}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'ar' ? 'تصدير دليل الشركة متضمناً أقسام الموظفين، المسميات الوظيفية، تواريخ التعيين، وتعيينات المراجعين.' : 'Export company directory including employee departments, roles, hire dates, and reviewer assignments.'}
                </p>
                <button
                  id="btn-export-employees-csv"
                  onClick={handleDownloadEmployees}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/15"
                >
                  <Download className="h-4 w-4" />
                  {language === 'ar' ? `تحميل دليل الموظفين (${employees.length} موظف)` : `Download Directory (${employees.length} employees)`}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'IMPORT' && (
            <div className="space-y-4">
              <div
                className="rounded-2xl border border-white/10 p-5 space-y-3"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <h3 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'الصق سجلات CSV للاستيراد الجماعي للموظفين' : 'Paste CSV records for bulk employee import'}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {language === 'ar' ? 'الصيغة:' : 'Format:'} <code>{language === 'ar' ? 'الاسم، البريد الإلكتروني، القسم، المسمى الوظيفي، المستوى، تاريخ التعيين (YYYY-MM-DD)' : 'Name, Email, Department, Role, Level, Hire Date (YYYY-MM-DD)'}</code>
                </p>

                <textarea
                  rows={6}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`Jordan Pierce, jordan.p@company.com, Creative, Senior Designer, Senior, 2023-05-12\nAlex Morgan, alex.m@company.com, Media Buying, Campaign Specialist, Mid, 2024-02-01`}
                  className="w-full font-mono rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    id="btn-submit-csv-import"
                    onClick={handleImportCSV}
                    disabled={!csvInput.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-600 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {language === 'ar' ? 'معالجة واستيراد CSV' : 'Process and Import CSV'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-white/10 px-6 py-4" style={{ background: 'rgba(10, 13, 17, 0.95)' }}>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
