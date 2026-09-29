import { readDashboardPricing, getKshRangeLabel, getKshMonthlyLabel } from '../utils/pricing';

const pricing = readDashboardPricing();

export const mockUser = {
  name: "Elena Rostova",
  roleTitle: "Managing Partner & Design Director",
  role: "Admin", // Admin, Staff, Client
  email: "elena.rostova@vanguard.agency",
  phone: "+1 (212) 849-0193",
  id: "VNG-EXEC-01",
  joined: "Oct 2021",
  contractsSealed: 42,
  timezone: "UTC-05:00 Eastern Time (US & Canada)",
  language: "English (United States - Executive Standard)",
  bio: "Leading design systems architecture, boutique brand elevation, and high-velocity digital products. Oversees enterprise product validation, client deliverables audits, and multi-lateral escrow clearances.",
  securityHealth: 98,
  activeSessions: [
    { id: 1, device: "MacBook Pro 16\" M3 Max", client: "Current Session • Brave Browser", location: "New York, NY, USA", ip: "102.0.2.14", lastActive: "Just now", isCurrent: true },
    { id: 2, device: "iPhone 15 Pro", client: "Vanguard Mobile App v2.4", location: "New York, NY, USA", ip: "198.51.100.82", lastActive: "42 mins ago", isCurrent: false },
    { id: 3, device: "Google Chrome on Linux", client: "Agency Operations Cluster", location: "Berlin, DE", ip: "203.0.113.195", lastActive: "Yesterday 18:20", isCurrent: false }
  ]
};

export const mockExecutiveStats = {
  activeProjects: 24,
  activeProjectsDelta: "+3 this mo",
  activeProjectsBreakdown: { onTrack: 18, review: 4, blocked: 2 },
  monthlyInvoiced: "$148.5k",
  monthlyInvoicedRecv: "84% Recv",
  pendingClearing: "$23,750.00",
  milestoneVelocity: "94.2%",
  milestoneVelocityVsQ2: "+4.8% vs Q2",
  teamUtilization: "87%",
  teamUtilizationBand: "Optimal band",
  disciplinesCount: 6
};

export const mockClientEngagements = [
  {
    id: "aura-fintech",
    name: "Aura Fintech",
    subtitle: "Global Brand & Enterprise Web App",
    discipline: "UI/UX & Dev",
    disciplineBadge: "engineering",
    lead: "Marcus Chen",
    leadAvatar: "MC",
    leadRole: "Lead Architect",
    status: "IN PROGRESS",
    statusType: "info",
    progress: 78,
    sowAmount: "KSh 18,500",
    lifetimeBilling: "KSh 14,500",
    sowsCompleted: "3 SOWs Completed",
    sowNumber: "Sprint 04 / Core Engine"
  },
  {
    id: "solace-health",
    name: "Solace Health",
    subtitle: "Identity & Multi-Brand Design System",
    discipline: "Branding",
    disciplineBadge: "brand",
    lead: "Sarah Lin",
    leadAvatar: "SL",
    leadRole: "Design Systems Lead",
    status: "UNDER REVIEW",
    statusType: "purple",
    progress: 60,
    sowAmount: "KSh 21,000",
    lifetimeBilling: "KSh 16,500",
    sowsCompleted: "2 Active Retainers",
    sowNumber: "Design System Deliverables"
  },
  {
    id: "nexus-robotics",
    name: "Nexus Robotics",
    subtitle: "E-Commerce Headless Storefront",
    discipline: "Web Dev",
    disciplineBadge: "engineering",
    lead: "Alex Rivera",
    leadAvatar: "AR",
    leadRole: "Creative Dev",
    status: "REVISION REQ.",
    statusType: "warning",
    progress: 40,
    sowAmount: "KSh 12,500",
    lifetimeBilling: "KSh 18,000",
    sowsCompleted: "Overdue Feedback (+48h)",
    sowNumber: "Interactive 3D Storefront"
  },
  {
    id: "zephyr-coffee",
    name: "Zephyr Coffee",
    subtitle: "Package Design & 3D Render Assets",
    discipline: "3D Motion",
    disciplineBadge: "motion",
    lead: "Maya Patel",
    leadAvatar: "MP",
    leadRole: "3D Motion",
    status: "IN PROGRESS",
    statusType: "info",
    progress: 90,
    sowAmount: "KSh 24,500",
    lifetimeBilling: "KSh 20,000",
    sowsCompleted: "Retainer Scheduled",
    sowNumber: "Interactive 3D Can Experience"
  },
  {
    id: "veloce-mobility",
    name: "Veloce Mobility",
    subtitle: "Next-Gen EV Telematics Mobile App",
    discipline: "Mobile UI",
    disciplineBadge: "mobile",
    lead: "David Kim",
    leadAvatar: "DK",
    leadRole: "Mobile Lead",
    status: "DELIVERED",
    statusType: "success",
    progress: 100,
    sowAmount: "KSh 17,500",
    lifetimeBilling: "KSh 23,000",
    sowsCompleted: "Final Handoff Completed",
    sowNumber: "Telematics Mobile App"
  }
];

