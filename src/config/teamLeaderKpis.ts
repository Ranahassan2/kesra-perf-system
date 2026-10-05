import { KPIDefinition } from '../types';

const defaultScoringGuide = {
  excellent: '9-10: Excellent performance',
  good: '7-8: Good performance',
  needsImprovement: '5-6: Needs improvement',
  poor: '3-4: Poor performance',
  critical: '1-2: Critical performance issues'
};

export const TL_COMMON_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-c1', name: 'Attendance & Punctuality', category: 'COMMON', weight: 3, description: 'Attendance & Punctuality', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c2', name: 'Deadline Commitment', category: 'COMMON', weight: 2, description: 'Deadline Commitment', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c3', name: 'Quality of Work', category: 'COMMON', weight: 2, description: 'Quality of Work', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c4', name: 'Communication', category: 'COMMON', weight: 2, description: 'Communication', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c5', name: 'Problem Solving', category: 'COMMON', weight: 2, description: 'Problem Solving', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c6', name: 'Teamwork', category: 'COMMON', weight: 1, description: 'Teamwork', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c7', name: 'Initiative', category: 'COMMON', weight: 1, description: 'Initiative', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c8', name: 'Process & Rules Compliance', category: 'COMMON', weight: 1, description: 'Process & Rules Compliance', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-c9', name: 'Responsiveness & Follow-up', category: 'COMMON', weight: 1, description: 'Responsiveness & Follow-up', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const TL_LEADERSHIP_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-l1', name: 'Team Performance & KPI Ownership', category: 'LEADERSHIP', weight: 7, description: 'Team Performance & KPI Ownership', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l2', name: 'Team Follow-up & Accountability', category: 'LEADERSHIP', weight: 6, description: 'Team Follow-up & Accountability', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l3', name: 'People Development & Coaching', category: 'LEADERSHIP', weight: 6, description: 'People Development & Coaching', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l4', name: 'Delegation & Workload Management', category: 'LEADERSHIP', weight: 5, description: 'Delegation & Workload Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l5', name: 'Problem Management & Escalation', category: 'LEADERSHIP', weight: 5, description: 'Problem Management & Escalation', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l6', name: 'Planning & Prioritization', category: 'LEADERSHIP', weight: 4, description: 'Planning & Prioritization', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l7', name: 'Reporting & Documentation', category: 'LEADERSHIP', weight: 5, description: 'Reporting & Documentation', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l8', name: 'Cross-Department Coordination', category: 'LEADERSHIP', weight: 4, description: 'Cross-Department Coordination', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l9', name: 'Process Ownership & Improvement', category: 'LEADERSHIP', weight: 4, description: 'Process Ownership & Improvement', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-l10', name: 'Leadership Judgment & Decision Making', category: 'LEADERSHIP', weight: 4, description: 'Leadership Judgment & Decision Making', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const TL_AM_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-am1', name: 'Personal Client Management', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 6, description: 'Personal Client Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am2', name: 'Client Retention & Renewals', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 5, description: 'Client Retention & Renewals', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am3', name: 'Client Communication & Relationship Management', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Client Communication & Relationship Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am4', name: 'Client Briefs & Requirement Management', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Client Briefs & Requirement Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am5', name: 'Client Problem Solving & Escalation', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Client Problem Solving & Escalation', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am6', name: 'Account Growth / Revenue Opportunities', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Account Growth / Revenue Opportunities', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am7', name: 'Quality of Account Management & Deliverables', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Quality of Account Management & Deliverables', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-am8', name: 'Timeliness & Accuracy of Reports / Updates', category: 'DEPARTMENT', departmentId: 'dept-am', weight: 4, description: 'Timeliness & Accuracy of Reports / Updates', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const TL_MB_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-mb1', name: 'Performance of Personally Managed Accounts', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 6, description: 'Performance of Personally Managed Accounts', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb2', name: 'Campaign Performance & Optimization', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 6, description: 'Campaign Performance & Optimization', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb3', name: 'Tracking & Attribution', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 5, description: 'Tracking & Attribution', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb4', name: 'Strategy, Testing & Scaling', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 5, description: 'Strategy, Testing & Scaling', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb5', name: 'Budget Management', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 4, description: 'Budget Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb6', name: 'Problem Solving & Account Recovery', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 3, description: 'Problem Solving & Account Recovery', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb7', name: 'Quality of Analysis & Recommendations', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 3, description: 'Quality of Analysis & Recommendations', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-mb8', name: 'Reporting & Follow-up', category: 'DEPARTMENT', departmentId: 'dept-mb', weight: 3, description: 'Reporting & Follow-up', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const TL_SEO_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-seo1', name: 'Performance of Personally Managed Accounts', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 6, description: 'Performance of Personally Managed Accounts', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo2', name: 'SEO Strategy & Execution', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 6, description: 'SEO Strategy & Execution', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo3', name: 'Technical & On-Page SEO', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 5, description: 'Technical & On-Page SEO', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo4', name: 'Off-Page / Backlink Strategy & Quality', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 4, description: 'Off-Page / Backlink Strategy & Quality', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo5', name: 'Keyword & Content Strategy', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 4, description: 'Keyword & Content Strategy', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo6', name: 'Website / SEO Problem Solving', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 3, description: 'Website / SEO Problem Solving', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo7', name: 'Quality of SEO Analysis & Recommendations', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 3, description: 'Quality of SEO Analysis & Recommendations', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-seo8', name: 'SEO Reports & Follow-up', category: 'DEPARTMENT', departmentId: 'dept-seo', weight: 4, description: 'SEO Reports & Follow-up', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const TL_SM_KPIS: KPIDefinition[] = [
  { id: 'kpi-tl-sm1', name: 'Performance of Personally Managed Accounts', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 6, description: 'Performance of Personally Managed Accounts', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm2', name: 'Social Media Strategy & Planning', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 5, description: 'Social Media Strategy & Planning', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm3', name: 'Content Quality & Ideas', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 5, description: 'Content Quality & Ideas', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm4', name: 'Content Performance & Insights', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 5, description: 'Content Performance & Insights', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm5', name: 'Client / Account Understanding & Management', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 4, description: 'Client / Account Understanding & Management', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm6', name: 'Problem Solving & Handling Account Challenges', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 3, description: 'Problem Solving & Handling Account Challenges', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm7', name: 'Quality of Briefs, Plans & Recommendations', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 4, description: 'Quality of Briefs, Plans & Recommendations', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
  { id: 'kpi-tl-sm8', name: 'Reporting & Follow-up', category: 'DEPARTMENT', departmentId: 'dept-sm', weight: 3, description: 'Reporting & Follow-up', scoringGuide: defaultScoringGuide, isActive: true, isForTeamLeader: true },
];

export const ALL_TL_DEPARTMENT_KPIS = [
  ...TL_AM_KPIS,
  ...TL_MB_KPIS,
  ...TL_SEO_KPIS,
  ...TL_SM_KPIS,
];
