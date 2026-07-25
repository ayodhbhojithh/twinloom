---
planning_context: SOFTWARE_DEVELOPMENT
context_version: 2026.07
---

# NovaBank — RegTech Compliance Sprint (tactical project)

| Outline | Type | Title | Status | Classifier | Skillset | Dur | Sprint | Depends On | Satisfies |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Project | RegTech Compliance Sprint | In Progress |  |  |  |  |  |  |
| 1.1 | Deliverable | Requirements — Audit readiness | Released | WORK_PACKAGE |  |  |  |  |  |
| 1.1.1 | Deliverable | R1 Every KYC decision reproducible | Released | REQUIREMENT |  |  |  |  |  |
| 1.1.2 | Deliverable | R2 Data-retention schedule enforced | In Review | REQUIREMENT |  |  |  |  |  |
| 1.2 | Deliverable | Decision-log replay tool | In Testing | FEATURE | PS-001 |  |  |  | 1.1.1 |
| 1.2.1 | Task | Event-store reader | Completed |  |  | 3 | S1 |  |  |
| 1.2.2 | Task | Replay UI | In Progress |  |  | 4 | S2 | 1.2.1 |  |
| 1.2.3 | Milestone | MS · Replay demoed to compliance | Planned |  |  | 0 | S2 | 1.2.2 |  |
| 1.3 | Deliverable | Retention policy jobs | In Development | DATA | PS-002 |  |  |  | 1.1.2 |
| 1.3.1 | Task | Policy table + schedules | In Progress |  |  | 3 | S1 |  |  |
| 1.3.2 | Task | Purge dry-run + report | Planned |  |  | 3 | S2 | 1.3.1 |  |
| 1.3.3 | Milestone | MS · Retention live | Planned |  |  | 0 | S2 | 1.3.2 |  |
| 1.4 | Control Item | Risk — audit date immovable | Monitored | RISK |  |  |  |  |  |
| 1.5 | Control Item | Impediment — prod data access approvals slow | Identified | IMPEDIMENT |  |  |  |  |  |