export const mockProjectDetails = {
  id: "aura-fintech",
  title: "Aura Fintech — Global Brand & Web App Redesign",
  codeRef: "#AUR-2024-8840",
  description: "End-to-end design token synchronization, scalable Next.js multi-currency transaction dashboard, biometric client authorization, and native cross-platform mobile...",
  startDate: "Sep 15, 2024",
  deadline: "Nov 15, 2024",
  budgetBilled: "KSh 18,500",
  budgetCollected: "KSh 15,000",
  overallVelocity: 78.4,
  currentSprint: "Sprint 4 of 5",
  daysRemaining: 18,
  assignedSquad: [
    { name: "Marcus Chen", role: "Lead Engineer", avatar: "MC" },
    { name: "Elena Rostova", role: "Design Director", avatar: "ER" },
    { name: "Sarah Lin", role: "Design Systems", avatar: "SL" }
  ],
  lifecycleStages: [
    { step: "01", label: "Discovery", status: "completed" },
    { step: "02", label: "Wireframing", status: "completed" },
    { step: "03", label: "Design System", status: "completed" },
    { step: "04", label: "Build & APIs", status: "active" },
    { step: "05", label: "QA & Audit", status: "pending" },
    { step: "06", label: "Deployment", status: "pending" }
  ],
  milestones: [
    {
      id: "m1",
      number: 1,
      title: "UX Discovery & Brand Architecture",
      status: "COMPLETED",
      statusBadge: "100% APPROVED",
      amount: "$15,000 Paid",
      price: 15000,
      completionDate: "Oct 4, 2024",
      desc: "Competitive analysis, customer persona mapping, design token semantic definitions, and Figma executive presentation."
    },
    {
      id: "m2",
      number: 2,
      title: "Wireframes & Interactive Prototypes",
      status: "COMPLETED",
      statusBadge: "100% APPROVED",
      amount: "$15,000 Paid",
      price: 15000,
      completionDate: "Oct 18, 2024",
      desc: "42 high-fidelity desktop and mobile viewports with complex micro-interactions, transaction flows, and modal systems."
    },
    {
      id: "m3",
      number: 3,
      title: "Design System & Component Library",
      status: "COMPLETED",
      statusBadge: "100% APPROVED",
      amount: "$12,500 Invoiced",
      price: 12500,
      completionDate: "Oct 24, 2024",
      desc: "Storybook documentation, accessible typography hierarchy, theme tokens JSON export, and React component kit baseline."
    },
    {
      id: "m4",
      number: 4,
      title: "Full-Stack React/Next.js Build & API Integration",
      status: "IN PROGRESS",
      statusBadge: "75% IN REVIEW",
      amount: "$13,500 Next",
      price: 13500,
      completionDate: "Nov 2, 2024 (Ahead by 2 days)",
      desc: "Core application shells, staging environment live for evaluation.",
      tasks: [
        { id: "t1", label: "Stripe Checkout & Webhook Setup", checked: true },
        { id: "t2", label: "OAuth 2.0 Auth & Session Refresh", checked: true },
        { id: "t3", label: "Real-Time Finance Graph Visualizer", checked: true },
        { id: "t4", label: "Card Management & Pin Recovery API", checked: true },
        { id: "t5", label: "KYC Verification Upload Pipeline", checked: true },
        { id: "t6", label: "Notification Dispatch Queue", checked: true },
        { id: "t7", label: "M-Pesa Webhook & Multi-Currency FX Sync", checked: false },
        { id: "t8", label: "Mobile Viewport Polish & Micro-animations", checked: false }
      ]
    },
    {
      id: "m5",
      number: 5,
      title: "Security Audit, QA Testing & Production Launch",
      status: "UPCOMING",
      statusBadge: "DUE USD (0%)",
      amount: "$12,000 Final",
      price: 12000,
      completionDate: "Nov 3 – Nov 15, 2024",
      desc: "OWASP penetration tests, load testing, cloud deployment on AWS ECS, and staff handoff walkthrough."
    }
  ],
  deliverables: [
    { name: "Design-Tokens-v2.json", size: "24 KB", info: "Synced Oct 22", type: "code" },
    { name: "Aura-Mobile-Sprint4.apk", size: "48.2 MB", info: "Uploaded Oct 27", type: "apk" },
    { name: "Brand-Asset-Pack-Final.zip", size: "128 MB", info: "SVG / PNG / Figma", type: "zip" }
  ],
  comments: [
    {
      id: "c1",
      author: "Sarah Jenkins",
      role: "Client Executive • VP Product",
      avatar: "SJ",
      date: "Oct 23, 2024 at 14:32",
      text: "The latest iteration of the Multi-Currency Wallet dashboard looks stellar. We tested the simulated conversion flow with the Kenyan shilling (KES) and Euro accounts. We have approved Screen 4 officially!",
      officialSignoff: "Sarah Jenkins approved Deliverable Screen 4 (FX Card Flow)",
      hash: "Hash: SGO-8821-KUNA"
    },
    {
      id: "c2",
      author: "Marcus Chen",
      role: "Vanguard Tech Lead",
      avatar: "MC",
      date: "Oct 23, 2024 at 15:40",
      text: "Thank you Sarah! We have pushed the corresponding React component tokens into the master staging build. Here is the updated prototype recording showing the biometric swipe confirm.",
      attachments: [
        { name: "Aura-Biometric-Demo-v3.mp4", meta: "18.4 MB • High Res Recording" },
        { name: "staging.aura-fintech.io", meta: "Build 4148 Active Branch", external: true }
      ]
    }
  ]
};

