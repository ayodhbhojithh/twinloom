---
planning_context: SOFTWARE_DEVELOPMENT
context_version: 2026.07
---

# NovaBank — Digital Banking Platform (programme)

| Outline | Type | Title | Status | Classifier | Skillset | Dur | Sprint | Depends On | Satisfies |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Programme | Digital Banking Platform | In Delivery |  |  |  |  |  |  |
| 1.1 | Project | Onboarding & KYC | In Progress |  |  |  |  |  |  |
| 1.1.1 | Deliverable | Requirements — Onboarding | Released | WORK_PACKAGE |  |  |  |  |  |
| 1.1.1.1 | Deliverable | R1 Open an account in under 10 minutes | Released | REQUIREMENT |  |  |  |  |  |
| 1.1.1.2 | Deliverable | R2 KYC evidence captured digitally | Released | REQUIREMENT |  |  |  |  |  |
| 1.1.1.3 | Deliverable | R3 Identity verified against two bureaus | In Review | REQUIREMENT |  |  |  |  |  |
| 1.1.1.4 | Deliverable | R4 Liveness check for remote onboarding | Planned | REQUIREMENT |  |  |  |  |  |
| 1.1.1.5 | Deliverable | R5 Audit trail for every KYC decision | Planned | REQUIREMENT |  |  |  |  |  |
| 1.1.2 | Deliverable | KYC document capture | Released | SCREEN | PS-001 |  |  |  | 1.1.1.2 |
| 1.1.2.1 | Task | Capture UX spec | Completed |  |  | 3 | S1 |  |  |
| 1.1.2.2 | Task | Camera + OCR integration | Completed |  |  | 5 | S1 | 1.1.2.1 |  |
| 1.1.2.3 | Task | Edge cases — glare, crops, retries | Completed |  |  | 3 | S2 | 1.1.2.2 |  |
| 1.1.2.4 | Milestone | MS · Doc capture released | Completed |  |  | 0 | S2 | 1.1.2.3 |  |
| 1.1.3 | Deliverable | Identity verification API | In Testing | API | PS-003 |  |  |  | 1.1.1.3 |
| 1.1.3.1 | Work Item | Bureau integration phase | In Progress |  |  |  |  |  |  |
| 1.1.3.1.1 | Task | Bureau A contract + sandbox | Completed |  |  | 4 | S2 |  |  |
| 1.1.3.1.2 | Task | Bureau B contract + sandbox | Blocked |  |  | 4 | S3 | 1.1.3.1.1 |  |
| 1.1.3.1.3 | Task | Match & merge scoring service | In Progress |  |  | 6 | S3 | 1.1.3.1.1 |  |
| 1.1.3.2 | Task | Contract tests + failover | Planned |  |  | 4 | S4 | 1.1.3.1.3 |  |
| 1.1.3.3 | Milestone | MS · IDV API live | Planned |  |  | 0 | S4 | 1.1.3.2 |  |
| 1.1.4 | Deliverable | Liveness check | In Development | FEATURE | PS-001 |  |  |  | 1.1.1.4 |
| 1.1.4.1 | Task | Vendor bake-off | Completed |  |  | 3 | S2 |  |  |
| 1.1.4.2 | Task | SDK integration | In Progress |  |  | 5 | S3 | 1.1.4.1 |  |
| 1.1.4.3 | Task | Spoof-attack test pack | Planned |  |  | 4 | S4 | 1.1.4.2 |  |
| 1.1.4.4 | Milestone | MS · Liveness accepted | Planned |  |  | 0 | S4 | 1.1.4.3 |  |
| 1.1.5 | Deliverable | Onboarding funnel screens | Planned | SCREEN | PS-001 |  |  |  | 1.1.1.1 |
| 1.1.6 | Deliverable | KYC decision audit trail | Planned | DATA | PS-002 |  |  |  | 1.1.1.5 |
| 1.1.7 | Deliverable | Referral rewards widget | In Development | FEATURE | PS-001 |  |  |  |  |
| 1.1.7.1 | Task | Widget build | In Progress |  |  | 4 | S3 |  |  |
| 1.1.8 | Deliverable | Onboarding analytics events | Planned | SPECIFICATION |  |  |  |  |  |
| 1.1.9 | Deliverable | Controls — Onboarding | In Development | WORK_PACKAGE |  |  |  |  |  |
| 1.1.9.1 | Control Item | Risk — Bureau B SLA breach delays IDV | Escalated | RISK |  |  |  |  |  |
| 1.1.9.2 | Control Item | Dependency — Bureau sandbox availability | Monitored | DEPENDENCY |  |  |  |  |  |
| 1.1.9.3 | Control Item | Decision — single vs dual-bureau strategy | Validated | DECISION |  |  |  |  |  |
| 1.1.9.4 | Control Item | Assumption — OCR accuracy ≥ 98% on passports | Assessed | ASSUMPTION |  |  |  |  |  |
| 1.1.9.5 | Quality Item | Bug — OCR fails on worn ID cards | Confirmed |  |  |  |  |  |  |
| 1.1.9.6 | Quality Item | Bug — retry loop drops captured images | Fixed |  |  |  |  |  |  |
| 1.1.10 | Milestone | MS · Onboarding E2E in production | Planned |  |  | 0 | S6 | 1.1.3.3 |  |
| 1.2 | Project | Payments Hub | In Progress |  |  |  |  |  |  |
| 1.2.1 | Deliverable | Requirements — Payments | In Review | WORK_PACKAGE |  |  |  |  |  |
| 1.2.1.1 | Deliverable | R6 Initiate payment in 3 taps | In Review | REQUIREMENT |  |  |  |  |  |
| 1.2.1.2 | Deliverable | R7 ISO 20022 native messages | In Review | REQUIREMENT |  |  |  |  |  |
| 1.2.1.3 | Deliverable | R8 Fraud screen every payment under 200ms | Planned | REQUIREMENT |  |  |  |  |  |
| 1.2.2 | Deliverable | Payment initiation API | Released | API | PS-003 |  |  |  | 1.2.1.1 |
| 1.2.2.1 | Task | Endpoints + CRUD | Completed |  |  | 5 | S1 |  |  |
| 1.2.2.2 | Task | Idempotency + retries | Completed |  |  | 3 | S2 | 1.2.2.1 |  |
| 1.2.2.3 | Milestone | MS · Initiation API released | Completed |  |  | 0 | S2 | 1.2.2.2 |  |
| 1.2.3 | Deliverable | ISO 20022 translator | In Development | DATA | PS-002 |  |  |  | 1.2.1.2 |
| 1.2.3.1 | Task | pain.001 mapping | Completed |  |  | 4 | S3 |  |  |
| 1.2.3.2 | Task | pacs.008 mapping | In Progress |  |  | 4 | S4 | 1.2.3.1 |  |
| 1.2.3.3 | Task | Schema regression pack | Planned |  |  | 3 | S5 | 1.2.3.2 |  |
| 1.2.3.4 | Milestone | MS · Translator certified | Planned |  |  | 0 | S5 | 1.2.3.3 |  |
| 1.2.4 | Deliverable | Fraud screening integration | In Review | MICROSERVICE | PS-005 |  |  |  | 1.2.1.3 |
| 1.2.4.1 | Task | Rules engine hookup | Completed |  |  | 5 | S3 |  |  |
| 1.2.4.2 | Task | Latency budget tuning | In Progress |  |  | 3 | S4 | 1.2.4.1 |  |
| 1.2.4.3 | Milestone | MS · Fraud screen live | Planned |  |  | 0 | S5 | 1.2.4.2 |  |
| 1.2.5 | Deliverable | Controls — Payments | In Development | WORK_PACKAGE |  |  |  |  |  |
| 1.2.5.1 | Control Item | Risk — PSD3 scope shift mid-build | Mitigation Planned | RISK |  |  |  |  |  |
| 1.2.5.2 | Control Item | Issue — sandbox rate limits block soak tests | Identified | ISSUE |  |  |  |  |  |
| 1.2.5.3 | Control Item | Change — add instant-payment rails to scope | Assessed | CHANGE |  |  |  |  |  |
| 1.3 | Project | Mobile App v2 | Approved |  |  |  |  |  |  |
| 1.3.1 | Deliverable | Design system refresh | In Development | COMPONENT | PS-004 |  |  |  |  |
| 1.3.1.1 | Task | Token migration | In Progress |  |  | 4 | S4 |  |  |
| 1.3.1.2 | Milestone | MS · Tokens shipped | Planned |  |  | 0 | S5 | 1.3.1.1 |  |
| 1.3.2 | Deliverable | Accounts home screen | Planned | SCREEN | PS-001 |  |  |  |  |
| 1.3.3 | Deliverable | Cards management | Planned | FEATURE | PS-001 |  |  |  |  |
| 1.3.4 | Deliverable | Push notification service | Planned | MICROSERVICE | PS-005 |  |  |  |  |
| 1.3.5 | Deliverable | Biometric re-auth | Planned | FEATURE |  |  |  |  |  |
| 1.3.6 | Deliverable | App analytics schema | Planned | SCHEMA | PS-002 |  |  |  |  |
| 1.4 | Project | Data Migration & Cutover | Initiated |  |  |  |  |  |  |
| 1.4.1 | Work Item | Phase 1 — profiling & mapping | In Progress |  |  |  |  |  |  |
| 1.4.1.1 | Task | Source profiling | Completed |  |  | 4 | S3 |  |  |
| 1.4.1.2 | Task | Field mapping workbook | In Progress |  |  | 5 | S4 | 1.4.1.1 |  |
| 1.4.2 | Work Item | Phase 2 — trial migrations | Planned |  |  |  |  |  |  |
| 1.4.2.1 | Task | Trial run 1 — 10% cohort | Planned |  |  | 4 | S5 | 1.4.1.2 |  |
| 1.4.2.2 | Task | Reconciliation report | Planned |  |  | 3 | S5 | 1.4.2.1 |  |
| 1.4.3 | Work Item | Phase 3 — cutover | Planned |  |  |  |  |  |  |
| 1.4.3.1 | Task | Freeze + final delta | Planned |  |  | 2 | S6 | 1.4.2.2 |  |
| 1.4.3.2 | Milestone | MS · Cutover complete | Planned |  |  | 0 | S6 | 1.4.3.1 |  |
| 1.4.4 | Control Item | Assumption — legacy extracts nightly by 02:00 | Monitored | ASSUMPTION |  |  |  |  |  |
| 1.4.5 | Control Item | Risk — cutover weekend resource clash | Identified | RISK |  |  |  |  |  |
| 1.5 | Deliverable | Programme governance pack | In Development | WORK_PACKAGE |  |  |  |  |  |
| 1.5.1 | Objective | Objective — onboarding time under 10 minutes | Tracking |  |  |  |  |  |  |
| 1.5.2 | Objective | Objective — 99.95% payments availability | Active |  |  |  |  |  |  |
| 1.5.3 | Objective | Objective — zero regulatory findings at launch | Active |  |  |  |  |  |  |
| 1.5.4 | Control Item | Risk — hiring plan slips senior engineers | Assessed | RISK |  |  |  |  |  |
| 1.5.5 | Brain | Idea — open banking marketplace plays | Exploring |  |  |  |  |  |  |
| 1.5.6 | Brain | Idea — SME lending fast-track | Ready to Convert |  |  |  |  |  |  |
| 1.6 | Milestone | MS · Programme gate — public beta | Planned |  |  | 0 | S6 | 1.1.10 |  |
