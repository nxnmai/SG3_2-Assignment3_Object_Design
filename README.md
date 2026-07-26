# SmartFM - Assignment 3 (SWE30003)

Object design implementation for the SmartFM case study, refined from the
Assignment 2 design.

## Team
| Member | Owns (domain classes) | Flow |
|---|---|---|
| Mai | SmartFMController, Customer, Order, Invoice | V1: Browse → Search → Place Order |
| Trung | Branch, Vehicle, StaffMember, Driver | V3: Assign Vehicle & Driver |
| Thien Anh | Shipment, TrackingUpdate, Payment | V2: Payment + V4: Track Shipment |

## Business areas implemented (4, per spec minimum)
1. Browse → Search → Place Order
2. Payment Processing
3. Assign Vehicle & Driver
4. Track Shipment

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- JSON file persistence (`src/data/*.json`) via a repository layer
- ESLint (Airbnb TypeScript config) + Prettier

## Getting started
```bash
npm install
npm run dev
```
App runs at http://localhost:3000

## Environment used for development/testing
> Fill in before submission: OS, IDE/editor, Node.js version, browser used for testing.

## Branch strategy
```
main            protected, PR + 1 approval required
└── dev         integration branch
    ├── order-flow
    ├── payment-flow
    ├── assignment-flow
    ├── tracking-flow
    ├── domain-classes
    ├── seed-data
    └── report
```

## Report
See `docs/report/`. A2 submission is attached at `docs/A2-Submission/` (mandatory appendix).