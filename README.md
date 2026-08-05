# SmartFM Logistics Management System — Assignment 3 (SWE30003)

An Object-Oriented Design implementation for the **SmartFM Logistics Case Study**, refined and evolved from Assignment 2 object design specifications. Built with Next.js 16 (App Router), TypeScript 5, Tailwind CSS, and JSON file persistence abstractions.

---

## 👥 Team & Task Responsibilities

| Member | Domain Classes Owned | Core Business Flow Responsibility |
|---|---|---|
| **Mai** | `SmartFMController`, `Customer`, `Order`, `Invoice` | **Flow V1**: Browse Offerings → Search → Place Order |
| **Trung** | `Branch`, `Vehicle`, `StaffMember`, `Driver` | **Flow V3**: Assign Vehicle & Driver to Shipment |
| **Thien Anh** | `Shipment`, `TrackingUpdate`, `Payment` | **Flow V2**: Payment Processing + **Flow V4**: Track Shipment |

---

## 🚀 Business Flows & UI Scenarios Implemented

1. **Flow V1: Browse Offerings & Order Placement (U1 & U2)**
   - Search transport packages by origin/destination (`BR-HCM`, `BR-HN`, `BR-DN`), goods type (`Hàng thông thường`, `Dễ vỡ`, `Đông lạnh`), and cargo weight.
   - Dynamic fee calculation (`calculateTotal()`): Base Rate + (Weight × Rate/kg).
   - Cargo details input, customer registration/validation, order placement, and automatic invoice & shipment generation.

2. **Flow V2: Payment Processing (U3)**
   - Payment execution via **GoF Strategy Pattern** (`PaymentStrategyFactory` supporting `CashStrategy`, `CardStrategy`, and `BankTransferStrategy`).
   - Deposit and partial settlement support (`recordPayment()`) with receipt generation and real-time status transitions (`UNPAID` → `PARTIALLY_PAID` → `PAID`).

3. **Flow V3: Vehicle & Driver Assignment (U4)**
   - Branch staff dashboard for matching paid, unassigned shipments.
   - Automated suitability evaluation based on capacity limits (`canCarry(weight, volume)`) and driver qualification/license expiration (`isQualifiedFor(vehicleType)`).

4. **Flow V4: Real-Time Shipment Tracking & Driver App (U5 & U6)**
   - Real-time event timeline visualization for customers (`U6`).
   - **Driver 3-Tap Mobile App (`U5`)**: One-touch status updates (`Đã lấy hàng`, `Đang vận chuyển`, `Đã giao thành công`).
   - **Observer Pattern (`TrackingNotifier`)**: Automatically dispatches tracking updates to active subscribers without polling.

---

## 🏗 Key Design Patterns Implemented

- **GRASP Controller Facade (`SmartFMController`)**: Centralized controller delegating work to pure fabrication Application Services (`OrderService`, `PaymentService`, `AssignmentService`, `TrackingService`).
- **Strategy Pattern (`PaymentStrategy`)**: Interchangeable payment algorithms (`Cash`, `Card`, `BankTransfer`).
- **Observer Pattern (`TrackingNotifier`)**: Event-driven Subject-Observer push updates for tracking timeline subscribers.
- **Repository Pattern (`JsonFileRepository<T>`)**: Abstracted persistence layer with server file storage and browser memory/localStorage fallback.
- **Information Expert**: Business logic encapsulated directly inside domain classes (`Vehicle.canCarry`, `Driver.isQualifiedFor`, `Invoice.getBalance`, `Shipment.canTransitionTo`).

---

## 🛠 Tech Stack & Environment

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: JSON File Storage (`src/data/*.json`) via `JsonFileRepository`
- **Node.js**: v20+ / v24+
- **OS**: Windows / macOS / Linux

---

## ⚙️ Getting Started & Execution Commands

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Initialize Seed Data
Populate default JSON sample data (Branches, Vehicles, Drivers, Customers, Orders, Invoices, Shipments):
```bash
npm run seed
```

### 3. Run Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Verification
Verify type safety and compile production bundle:
```bash
npx tsc --noEmit
npm run build
```