export const mockInvoices = [
  {
    id: "INV-2024-089",
    client: "Aura Fintech",
    project: "Milestone 3 & 4 Settlement",
    avatar: "AF",
    issueDate: "Oct 28, 2024",
    dueDate: "Nov 05, 2024",
    amount: "$12,500.00",
    amountKes: "KES 1,625,000.00",
    balance: "$12,500.00",
    status: "Awaiting Payment",
    statusClass: "warning",
    dueDays: "In 8 days",
    rail: "M-Pesa STK / Stripe"
  },
  {
    id: "INV-2024-088",
    client: "Solace Health Systems",
    project: "Telehealth UX Architecture",
    avatar: "SH",
    issueDate: "Oct 24, 2024",
    dueDate: "Oct 27, 2024",
    amount: "$34,000.00",
    amountKes: "KES 4,420,000.00",
    balance: "$0.00",
    status: "Paid in full",
    statusClass: "success",
    dueDays: "Settled Oct 26",
    rail: "Wire Transfer"
  },
  {
    id: "INV-2024-082",
    client: "Hyperion Logistics",
    project: "Supply Chain Dashboard Q3",
    avatar: "HL",
    issueDate: "Oct 12, 2024",
    dueDate: "Oct 26, 2024",
    amount: "$7,200.00",
    amountKes: "KES 936,000.00",
    balance: "$7,200.00",
    status: "Overdue",
    statusClass: "danger",
    dueDays: "+4 days late",
    rail: "Stripe Card"
  },
  {
    id: "INV-2024-085",
    client: "Kibo Ventures Africa",
    project: "Series-A Identity & Portal",
    avatar: "KV",
    issueDate: "Oct 18, 2024",
    dueDate: "Nov 12, 2024",
    amount: "$16,000.00",
    amountKes: "KES 2,080,000.00",
    balance: "$16,000.00",
    status: "Awaiting Payment",
    statusClass: "warning",
    dueDays: "In 15 days",
    rail: "Bank Wire"
  },
  {
    id: "INV-2024-079",
    client: "Lumina Global",
    project: "WebGL Motion Design System",
    avatar: "LS",
    issueDate: "Oct 02, 2024",
    dueDate: "Oct 16, 2024",
    amount: "$22,800.00",
    amountKes: "KES 2,964,000.00",
    balance: "$0.00",
    status: "Paid in full",
    statusClass: "success",
    dueDays: "Settled Oct 15",
    rail: "M-Pesa STK"
  }
];

