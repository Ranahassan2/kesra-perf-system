import { KPIDefinition } from '../types';

export const ENGLISH_KPIS: Record<string, Partial<KPIDefinition>> = {
  // Common KPIs
  'kpi-comm-1': {
    name: 'Attendance & Punctuality',
    description: 'Measures adherence to work hours, attendance discipline, and reliability in following schedules.',
    scoringGuide: {
      excellent: '9-10: 100% adherence to hours, zero unapproved absences, always prepared before meetings.',
      good: '7-8: High discipline, very rare delays with prior notice.',
      needsImprovement: '5-6: Occasional unjustified delays (2-3 times/month), late to team/client meetings.',
      poor: '3-4: Frequent delays or sudden absences that disrupt the team schedule.',
      critical: '1-2: Repeated unexcused absences or no-shows without prior notice.',
    }
  },
  'kpi-comm-2': {
    name: 'Deadline Commitment',
    description: 'Measures timely delivery of tasks and proactive communication regarding any obstacles.',
    scoringGuide: {
      excellent: '9-10: Perfect delivery of 100% of tasks on or before deadlines; early notice of obstacles with solutions.',
      good: '7-8: Regular adherence to deadlines; at least 24h notice for unavoidable delays.',
      needsImprovement: '5-6: Delay in non-critical tasks; reporting delays only after the deadline has passed.',
      poor: '3-4: Repeated delays that bottleneck colleagues\' work.',
      critical: '1-2: Complete disregard for deadlines and failure to deliver core tasks.',
    }
  },
  'kpi-comm-3': {
    name: 'Quality of Work',
    description: 'Measures output accuracy, completeness, error-free rate, and alignment with professional standards.',
    scoringGuide: {
      excellent: '9-10: Highly accurate, fully complete work ready for clients without any revisions.',
      good: '7-8: High quality level needing only minor formatting tweaks.',
      needsImprovement: '5-6: Contains avoidable errors or incomplete data requiring manager corrections.',
      poor: '3-4: Fundamental recurring errors requiring complete rework.',
      critical: '1-2: Unacceptable quality causing client complaints or project failure.',
    }
  },
  'kpi-comm-4': {
    name: 'Communication',
    description: 'Measures message clarity, tact, response time, and constructive interaction with teams/clients.',
    scoringGuide: {
      excellent: '9-10: Extremely clear, professional, concise, and considerate communication in all forms.',
      good: '7-8: Professional and swift communication, keeping stakeholders updated.',
      needsImprovement: '5-6: Unclear messages, slow internal responses, or a defensive tone.',
      poor: '3-4: Poor communication causing misunderstandings and mismatched expectations.',
      critical: '1-2: Inappropriate behavior, unresponsiveness, or instigating conflicts.',
    }
  },
  'kpi-comm-5': {
    name: 'Problem Solving',
    description: 'Ability to identify issues, analyze root causes, and propose practical, effective solutions.',
    scoringGuide: {
      excellent: '9-10: Anticipates obstacles and provides documented, well-thought-out solutions with alternatives.',
      good: '7-8: Independently handles daily/medium issues and offers practical ideas.',
      needsImprovement: '5-6: Escalates minor issues without attempting to diagnose or suggest solutions.',
      poor: '3-4: Difficulty identifying root causes; repeatedly applying ineffective fixes.',
      critical: '1-2: Ignores problems or shifts blame when errors occur.',
    }
  },
  'kpi-comm-6': {
    name: 'Teamwork & Collaboration',
    description: 'Cooperation with peers, supporting team members, and contributing positively to the work environment.',
    scoringGuide: {
      excellent: '9-10: Inspires the team, actively removes obstacles for peers, shares knowledge generously.',
      good: '7-8: Cooperative and positive, actively participates in group tasks.',
      needsImprovement: '5-6: Works in silos; hesitates to help peers under pressure.',
      poor: '3-4: Creates friction or resists collaboration.',
      critical: '1-2: Undermines team morale, toxic behavior, or obstructing teamwork.',
    }
  },
  'kpi-comm-7': {
    name: 'Initiative & Innovation',
    description: 'Proactive behavior, suggesting improvements, and self-driven desire to improve without being asked.',
    scoringGuide: {
      excellent: '9-10: Proposes major innovations, builds new tools/templates, initiates self-improvement.',
      good: '7-8: Self-motivated, offers practical suggestions to improve workflows.',
      needsImprovement: '5-6: Strictly executes what is asked; waits for step-by-step instructions.',
      poor: '3-4: Completely passive; avoids new challenges.',
      critical: '1-2: Zero interest in development or team progress.',
    }
  },
  'kpi-comm-8': {
    name: 'SOPs & Process Compliance',
    description: 'Adherence to company policies, operational manuals, and approved task management workflows.',
    scoringGuide: {
      excellent: '9-10: Role model in compliance; contributes to documenting company standards.',
      good: '7-8: Accurately follows protocols, task boards, and archiving systems.',
      needsImprovement: '5-6: Skips steps or neglects updating project boards.',
      poor: '3-4: Frequently violates guidelines causing data discrepancies.',
      critical: '1-2: Intentional circumvention of company security or operational rules.',
    }
  },
  'kpi-comm-9': {
    name: 'Responsiveness & Follow-up',
    description: 'Speed of reacting to messages and continuous follow-up on tasks/inquiries until full closure.',
    scoringGuide: {
      excellent: '9-10: Immediate follow-up and closure of all tasks; leaves no message pending.',
      good: '7-8: Organized follow-up; responds within agreed timeframes.',
      needsImprovement: '5-6: Requires reminders to reply or confirm task completion.',
      poor: '3-4: Neglects pending tasks and leaves inquiries unanswered.',
      critical: '1-2: Complete lack of response causing loss of clients or business opportunities.',
    }
  },
  // Account Management
  'kpi-am-1': {
    name: 'Retention & Renewals',
    description: 'Maintaining client portfolios and successfully renewing annual and monthly contracts.',
    scoringGuide: {
      excellent: '9-10: Retention rate >95%, early renewals with exceptional client loyalty and praise.',
      good: '7-8: Retention rate 85-94%, smooth contract renewals as planned.',
      needsImprovement: '5-6: Retention rate 70-84%, accounts at risk due to poor communication.',
      poor: '3-4: Retention rate <70%, losing accounts that could have been saved.',
      critical: '1-2: Massive client loss due to complete neglect of relationship management.'
    }
  },
  'kpi-am-2': {
    name: 'Upselling & Growth',
    description: 'Increasing revenue from current accounts through upselling and expanding services.',
    scoringGuide: {
      excellent: '9-10: Exceeds quarterly upselling target by >20% and unlocks new services.',
      good: '7-8: Achieves 100% of quarterly upselling targets.',
      needsImprovement: '5-6: Achieves 60-80% of targets, rarely proposes service expansion.',
      poor: '3-4: Achieves <60%, passive approach just taking orders.',
      critical: '1-2: Complete lack of commercial initiative; current accounts shrinking.'
    }
  },
  'kpi-am-3': {
    name: 'Client Satisfaction & Health',
    description: 'Client satisfaction levels, relationship quality, and speed of handling challenges.',
    scoringGuide: {
      excellent: '9-10: Client satisfaction >9/10; viewed as an indispensable strategic consultant.',
      good: '7-8: High client satisfaction with a positive, stable professional relationship.',
      needsImprovement: '5-6: Recurring client feedback or dissatisfaction regarding expectation clarity.',
      poor: '3-4: Frequent escalation of client complaints to top management.',
      critical: '1-2: Severe client anger threatening immediate contract termination.'
    }
  },
  'kpi-am-4': {
    name: 'Account Performance',
    description: 'Monitoring campaign performance KPIs and ensuring alignment with client business goals.',
    scoringGuide: {
      excellent: '9-10: Leads accounts to consistently achieve the highest ROI and business performance.',
      good: '7-8: Achieves agreed-upon performance standards and targets.',
      needsImprovement: '5-6: Inconsistent performance tracking; slow to address declining results.',
      poor: '3-4: Continuous failure to meet Service Level Agreements (SLAs).',
      critical: '1-2: Complete absence of tracking client results and outputs.'
    }
  },
  'kpi-am-5': {
    name: 'Client Reporting',
    description: 'Accuracy and completeness of performance reports, and punctuality in delivery and discussion.',
    scoringGuide: {
      excellent: '9-10: Flawless executive reports delivered early with actionable strategic recommendations.',
      good: '7-8: Clear and accurate reports delivered consistently on time.',
      needsImprovement: '5-6: Reports contain errors or are delivered past the deadline.',
      poor: '3-4: Superficial or misleading reports lacking analysis and insight.',
      critical: '1-2: Failure to deliver reports or providing incorrect data.'
    }
  },
  'kpi-am-6': {
    name: 'Internal Coordination',
    description: 'Efficiency of writing briefs and seamless coordination with Media Buying, Design, SEO, and AI teams.',
    scoringGuide: {
      excellent: '9-10: Clear, comprehensive, motivating briefs that create harmony and exceptional execution speed.',
      good: '7-8: Effective and smooth coordination with execution teams without conflicts.',
      needsImprovement: '5-6: Vague briefs causing repeated inquiries and delivery delays.',
      poor: '3-4: Incorrect transfer of client requests, blaming execution teams.',
      critical: '1-2: Breakdown of internal coordination causing failure to deliver client requirements.'
    }
  },
  'kpi-am-7': {
    name: 'Pressure Management',
    description: 'Stability under high workload, prioritizing clients, and resolving sudden crises.',
    scoringGuide: {
      excellent: '9-10: Calm, confident, and decisive during client crises, brilliantly containing tensions.',
      good: '7-8: Proper handling of workloads and urgent requests without quality drop.',
      needsImprovement: '5-6: Noticeable confusion and difficulty prioritizing simultaneous client requests.',
      poor: '3-4: Tension that negatively impacts communication with clients or the internal team.',
      critical: '1-2: Losing control or acting inappropriately during critical situations.'
    }
  },
  // Creative / Design
  'kpi-cr-1': {
    name: 'Design Quality & Aesthetics',
    description: 'Visual aesthetics, composition, font and color harmony, and brand identity alignment.',
    scoringGuide: {
      excellent: '9-10: Exceptional visual mastery, genius font selection, flawless final output.',
      good: '7-8: Professional and elegant designs that match global visual standards.',
      needsImprovement: '5-6: Imbalanced elements, weak font choices, or visual clutter.',
      poor: '3-4: Weak beginner composition, bad color contrast, mediocre aesthetic level.',
      critical: '1-2: Unusable graphics completely unsuited for commercial work.'
    }
  },
  'kpi-cr-2': {
    name: 'Brief Understanding',
    description: 'Understanding design scope, technical dimensions, text hierarchy, and the desired goal.',
    scoringGuide: {
      excellent: '9-10: Immediate grasp of all brief details; asks smart clarifying questions upfront.',
      good: '7-8: Accurate translation of the brief without needing repeated clarifications.',
      needsImprovement: '5-6: Missing some brief details (like dimensions or specific text).',
      poor: '3-4: Repeated misunderstanding of the core idea requested in the brief.',
      critical: '1-2: Delivering designs completely unrelated to the written brief.'
    }
  },
  'kpi-cr-3': {
    name: 'Creative Thinking',
    description: 'Originality of visual concepts, visual storytelling, and using innovative graphic styles.',
    scoringGuide: {
      excellent: '9-10: Creates pioneer visual ideas that heavily increase CTR and turn heads.',
      good: '7-8: Fresh and attractive ideas avoiding stereotypes and cliché stock images.',
      needsImprovement: '5-6: Repeated reliance on ready-made templates without a creative touch.',
      poor: '3-4: Dull visual execution completely lacking inspiration.',
      critical: '1-2: Direct theft or copying of competitor designs without modification.'
    }
  },
  'kpi-cr-4': {
    name: 'Production Efficiency',
    description: 'Speed of design completion, daily production volume, and organization of source files.',
    scoringGuide: {
      excellent: '9-10: Extreme speed without compromising quality; professional file layer organization.',
      good: '7-8: Delivers required daily volume on time with organized file exports.',
      needsImprovement: '5-6: Slow production pace hindering media buyers and publishers.',
      poor: '3-4: Messy files and continuous delays in design delivery deadlines.',
      critical: '1-2: Severe production delays that halt workflows for multiple departments.'
    }
  },
  'kpi-cr-5': {
    name: 'Adaptability & Revisions',
    description: 'Openness to feedback, accurate application of revisions, and avoiding multiple review cycles.',
    scoringGuide: {
      excellent: '9-10: Welcomes feedback, applies revisions flawlessly on the first try; rapid closure.',
      good: '7-8: Positive attitude towards revisions; applied correctly within one cycle.',
      needsImprovement: '5-6: Needs 3 review cycles to apply a simple change due to lack of focus.',
      poor: '3-4: Overly sensitive to criticism and repeated neglect of specific feedback.',
      critical: '1-2: Absolute refusal to make client revisions, creating a hostile environment.'
    }
  },
  'kpi-cr-6': {
    name: 'Task Updates',
    description: 'Updating project board statuses, attaching design links, and maintaining transparency.',
    scoringGuide: {
      excellent: '9-10: Immediate status updates and preview links attached without ever being asked.',
      good: '7-8: Regularly updates task cards with correct links and statuses.',
      needsImprovement: '5-6: Forgets to update task status or notify account managers when ready.',
      poor: '3-4: Leaves tasks pending with zero communication or status updates.',
      critical: '1-2: Lost links and files with a complete lack of task tracking.'
    }
  },
  'kpi-cr-7': {
    name: 'Pressure Management',
    description: 'Handling urgent same-day design requests and tight campaign deadlines.',
    scoringGuide: {
      excellent: '9-10: Shines and delivers stunning urgent designs in record times with total calm.',
      good: '7-8: Smooth, professional handling of revision requests and urgent designs.',
      needsImprovement: '5-6: Noticeable drop in design quality when working fast under time pressure.',
      poor: '3-4: Confusion and paralysis when urgent design requests pile up.',
      critical: '1-2: Refusal to work or withdrawal during urgent campaign launches.'
    }
  },
};
