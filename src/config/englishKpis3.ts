import { KPIDefinition } from '../types';

export const ENGLISH_KPIS_3: Record<string, Partial<KPIDefinition>> = {
  // Social Media
  'kpi-sm-1': {
    name: 'Content Quality & Tone',
    description: 'Copywriting style, visual appeal, brand identity alignment, and audience suitability.',
    scoringGuide: {
      excellent: '9-10: Outstanding creative text and design that elevates the brand and inspires followers.',
      good: '7-8: Engaging, high-quality content fully compliant with approved brand guidelines.',
      needsImprovement: '5-6: Monotonous writing, repetitive templates, or minor brand guideline violations.',
      poor: '3-4: Weak posts misaligned with the brand identity, containing linguistic errors.',
      critical: '1-2: Publishing inappropriate or offensive content on official client accounts.',
    }
  },
  'kpi-sm-2': {
    name: 'Engagement & Reach',
    description: 'Engagement rates, video retention, post shares, and genuine follower growth.',
    scoringGuide: {
      excellent: '9-10: Viral reach and engagement consistently double the industry average.',
      good: '7-8: Steady growth in engagement and reach across all managed platforms.',
      needsImprovement: '5-6: Decline in engagement rates; content fails to reach the target audience.',
      poor: '3-4: Absolute zero follower growth and practically non-existent engagement.',
      critical: '1-2: Complete collapse of audience interaction with social media accounts.',
    }
  },
  'kpi-sm-3': {
    name: 'Content Planning & Calendar',
    description: 'Preparing the monthly content calendar in advance, managing inventory, and posting on schedule.',
    scoringGuide: {
      excellent: '9-10: Calendar approved two weeks in advance with 100% adherence to posting times.',
      good: '7-8: Regular planning and reliable scheduling; avoids last-minute urgent work.',
      needsImprovement: '5-6: Delays in delivering content calendars and gaps in the posting schedule.',
      poor: '3-4: Random, irregular posting without any clear action plan.',
      critical: '1-2: Abandoning accounts without posting for long periods.',
    }
  },
  'kpi-sm-4': {
    name: 'Creative Thinking & Trends',
    description: 'Capitalizing on trending topics in real-time, and innovating Reels and ongoing content series.',
    scoringGuide: {
      excellent: '9-10: Smart utilization of trends within 24 hours; creates successful original content series.',
      good: '7-8: Effective use of visual/audio trends suitable for the client\'s niche.',
      needsImprovement: '5-6: Late adoption of trends; clinging to outdated traditional posting formats.',
      poor: '3-4: Total absence of creativity or renewal in ideas and styles.',
      critical: '1-2: Complete refusal to experiment with modern content formats.',
    }
  },
  'kpi-sm-5': {
    name: 'Account Strategy & Client Understanding',
    description: 'Understanding the client\'s industry and target audience, applying an aligned content strategy.',
    scoringGuide: {
      excellent: '9-10: Deep grasp of industry nuances and consumer psychology reflected in every post.',
      good: '7-8: Sound understanding of the client persona and goals reflected in content quality.',
      needsImprovement: '5-6: Superficial understanding resulting in generic posts that don\'t serve specific goals.',
      poor: '3-4: Complete failure to understand the nature of the target audience.',
      critical: '1-2: Publishing content that damages the brand\'s market positioning.',
    }
  },
  'kpi-sm-6': {
    name: 'Reporting & Delivery',
    description: 'Social media performance reports, audience demographics, impressions, delivered on time.',
    scoringGuide: {
      excellent: '9-10: Rich analytical reports explaining audience sentiment with actionable creative takeaways.',
      good: '7-8: Accurate and comprehensive monthly reports delivered on schedule.',
      needsImprovement: '5-6: Late report delivery or missing core platform metrics.',
      poor: '3-4: Inaccurate or incomplete data provided to the account management team.',
      critical: '1-2: Failure to deliver monthly social media reports.',
    }
  },
  'kpi-sm-7': {
    name: 'Pressure Management (Crises & Urgent Edits)',
    description: 'Handling negative comments, public crises, and urgent modifications to posts.',
    scoringGuide: {
      excellent: '9-10: Manages public crises and sensitive comments diplomatically with extreme speed.',
      good: '7-8: Smooth handling of urgent event coverage and sudden client edits.',
      needsImprovement: '5-6: Flustered when asked to edit posts urgently on the same day.',
      poor: '3-4: Severe stress when the frequency of negative comments increases.',
      critical: '1-2: Replying offensively or defensively to negative comments in public.',
    }
  },

  // AI & Automation
  'kpi-ai-1': {
    name: 'Architecture & Strategy',
    description: 'Understanding requirements, designing overall structure, data flow, and systems before coding.',
    scoringGuide: {
      excellent: '9-10: Meticulously documented modular architectures anticipating all edge cases before starting.',
      good: '7-8: Solid diagrams, workflows, and a comprehensive understanding of system requirements.',
      needsImprovement: '5-6: Rushing to write code without sufficient planning, requiring later rebuilds.',
      poor: '3-4: Random scripts lacking structural cohesion and error handling.',
      critical: '1-2: Total inability to understand project requirements and system constraints.',
    }
  },
  'kpi-ai-2': {
    name: 'AI Solution Quality & Prompting',
    description: 'Output accuracy, prompt engineering, reducing hallucinations, and AI model reliability.',
    scoringGuide: {
      excellent: '9-10: Extreme accuracy, zero hallucination, deterministic outputs, and exceptional prompt engineering.',
      good: '7-8: Reliable AI outputs that consistently meet business requirements.',
      needsImprovement: '5-6: Fluctuating output quality; lacks clear evaluation criteria for results.',
      poor: '3-4: High error rates in generated content or JSON parsing.',
      critical: '1-2: Generating harmful or completely false data that damages operations.',
    }
  },
  'kpi-ai-3': {
    name: 'Automation & Efficiency',
    description: 'Automating manual processes, saving team hours, and optimizing API cost/speed.',
    scoringGuide: {
      excellent: '9-10: Saves hundreds of hours monthly and reduces token costs by over 40%.',
      good: '7-8: Builds effective automations that streamline work across different departments.',
      needsImprovement: '5-6: Automations break constantly due to unhandled edge cases.',
      poor: '3-4: Fragile workflows requiring continuous manual intervention.',
      critical: '1-2: Automations cause more errors and issues than manual work.',
    }
  },
  'kpi-ai-4': {
    name: 'Technical Execution & Code Quality',
    description: 'Code cleanliness, API integration efficiency, server reliability, and Git standards.',
    scoringGuide: {
      excellent: '9-10: Clean, standard, maintainable code with comprehensive tests and CI/CD.',
      good: '7-8: Good coding standards, organized documentation, and reliable API endpoints.',
      needsImprovement: '5-6: Disorganized code lacking proper error handling and typing.',
      poor: '3-4: Bug-ridden code causing system downtime.',
      critical: '1-2: Severe security vulnerabilities or leaking secret API keys.',
    }
  },
  'kpi-ai-5': {
    name: 'Debugging & Problem Solving',
    description: 'Diagnosing complex automation pipeline failures, handling rate limits and latency.',
    scoringGuide: {
      excellent: '9-10: Rapid diagnosis of distributed system failures; implements instant fallbacks.',
      good: '7-8: Methodically addresses technical errors using logs and traces.',
      needsImprovement: '5-6: Difficulty solving async operations or API consumption limits.',
      poor: '3-4: Inability to fix recurring software bugs.',
      critical: '1-2: Ignoring continuous system errors without addressing them.',
    }
  },
  'kpi-ai-6': {
    name: 'Documentation & Scalability',
    description: 'API documentation, workflow diagrams, runbooks, and designing scalable systems.',
    scoringGuide: {
      excellent: '9-10: Exemplary technical documentation any engineer can understand in minutes.',
      good: '7-8: Clear READMEs and operational guides for all developed tools.',
      needsImprovement: '5-6: Sparse documentation; system is only understood by its creator.',
      poor: '3-4: No documentation; random scripts with unknown paths.',
      critical: '1-2: Complete absence of code comments or explanations for built systems.',
    }
  },
  'kpi-ai-7': {
    name: 'Delivery & Milestones',
    description: 'Launching AI features on time and sharing impact/measurement reports.',
    scoringGuide: {
      excellent: '9-10: Delivers features ahead of schedule with precise positive impact metrics.',
      good: '7-8: Delivers AI projects in scheduled phases with clear demonstrations.',
      needsImprovement: '5-6: Delays in project delivery without proactive communication.',
      poor: '3-4: Chronic delays and incomplete projects.',
      critical: '1-2: Complete failure to deliver committed AI initiatives and projects.',
    }
  },
  'kpi-ai-8': {
    name: 'Pressure Management (Systems & Outages)',
    description: 'Managing server outages, sudden model deprecations, and urgent hotfixes.',
    scoringGuide: {
      excellent: '9-10: Calm and steady during live system outages; restores services in record time.',
      good: '7-8: Professional, rapid response to urgent bugs and server alerts.',
      needsImprovement: '5-6: Applies rushed fixes without sufficient testing during crises.',
      poor: '3-4: Flustered and unable to act when systems crash under high load.',
      critical: '1-2: Unavailable or evasive during major system outage incidents.',
    }
  },

  // Managerial (MG)
  'kpi-mg-1': {
    name: 'Strategic Planning & Governance',
    description: 'Setting strategic goals, aligning departments, and tracking general business plans.',
    scoringGuide: {
      excellent: '9-10: Profound strategic vision driving exceptional growth and high efficiency.',
      good: '7-8: Sound strategic planning with regular monitoring of department performance.',
      needsImprovement: '5-6: Incomplete business plans or weak tracking of initiatives.',
      poor: '3-4: Lack of strategic vision; erratic prioritization.',
      critical: '1-2: Destructive management decisions resulting in substantial losses.',
    }
  },
  'kpi-mg-2': {
    name: 'Performance Governance & Leadership Dev',
    description: 'Building team leaders, approving evaluations, and ensuring evaluation justice.',
    scoringGuide: {
      excellent: '9-10: Builds a strong second line of leaders; evaluations are highly accurate and fair.',
      good: '7-8: Supports team leaders and regularly reviews their evaluations.',
      needsImprovement: '5-6: Rarely mentors team leaders; rubber-stamps evaluations without review.',
      poor: '3-4: Extreme bias in performance governance.',
      critical: '1-2: Toxic governance destroying company leadership structure.',
    }
  }
};