export const mockServices = [
  {
    id: "srv-1",
    title: "Enterprise Web & Mobile App Ecosystem",
    discipline: "Engineering & UX Architecture",
    flagship: true,
    priceRange: getKshRangeLabel(pricing.min, pricing.max),
    sowType: "Fixed Milestone SOW",
    description: "Turnkey engineering of resilient multi-tenant client portals, headless micro-frontends, and automated cloud CI/CD staging environments.",
    baselineMilestones: 6,
    activeDeployments: 5,
    turnaround: "6.5 Wks Turnaround",
    tranches: [
      { step: 1, label: "Initial Project Deposit", pct: "30%", val: `${pricing.currency} ${Number(pricing.min).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`, trigger: "Upon Contract Execution" },
      { step: 2, label: "UX Tokens & Spec Approval", pct: "30%", val: `${pricing.currency} ${Number(pricing.min).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`, trigger: "Midpoint Client Signoff" },
      { step: 3, label: "Final Deployment & QA Handover", pct: "40%", val: `${pricing.currency} ${Number(pricing.max).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`, trigger: "Production Verification" }
    ],
    deliverables: [
      { title: "M1: Product Discovery & System Archetypes", week: "Wk 1", checked: true },
      { title: "M2: Figma Design System Tokens & Wireframes", week: "Wk 2-3", checked: true },
      { title: "M3: Next.js 14 & Tailwind Production Build", week: "Wk 4-5", checked: true },
      { title: "M4: End-to-End Test Matrix & Handover", week: "Wk 6", checked: true }
    ],
    rateMultipliers: [
      { role: "Senior Arch", rate: `${pricing.currency} 18,500/hr` },
      { role: "Creative Eng", rate: `${pricing.currency} 16,500/hr` },
      { role: "UX Principal", rate: `${pricing.currency} 12,000/hr` }
    ]
  },
  {
    id: "srv-2",
    title: "Comprehensive Brand Identity & Design System",
    discipline: "Brand Architecture & Token Systems",
    flagship: false,
    priceRange: getKshRangeLabel(pricing.min, pricing.max - 2000),
    sowType: "Fixed Milestone SOW",
    description: "Executive brand positioning, complete vector logomark systems, WCAG AAA digital color codex, and synchronized Storybook component foundation.",
    tags: ["Logo Vector Matrix", "Color Codex (LCH)", "WCAG AAA Figma Kit", "Storybook Tokens"],
    keyDeliverables: "4 Key Deliverables",
    activeContracts: "3 Active Client Contracts"
  },
  {
    id: "srv-3",
    title: "Interactive 3D WebGL & Motion Experience",
    discipline: "Creative Dev & Shaders",
    flagship: false,
    priceRange: getKshRangeLabel(pricing.min + 3000, pricing.max),
    sowType: "Fixed Milestone SOW",
    description: "High-performance Three.js pipelines, custom GLSL vertex shaders, GLTF asset optimization, and butter-smooth 60fps mobile fallbacks.",
    tags: ["Three.js / R3F", "GLSL Shaders", "60FPS Mobile Opt.", "DRACO Compression"],
    keyDeliverables: "3 Key Milestones",
    activeContracts: "2 Active Deployments"
  },
  {
    id: "srv-4",
    title: "Full-Stack Retainer & Dedicated Pod",
    discipline: "Continuous Velocity & Architecture",
    isRetainer: true,
    priceRange: getKshMonthlyLabel(pricing.min),
    sowType: "Dedicated Monthly Pod",
    description: "Direct allocation of 1 Lead System Architect + 2 Creative Full-Stack Engineers. 80 guaranteed hours/month with an expedited 4-hour SLA incident response.",
    tags: ["4-Hour SLA", "4 Active Retainers ($50k/mo MRR)"]
  },
  {
    id: "srv-5",
    title: "Security, Penetration Audit & Cloud Deployment",
    discipline: "DevOps, Cloud Infra & SecOps",
    flagship: false,
    priceRange: getKshRangeLabel(pricing.min + 1200, pricing.min + 3000),
    sowType: "Flat Rate Baseline",
    description: "Hardened AWS/Cloudflare edge network topology, zero-trust secrets audit, automated Playwright/Cypress end-to-end regression suites, and SOC-2 preparation.",
    tags: ["Single Milestone Signoff", "Available On-Demand"]
  }
];