---

## 🧪 Step-by-Step Testing & Verification Guide

Follow these steps to thoroughly test all features and business flows:

### Step 1: Data Seeding Verification
Run `npm run seed` in your terminal. Ensure the output confirms 9 datasets written to `src/data/*.json`.

### Step 2: Test Flow V1 — Search & Place Order (U1 & U2)
1. Open [http://localhost:3000/orders](http://localhost:3000/orders).
2. **Validation Test**: Select same Origin and Destination (`BR-HCM` to `BR-HCM`) or enter `0` kg weight. Click **Tìm Kiếm Gói Cước Vận Chuyển**. Verify error messages (`"Vui lòng chọn điểm đi và điểm đến (khác nhau)."` / `"Trọng lượng phải lớn hơn 0 kg."`).
3. **Offering Search**: Select Origin: `BR-HCM`, Destination: `BR-HN`, Goods Type: `Hàng thông thường`, Weight: `10 kg`. Click Search.
4. **Order Placement**: Click **Chọn Gói Cước Này** on the Standard Package.
5. Fill in goods description (`2 thùng tài liệu máy tính`) and customer details.
6. Click **Xác Nhận Đặt Hàng**. Verify redirection to `/orders/[id]` showing generated Order ID (`ORD-XXXXXX`), Tracking Number (`TRK-XXXXXX`), and Unpaid Invoice (`INV-XXXXXX`).

### Step 3: Test Flow V2 — Payment Processing (U3)
1. Click **Chuyển Sang Thanh Toán Ngay** or navigate to [http://localhost:3000/payment](http://localhost:3000/payment).
2. **Validation Test**: Leave payment method empty and click **Xác Nhận Thanh Toán**. Verify error (`"Vui lòng chọn phương thức thanh toán."`).
3. **Failed Card Test**: Select **Thẻ**, enter card token `invalid`. Click Pay. Verify error (`"Thanh toán thất bại. Thẻ không hợp lệ..."`).
4. **Successful Payment**: Select **Chuyển khoản ngân hàng** or **Tiền mặt**, enter Invoice ID `INV-001`, amount `250000`. Click **Xác Nhận Thanh Toán**.
5. Verify green receipt view with transaction reference and status transition.

### Step 4: Test Flow V3 — Vehicle & Driver Assignment (U4)
1. Navigate to [http://localhost:3000/assignment](http://localhost:3000/assignment).
2. Select an unassigned shipment from the **Unassigned Orders** list.
3. Observe recommended vehicles automatically filtered by weight capacity (`canCarry`).
4. Select a vehicle (`VEH-002`), observe qualified driver recommendations (`STF-D01`).
5. Click **Assign Vehicle & Driver**. Verify assignment confirmation and stats update.

### Step 5: Test Flow V4 — Real-Time Tracking & Driver App (U5 & U6)
1. Navigate to [http://localhost:3000/tracking](http://localhost:3000/tracking).
2. Enter Tracking Number `TRK-001` and click **Tra Cứu**. Verify current location, progress step bar, and update timeline (`U6`).
3. Switch tab to **Tài Xế (U5 3-Tap App)**.
4. Tap **📦 1. Đã Lấy Hàng** or **🚚 2. Đang Vận Chuyển**.
5. Switch back to **Khách Hàng (U6 Timeline)** tab and verify real-time timeline update dispatched via `TrackingNotifier`.

---

## 📹 Video Demo & Submission Artifacts

- **Video Demo**: A ~3 minutes screen recording demonstrating end-to-end execution of flows V1 through V4.
- **Report Document**: `docs/planning_temporary/working/Assignment 3 - Object Design Implementation and Reflection.pdf`
- **Source Code**: Root repository `src/` directory.

---

## 📜 Branching & Git Strategy

```
main            protected integration branch
└── dev         working development branch
    ├── order-flow         (V1)
    ├── payment-flow       (V2)
    ├── assignment-flow    (V3)
    ├── tracking-flow      (V4)
    ├── domain-classes     (Domain Models)
    └── seed-data          (Infrastructure)
```