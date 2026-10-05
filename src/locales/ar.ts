// Centralized Arabic Translations and System Dictionary for KESRA Performance Evaluation System

import {
  SystemRole,
  EmployeeLevel,
  EvaluationStatus,
  EvaluationQuarter,
  KPICategory
} from '../types';

export const ARABIC_ROLES: Record<SystemRole, { label: string; desc: string }> = {
  ADMIN: { label: 'مسؤول النظام', desc: 'صلاحيات كاملة للتحكم في الإعدادات والمؤشرات والبيانات' },
  CEO: { label: 'الرئيس التنفيذي', desc: 'اعتماد التقييمات والاطلاع على لوحات القيادة والتقارير التنفيذية' },
  HR: { label: 'الموارد البشرية', desc: 'إدارة سجلات الموظفين والاعتماد ونشر التقييمات' },
  HEAD_TECHNICAL: { label: 'المدير التقني', desc: 'تقييم جميع الأقسام والفرق والتيم ليدرز وموظفيهم' },
  TEAM_LEADER: { label: 'قائد الفريق', desc: 'تقييم موظفي القسم ورفع كشوف الدرجات للمراجعة' },
  EMPLOYEE: { label: 'موظف', desc: 'عرض التقييم الشخصي وتأكيد الاستلام' },
};

export const ARABIC_LEVELS: Record<EmployeeLevel, string> = {
  Junior: 'مبتدئ (Junior)',
  Mid: 'متوسط (Mid)',
  Senior: 'سينيور (Senior)',
  'Team Leader': 'قائد فريق (Team Leader)',
};