export const mockKanbanTasks = {
  todo: [
    {
      id: "ENG-104",
      project: "Orbit Labs",
      title: "Setup Staging Auth flow",
      desc: "Integrate Supabase JWT with OAuth2 for stakeholder preview environment.",
      tag: "3d",
      priority: "medium",
      avatars: ["MC"]
    },
    {
      id: "DES-88",
      project: "Aura Fintech",
      title: "Export SVG icon pack",
      desc: "Audit and optimize all 64 bespoke linear financial glyphs for web bundle.",
      tag: "4d",
      priority: "low",
      avatars: ["MC"]
    },
    {
      id: "CX-12",
      project: "Internal",
      title: "Write microcopy specs",
      desc: "Draft empty-state instructions and tooltip behaviors for wallet screens.",
      tag: "1w",
      priority: "low",
      avatars: ["SL"]
    }
  ],
  inProgress: [
    {
      id: "ENG-119",
      project: "Aura Fintech",
      title: "Interactive WebGL Hero Scene",
      desc: "Refining particle acceleration on mouse move and mobile gyroscope fallback.",
      priority: "URGENT",
      progress: 75,
      files: 4,
      avatars: ["MC"]
    },
    {
      id: "ENG-120",
      project: "Orbit Labs",
      title: "Stripe & M-Pesa Webhook",
      desc: "Edge handling for checkout idempotency and payment verification responses.",
      priority: "High",
      progress: 50,
      avatars: ["MC"]
    },
    {
      id: "DES-92",
      project: "Kroma Sound",
      title: "Audio Reactive Visualizer",
      desc: "Connecting Web Audio API node frequencies to canvas threejs mesh.",
      priority: "Normal",
      progress: 30,
      avatars: ["AR"]
    }
  ],
  underReview: [
    {
      id: "SYS-04",
      project: "Aura Fintech",
      clientLabel: "Sarah (Client)",
      title: "Design System Token Export",
      desc: "JSON tokens synced with Style Dictionary and delivered to client engineers.",
      meta: "Version 1.4.2 • Delivered 4h ago",
      avatars: ["MC"]
    },
    {
      id: "UX-61",
      project: "Orbit Labs",
      clientLabel: "Elena (VP)",
      title: "User Onboarding Flows",
      desc: "7-step interactive prototype including KYC validation state transitions.",
      meta: "ProtoPie Spec • Ready for Sign-off",
      avatars: ["MC"]
    }
  ],
  revisionReq: [
    {
      id: "REV-02",
      project: "Aura Fintech",
      clientLabel: "CLIENT NOTE",
      title: "Mobile Checkout Form",
      desc: "Client feedback: simplify international phone prefix selector and auto-fill OTP field.",
      blocker: "Blocker for Sprint Demo: \"Can we reduce friction on step 2 before Friday?\"",
      avatars: ["MC"]
    },
    {
      id: "REV-03",
      project: "Orbit Labs",
      clientLabel: "Contrast",
      title: "Navbar Contrast on Dark",
      desc: "Accessibility audit flag: dropdown labels fail WCAG AAA against 0f131D canvas.",
      avatars: ["SL"]
    }
  ]
};

