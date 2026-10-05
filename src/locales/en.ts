import {
  SystemRole,
  EmployeeLevel,
  EvaluationStatus,
  EvaluationQuarter,
  KPICategory
} from '../types';

export const ENGLISH_ROLES: Record<SystemRole, { label: string; desc: string }> = {
  ADMIN: { label: 'System Admin', desc: 'Full permissions to manage settings, KPIs, and data' },
  CEO: { label: 'CEO', desc: 'Approve evaluations and view executive dashboards and reports' },
  HR: { label: 'Human Resources', desc: 'Manage employee records, approve, and publish evaluations' },
  HEAD_TECHNICAL: { label: 'Head Technical', desc: 'Evaluate all departments, teams, team leaders, and employees' },
  TEAM_LEADER: { label: 'Team Leader', desc: 'Evaluate department employees and submit scores for review' },
  EMPLOYEE: { label: 'Employee', desc: 'View personal evaluations and acknowledge receipt' },
};

export const ENGLISH_LEVELS: Record<EmployeeLevel, string> = {
  Junior: 'Junior',
  Mid: 'Mid-Level',
  Senior: 'Senior',
  'Team Leader': 'Team Leader',
};

export const ENGLISH_STATUSES: Record<EvaluationStatus, { label: string; color: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  DRAFT: { label: 'Draft', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
  SUBMITTED_BY_TEAM_LEADER: { label: 'Submitted by Team Leader', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  REVIEWED: { label: 'Reviewed', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  HR_MANAGEMENT_APPROVED: { label: 'Approved by HR & Mgmt', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  PUBLISHED: { label: 'Published to Employee', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  EMPLOYEE_VIEWED: { label: 'Viewed by Employee', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  ACKNOWLEDGED: { label: 'Acknowledged', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
};

export const ENGLISH_QUARTERS: Record<EvaluationQuarter, string> = {
  Q1: 'First Quarter (Q1)',
  Q2: 'Second Quarter (Q2)',
  Q3: 'Third Quarter (Q3)',
  Q4: 'Fourth Quarter (Q4)',
};

export const ENGLISH_CATEGORIES: Record<KPICategory, string> = {
  COMMON: 'Core Common Skills',
  DEPARTMENT: 'Specialized Department KPIs',
  LEADERSHIP: 'Leadership & Team Development',
  MANAGEMENT: 'Governance & General Management',
};

export const ENGLISH_CLASSIFICATIONS: Record<string, { label: string; color: string; desc: string }> = {
  Excellent: {
    label: 'Excellent',
    color: '#10b981',
    desc: 'Consistently exceeds expectations with exceptional mastery and exemplary leadership.',
  },
  'Very Good': {
    label: 'Very Good',
    color: '#6366f1',
    desc: 'Consistently delivers high-quality work with high autonomy and excellent problem-solving.',
  },
  Good: {
    label: 'Good',
    color: '#f59e0b',
    desc: 'Meets basic requirements with consistent performance; needs minor development in some skills.',
  },
  'Needs Improvement': {
    label: 'Needs Improvement',
    color: '#f97316',
    desc: 'Fluctuating performance or punctuality requiring a training plan and follow-up.',
  },
  'Needs Attention': {
    label: 'Needs Attention',
    color: '#ef4444',
    desc: 'Noticeable performance deficiencies affecting team output; requires urgent intervention.',
  },
};

export const tEn = {
  appName: 'Enterprise Performance System',
  companySubtitle: 'Multi-Department Performance Evaluation & Governance',
  cycle: 'Eval Cycle:',
  
  // Navigation
  dashboard: 'Dashboard',
  evaluations: 'Evaluations',
  employees: 'Employees',
  settings: 'Settings & KPIs',
  audit: 'Audit & Backup',
  
  // Dashboard Metrics
  completionRate: 'Completion Rate',
  averageScore: 'Company Average Score',
  pendingApprovals: 'Pending Approvals',
  aiAnalytics: 'AI Analytics',
  activeEvaluations: 'Active Evaluations',
  departmentRankings: 'Department Rankings',
  departmentBenchmarks: 'Department Benchmarks',
  classificationDistribution: 'Classification Distribution',
  auditSnapshot: 'System Activity Snapshot',
  allDepartments: 'All Departments',
  records: 'Records',
  
  // Actions
  newEvaluation: 'New Evaluation',
  generateAIInsights: 'AI Insights',
  sheetsSync: 'Sync with Google Sheets',
  exportBackup: 'Export Backup (JSON)',
  restoreBackup: 'Restore Backup',
  reviewDetails: 'Review Details',
  editScore: 'Edit / Score',
  view: 'View Evaluation',
  saveDraft: 'Save Draft',
  submitToHR: 'Submit for Review',
  approveEvaluation: 'Approve Evaluation',
  publishToEmployee: 'Publish to Employee',
  acknowledgeScorecard: 'Acknowledge Scorecard',
  addEmployee: 'Add Employee',
  editEmployee: 'Edit Employee',
  deleteEmployee: 'Delete Employee',
  saveChanges: 'Save Changes',
  cancel: 'Cancel',
  close: 'Close',
  search: 'Search by name, role, or department...',
  filterByDepartment: 'Filter by Department',
  filterByStatus: 'Filter by Status',
  
  // Form & Evaluation Terms
  employee: 'Employee',
  evaluator: 'Evaluator',
  department: 'Department',
  role: 'Job Role',
  level: 'Job Level',
  tenure: 'Tenure',
  tenureMonths: 'Months',
  eligibilityStatus: 'Eligibility',
  eligible: 'Eligible (2+ months)',
  ineligible: 'Ineligible (< 2 months)',
  finalScore: 'Final Score',
  classification: 'Classification',
  rank: 'Dept Rank',
  commonSkills: 'Common Skills',
  departmentKpis: 'Department KPIs',
  leadershipSkills: 'Leadership Skills',
  strengths: 'Strengths & Achievements',
  improvements: 'Areas for Improvement',
  developmentPlan: 'Development Plan & Goals',
  employeeNotes: 'Employee Notes & Acknowledgment',
  lockedNotice: 'This evaluation is finalized, archived, and cannot be modified.',
  weightSumValid: 'Weight calculation is 100% correct',
  weightSumError: 'Error in total KPI weights',
  
  // Placeholders & Helpers
  noRecordsFound: 'No evaluations match your search and filter criteria.',
  noEmployeesFound: 'No employees found matching your search.',
  select1to10: 'Select score 1 to 10',
  scoringGuide: 'Scoring Guide 1 to 10',
  
  // Login
  loginTitle: 'Login',
  loginSubtitle: 'Unified Smart Enterprise Management & Evaluation System',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  loginButton: 'Login to System',
  loginErrorEmpty: 'Please enter your email and password',
  showPassword: 'Show Password',
  hidePassword: 'Hide Password',
};
