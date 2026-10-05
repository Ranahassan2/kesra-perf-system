import { KPIDefinition } from '../types';

export const ENGLISH_KPIS_2: Record<string, Partial<KPIDefinition>> = {
  // Media Buying
  'kpi-mb-1': {
    name: 'Campaign Performance (ROAS / CPA)',
    description: 'Achieving ROAS, CPA, and client sales targets across advertising platforms.',
    scoringGuide: {
      excellent: '9-10: Exceeds ROAS/CPA targets in >90% of budgets and scales campaigns profitably.',
      good: '7-8: Consistently hits return and cost targets as planned.',
      needsImprovement: '5-6: Declining results in 30-40% of campaigns; slow to pause losing ads.',
      poor: '3-4: Noticeable budget waste on unprofitable ad sets.',
      critical: '1-2: Catastrophic CPA increase or complete failure to manage campaigns.',
    }
  },
  'kpi-mb-2': {
    name: 'Optimization & Decision Making',
    description: 'Speed and accuracy of daily optimizations for bids, audiences, targeting, and funnels.',
    scoringGuide: {
      excellent: '9-10: Daily optimizations based on precise data and statistical analysis.',
      good: '7-8: Regular daily monitoring and logical adjustments to budgets and bids.',
      needsImprovement: '5-6: Late optimization decisions and slow reactions to declining results.',
      poor: '3-4: Random adjustments without data backing, confusing platform algorithms.',
      critical: '1-2: Leaving campaigns for days without monitoring or optimization.',
    }
  },
  'kpi-mb-3': {
    name: 'Tracking & Data Accuracy (Pixel, CAPI, UTMs)',
    description: 'Integrity of UTM structures, Pixel/CAPI setups, GA4 events, and attribution.',
    scoringGuide: {
      excellent: '9-10: Comprehensive, error-free tracking with advanced CAPI and precise attribution.',
      good: '7-8: Disciplined UTM links and properly functioning pixels with no gaps.',
      needsImprovement: '5-6: Broken tracking links or misconfigured conversion events discovered late.',
      poor: '3-4: Repeatedly launching ads with missing tracking or wrong landing pages.',
      critical: '1-2: Complete tracking failure corrupting client data and reports.',
    }
  },
  'kpi-mb-4': {
    name: 'Budget Pacing & Control',
    description: 'Distributing and controlling daily/monthly ad spend without unauthorized overspend or underspend.',
    scoringGuide: {
      excellent: '9-10: 100% accuracy in budget pacing, optimally utilizing peak sales days.',
      good: '7-8: Spending within +/- 3% of the approved monthly budget.',
      needsImprovement: '5-6: Spending variance (+/- 10%), running out of budget early, or spending too slowly.',
      poor: '3-4: Unauthorized overspending on client accounts and cards.',
      critical: '1-2: Severe budget overspend causing financial liabilities for the company.',
    }
  },
  'kpi-mb-5': {
    name: 'A/B Testing & Angles',
    description: 'Continuous testing of ad hooks, creative formats, and providing new design briefs.',
    scoringGuide: {
      excellent: '9-10: Rigorous testing methodology constantly discovering new winning ad angles.',
      good: '7-8: Tests 3-5 new ad angles weekly and provides clear creative briefs.',
      needsImprovement: '5-6: Relies on old designs for weeks without renewal or systematic testing.',
      poor: '3-4: No initiative to test new ideas; just reactivates failed ads.',
      critical: '1-2: Complete lack of innovation or ad creative testing.',
    }
  },
  'kpi-mb-6': {
    name: 'Reporting & Insights',
    description: 'Clarity, accuracy, and timeliness of campaign reports with deep strategic insights.',
    scoringGuide: {
      excellent: '9-10: Delivers stunning analytical reports connecting data to next steps early.',
      good: '7-8: Accurate weekly and monthly reports delivered on time regularly.',
      needsImprovement: '5-6: Generic reports that just list numbers without strategic interpretation.',
      poor: '3-4: Late reports or containing calculation errors.',
      critical: '1-2: Fails to deliver campaign reports entirely.',
    }
  },
  'kpi-mb-7': {
    name: 'Pressure Management (Events & Crises)',
    description: 'Stability during ad account bans, major sales seasons (e.g., Black Friday), and emergencies.',
    scoringGuide: {
      excellent: '9-10: Resolves bans and high-pressure seasons calmly and exceptionally fast.',
      good: '7-8: Professionally manages urgent launches and ad policy issues.',
      needsImprovement: '5-6: Rushes and makes mistakes when working under tight deadlines.',
      poor: '3-4: Severe confusion; ignores ad account warnings during peak seasons.',
      critical: '1-2: Total inability to function during campaign emergencies.',
    }
  },
  
  // SEO
  'kpi-seo-1': {
    name: 'Organic Traffic & Rankings',
    description: 'Growth in organic traffic, ranking for competitive keywords, and achieving client goals.',
    scoringGuide: {
      excellent: '9-10: Ranks #1 for competitive commercial keywords; traffic growth >30%.',
      good: '7-8: Steady positive progress in rankings and consistent organic traffic growth.',
      needsImprovement: '5-6: Stagnant keyword rankings; slow to adapt to algorithm updates.',
      poor: '3-4: Traffic drop due to neglecting periodic optimizations.',
      critical: '1-2: Site hit by Google penalties or severe drop due to bad practices.',
    }
  },
  'kpi-seo-2': {
    name: 'Strategy & Execution',
    description: 'Building keyword maps, content plans, and executing On-Page optimizations.',
    scoringGuide: {
      excellent: '9-10: Comprehensive SEO strategies aligning with search intent and customer journey.',
      good: '7-8: Sound strategy executed systematically across assigned projects.',
      needsImprovement: '5-6: Random task execution without a cohesive strategic plan.',
      poor: '3-4: Outdated keyword stuffing or complete misunderstanding of search intent.',
      critical: '1-2: Complete absence of an SEO action plan for projects.',
    }
  },
  'kpi-seo-3': {
    name: 'Technical SEO & Content Quality',
    description: 'Site architecture, Core Web Vitals, Schema markup, and E-E-A-T content quality.',
    scoringGuide: {
      excellent: '9-10: Technical health >95%, flawless Schema, and highly authoritative content.',
      good: '7-8: Regularly fixes crawl errors, maintaining good technical/content quality.',
      needsImprovement: '5-6: Presence of broken 404 links, slow speed, or thin content.',
      poor: '3-4: Accumulation of technical issues left unaddressed for long periods.',
      critical: '1-2: Introducing fatal technical errors like blocking pages from indexing (noindex).',
    }
  },
  'kpi-seo-4': {
    name: 'Audits & Analysis',
    description: 'Competitor gap analysis, capturing SERP opportunities, and delivering professional audits.',
    scoringGuide: {
      excellent: '9-10: Deep technical/strategic audits finding high-ROI growth opportunities.',
      good: '7-8: Regular competitor analysis providing actionable, practical recommendations.',
      needsImprovement: '5-6: Repetitive, generic audit reports copied directly from tools.',
      poor: '3-4: Misreading data leading to useless optimization recommendations.',
      critical: '1-2: Complete failure to conduct analysis or site audits.',
    }
  },
  'kpi-seo-5': {
    name: 'SEO Development & Tech Fixes',
    description: 'Applying code changes to CMS, source code, and website plugins.',
    scoringGuide: {
      excellent: '9-10: Applies advanced Schema, speed fixes, and programmatic SEO solutions flawlessly.',
      good: '7-8: Applies technical recommendations and code tweaks smoothly without errors.',
      needsImprovement: '5-6: Slow in implementing approved technical recommendations for sites.',
      poor: '3-4: Breaking page layouts or code when making SEO adjustments.',
      critical: '1-2: Causing site downtime due to unsafe code modifications.',
    }
  },
  'kpi-seo-6': {
    name: 'Reporting & Delivery',
    description: 'Clarity of organic performance reports, GSC data, and timely keyword ranking updates.',
    scoringGuide: {
      excellent: '9-10: Interactive visual reports tying SEO to client revenue, delivered early.',
      good: '7-8: Clear, accurate monthly reports delivered on schedule.',
      needsImprovement: '5-6: Reports lack core tracking metrics or are delivered late.',
      poor: '3-4: Vague reports unable to explain keyword movement.',
      critical: '1-2: Failure to deliver monthly SEO reports to clients.',
    }
  },
  'kpi-seo-7': {
    name: 'Pressure Management (Updates & Migrations)',
    description: 'Handling major Google updates, ranking volatility, and urgent site migrations.',
    scoringGuide: {
      excellent: '9-10: Objective, rapid diagnosis of algo updates; reassures clients with data.',
      good: '7-8: Calm and methodical focus during sensitive site migrations and developments.',
      needsImprovement: '5-6: Rushing into uncalculated changes during temporary updates.',
      poor: '3-4: Inability to manage client anxiety during search result volatility.',
      critical: '1-2: Abandoning tasks and shirking responsibility when facing technical hurdles.',
    }
  },
  // Leadership
  'kpi-ld-1': {
    name: 'Team Development & Coaching',
    description: 'Developing team members, coaching, and elevating their performance levels.',
    scoringGuide: {
      excellent: '9-10: Continuously mentors team, clear skill progression visible in members.',
      good: '7-8: Provides regular feedback and supports team skill growth.',
      needsImprovement: '5-6: Focuses only on tasks, neglecting team members\' career growth.',
      poor: '3-4: Demotivates the team or fails to provide constructive feedback.',
      critical: '1-2: Toxic leadership causing high team turnover.',
    }
  },
  'kpi-ld-2': {
    name: 'Strategic Planning & Vision',
    description: 'Setting clear goals, department roadmaps, and aligning with company objectives.',
    scoringGuide: {
      excellent: '9-10: Exceptional visionary planning driving massive department growth.',
      good: '7-8: Solid planning aligned with company goals, regularly updated.',
      needsImprovement: '5-6: Short-sighted planning; reactive rather than proactive.',
      poor: '3-4: Constant chaos due to lack of any departmental roadmap.',
      critical: '1-2: Destructive decisions harming the company\'s strategic direction.',
    }
  },
  'kpi-ld-3': {
    name: 'Operational Efficiency',
    description: 'Optimizing workflows, removing bottlenecks, and ensuring smooth operations.',
    scoringGuide: {
      excellent: '9-10: Flawless operations, highly automated and incredibly efficient.',
      good: '7-8: Smooth operations, handles bottlenecks quickly and effectively.',
      needsImprovement: '5-6: Occasional workflow breakdowns or inefficiencies tolerated.',
      poor: '3-4: Department is constantly disorganized and missing deadlines.',
      critical: '1-2: Complete operational collapse under their leadership.',
    }
  },
  // Head Technical
  'kpi-ht-1': {
    name: 'Cross-Department Technical Leadership',
    description: 'Guiding technical decisions across multiple departments and ensuring tech harmony.',
    scoringGuide: {
      excellent: '9-10: Masterfully orchestrates tech across all teams, driving massive innovation.',
      good: '7-8: Good coordination between departments on technical matters.',
      needsImprovement: '5-6: Siloed approach; struggles to align different technical teams.',
      poor: '3-4: Creates technical conflicts between departments.',
      critical: '1-2: Complete failure to lead the technical direction of the company.',
    }
  }
};