export const mockNotifications = [
  {
    id: "n1",
    category: "urgent",
    author: "Sarah Jenkins",
    authorRole: "Head of Product at Aura Fintech",
    sla: "SLA: 2h Remaining",
    title: "Milestone Review",
    time: "12 minutes ago • Aura Mobile Suite v2.0",
    content: "\"Mobile Checkout & Escrow validation completed. Security stress-tests achieved 99.98% conformance. Sign-off requested for staging deployment.\"",
    actions: ["Review Deliverable", "Jump to Project"]
  },
  {
    id: "n2",
    category: "settlement",
    title: "Escrow Settlement Confirmed",
    amount: "$12,500.00 USD",
    subAmount: "KES 1,625,000.00 Net",
    rail: "M-Pesa Express B2B",
    time: "47 minutes ago • Gateway Ref: MP-TX9820-NA",
    content: "INV-2024-089: Milestone #3 Core Backend Clearance Complete • Autonomous Verification Complete • Ledger Synced",
    actions: ["View Receipt", "Download Escrow Proof"]
  },
  {
    id: "n3",
    category: "urgent",
    title: "Nexus Robotics 3D Viewer Overdue",
    warning: "SLA Breach Warning (+48h Overdue)",
    time: "2 hours ago • Client Wall Time: 48h 12m",
    content: "Client stakeholder Dr. Hiroshi Tanaka submitted 6 frame-accurate comments on the WebGL CAD inspector. No internal designer has addressed the thread.",
    assigned: "Assigned Lead: Alex Rivera (3D Architect) • Reputation Impact: Medium",
    actions: ["Nudge Lead (Alex Rivera)", "Open Thread"]
  },
  {
    id: "n4",
    category: "approvals",
    group: "Yesterday",
    title: "New SOW Master Agreement Signed",
    amount: "$34,000.00",
    time: "Yesterday at 16:42 • DocuSign ID: #SOW-SOL-991",
    content: "Solace Health completed mutual executive countersignature for Phase II Clinical Telehealth Portal. Project kick-off timeline initiated.",
    signatory: "Signatory: Dr. Amara Vance, Chief Medical Officer • Term: 14 Weeks",
    actions: ["Assign Squad", "View Countersigned PDF"]
  }
];

export const mockTalent = [
  {
    id: "t-1",
    name: "Marcus Chen",
    role: "Lead Full-Stack & Systems Architect",
    avatar: "MC",
    loadPct: 92,
    loadBand: "HIGH LOAD",
    loadClass: "danger",
    assignedClients: ["Aura Fintech", "Orbit Labs"]
  },
  {
    id: "t-2",
    name: "Sarah Lin",
    role: "Senior Brand & Design Systems",
    avatar: "SL",
    loadPct: 78,
    loadBand: "NOMINAL",
    loadClass: "info",
    assignedClients: ["Solace Health", "Vanguard Internal"]
  },
  {
    id: "t-3",
    name: "Alex Rivera",
    role: "Front-End & Creative Dev",
    avatar: "AR",
    loadPct: 80,
    loadBand: "STEADY",
    loadClass: "info",
    assignedClients: ["Nexus Robotics"]
  },
  {
    id: "t-4",
    name: "Maya Patel",
    role: "3D Motion & Visual Designer",
    avatar: "MP",
    loadPct: 65,
    loadBand: "AVAILABLE",
    loadClass: "success",
    assignedClients: ["Zephyr Coffee"]
  },
  {
    id: "t-5",
    name: "David Kim",
    role: "Mobile UI & Prototyping",
    avatar: "DK",
    loadPct: 70,
    loadBand: "BALANCED",
    loadClass: "info",
    assignedClients: ["Veloce Mobility"]
  }
];