export const ARABIC_STATUSES: Record<EvaluationStatus, { label: string; color: string }> = {
  NOT_STARTED: { label: 'لم يبدأ بعد', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  DRAFT: { label: 'مسودة', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  SUBMITTED_BY_TEAM_LEADER: { label: 'تم الرفع من قائد الفريق', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  UNDER_REVIEW: { label: 'قيد المراجعة', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  REVIEWED: { label: 'تمت المراجعة', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  HR_MANAGEMENT_APPROVED: { label: 'معتمد من الإدارة و HR', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  PUBLISHED: { label: 'تم النشر للموظف', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  EMPLOYEE_VIEWED: { label: 'تم الاطلاع بواسطة الموظف', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  ACKNOWLEDGED: { label: 'تم التأكيد والاعتماد', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
};

export const ARABIC_QUARTERS: Record<EvaluationQuarter, string> = {
  Q1: 'الربع الأول (Q1)',
  Q2: 'الربع الثاني (Q2)',
  Q3: 'الربع الثالث (Q3)',
  Q4: 'الربع الرابع (Q4)',
};

export const ARABIC_CATEGORIES: Record<KPICategory, string> = {
  COMMON: 'المهارات المشتركة الأساسية',
  DEPARTMENT: 'مؤشرات أداء القسم التخصصية',
  LEADERSHIP: 'مؤشرات القيادة وتطوير الفريق',
  MANAGEMENT: 'مؤشرات الحوكمة والإدارة العامة',
};

export const ARABIC_CLASSIFICATIONS: Record<string, { label: string; color: string; desc: string }> = {
  Excellent: {
    label: 'ممتاز',
    color: '#10b981',
    desc: 'يتجاوز التوقعات بشكل مستمر مع إتقان استثنائي وقيادة نموذجية.',
  },
  'Very Good': {
    label: 'جيد جداً',
    color: '#6366f1',
    desc: 'يقدم عملاً عالي الجودة باستمرار مع استقلالية عالية وقدرة ممتازة على حل المشكلات.',
  },
  Good: {
    label: 'جيد',
    color: '#f59e0b',
    desc: 'يحقق المتطلبات الأساسية مع أداء ثابت؛ بحاجة لتطوير طفيف في بعض المهارات.',
  },
  'Needs Improvement': {
    label: 'يحتاج إلى تحسين',
    color: '#f97316',
    desc: 'تذبذب في الأداء أو الالتزام بالمواعيد يستوجب خطة تدريب ومتابعة.',
  },
  'Needs Attention': {
    label: 'يحتاج إلى متابعة دقيقة',
    color: '#ef4444',
    desc: 'قصور ملحوظ في الأداء يؤثر على مخرجات الفريق ويتطلب تدخلاً عاجلاً.',
  },
};

export const t = {
  appName: 'نظام تقييم الأداء المؤسسي',
  companySubtitle: 'إدارة وتقييم الأداء عبر الأقسام السبعة وفق معايير الحوكمة',
  cycle: 'دورة التقييم:',
  
  // Navigation
  dashboard: 'لوحة القيادة',
  evaluations: 'سجل التقييمات',
  employees: 'دليل الموظفين',
  settings: 'الإعدادات والمؤشرات',
  audit: 'سجل التدقيق والنسخ الاحتياطي',
  
  // Dashboard Metrics
  completionRate: 'نسبة اكتمال التقييمات',
  averageScore: 'متوسط أداء الشركة',
  pendingApprovals: 'بانتظار الاعتماد والمراجعة',
  aiAnalytics: 'تحليلات الذكاء الاصطناعي',
  activeEvaluations: 'التقييمات الحالية',
  departmentRankings: 'ترتيب الأقسام والمتصدرين',
  departmentBenchmarks: 'مقارنة متوسط أداء الأقسام',
  classificationDistribution: 'توزيع تصنيفات الأداء',
  auditSnapshot: 'سجل نشاط النظام',
  allDepartments: 'جميع الأقسام',
  records: 'سجل',
  
  // Actions
  newEvaluation: 'بدء تقييم جديد',
  generateAIInsights: 'تحليلات الذكاء الاصطناعي',
  sheetsSync: 'مزامنة مع Google Sheets / CSV',
  exportBackup: 'تصدير نسخة احتياطية كاملة (JSON)',
  restoreBackup: 'استعادة نسخة احتياطية',
  reviewDetails: 'مراجعة التفاصيل',
  editScore: 'تعديل / تسجيل الدرجات',
  view: 'عرض التقييم',
  saveDraft: 'حفظ كمسودة',
  submitToHR: 'إرسال للمراجعة والاعتماد',
  approveEvaluation: 'اعتماد التقييم رسمياً',
  publishToEmployee: 'نشر التقييم للموظف',
  acknowledgeScorecard: 'تأكيد واستلام التقييم',
  addEmployee: 'إضافة موظف جديد',
  editEmployee: 'تعديل بيانات الموظف',
  deleteEmployee: 'حذف الموظف',
  saveChanges: 'حفظ التعديلات',
  cancel: 'إلغاء',
  close: 'إغلاق',
  search: 'بحث بالاسم، المسمى الوظيفي، أو القسم...',
  filterByDepartment: 'تصفية حسب القسم',
  filterByStatus: 'تصفية حسب الحالة',
  
  // Form & Evaluation Terms
  employee: 'الموظف',
  evaluator: 'المقيّم',
  department: 'القسم',
  role: 'المسمى الوظيفي',
  level: 'المستوى الوظيفي',
  tenure: 'مدة الخدمة',
  tenureMonths: 'أشهر',
  eligibilityStatus: 'أهلية التقييم',
  eligible: 'مؤهل للتقييم (أتم شهرين فأكثر)',
  ineligible: 'غير مؤهل (أقل من شهرين بالشركة)',
  finalScore: 'الدرجة النهائية',
  classification: 'التصنيف',
  rank: 'الترتيب بالقسم',
  commonSkills: 'المهارات المشتركة',
  departmentKpis: 'مؤشرات القسم التخصصية',
  leadershipSkills: 'مهارات القيادة',
  strengths: 'أبرز نقاط القوة والإنجازات',
  improvements: 'مجالات التحسين والتطوير',
  developmentPlan: 'خطة العمل والأهداف التطويرية',
  employeeNotes: 'ملاحظات وتأكيد الموظف',
  lockedNotice: 'هذا التقييم معتمد ومؤرشف بشكل نهائي ولا يمكن تعديله.',
  weightSumValid: 'معادلة الأوزان مكتملة وصحيحة 100%',
  weightSumError: 'يوجد خطأ في مجموع أوزان المؤشرات',
  
  // Placeholders & Helpers
  noRecordsFound: 'لا توجد تقييمات مطابقة لخيارات البحث والتصفية المحددة.',
  noEmployeesFound: 'لم يتم العثور على موظفين مطابقين للبحث.',
  select1to10: 'اختر درجة من 1 إلى 10',
  scoringGuide: 'دليل معايير التقييم من 1 إلى 10',
  
  // Login
  loginTitle: 'تسجيل الدخول',
  loginSubtitle: 'نظام الإدارة والتقييم المؤسسي الذكي الموحد',
  emailLabel: 'البريد الإلكتروني',
  passwordLabel: 'كلمة المرور',
  loginButton: 'دخول للنظام',
  loginErrorEmpty: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
  showPassword: 'إظهار كلمة المرور',
  hidePassword: 'إخفاء كلمة المرور',
};
