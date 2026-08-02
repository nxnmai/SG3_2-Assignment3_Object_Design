# Sequence Diagrams (Mermaid) — Master Reference

> [!IMPORTANT]
> **Authoritative Detailed Files**: Individual `.mmd` files contain the complete, 5-scenario sequence flows (Empty UI, Correct input, Validation, Change of mind, Success) and precise design pattern mappings:
> - [SEQ-V1-ORDER.mmd](file:///f:/github-project/SG3_2-Assignment3_Object_Design/docs/planning_temporary/working/SEQ-V1-ORDER.mmd) — Browse → Search → Place Order
> - [SEQ-V2-PAYMENT.mmd](file:///f:/github-project/SG3_2-Assignment3_Object_Design/docs/planning_temporary/working/SEQ-V2-PAYMENT.mmd) — Payment Processing (with Strategy Pattern & PaymentStrategyFactory)
> - [SEQ-V3-ASSIGNMENT.mmd](file:///f:/github-project/SG3_2-Assignment3_Object_Design/docs/planning_temporary/working/SEQ-V3-ASSIGNMENT.mmd) — Assign Vehicle & Driver (Information Expert)
> - [SEQ-V4-TRACKING.mmd](file:///f:/github-project/SG3_2-Assignment3_Object_Design/docs/planning_temporary/working/SEQ-V4-TRACKING.mmd) — Track Shipment (Real-Time Observer Pattern)

---

## 1. Seq-V1: Browse → Search → Place Order

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as "Orders Page\n(src/app/orders/page.tsx)"
    participant Ctrl as "SmartFMController"
    participant OSvc as "OrderService"
    participant CustRepo as "CustomerRepository"
    participant OrdRepo as "OrderRepository"
    participant InvRepo as "InvoiceRepository"
    participant ShpRepo as "ShipmentRepository"

    Customer->>UI: Opens /orders
    UI-->>Customer: Displays empty search form + offerings list
    Customer->>UI: Enters search criteria + clicks "Search"
    UI->>Ctrl: browseOfferings(criteria)
    Ctrl->>OSvc: searchOfferings(criteria)
    OSvc-->>Ctrl: Offering[]
    Ctrl-->>UI: Offering[]
    UI-->>Customer: Displays matching offerings
    Customer->>UI: Clicks "Đặt hàng" on offering
    UI->>Ctrl: placeOrder({customerId, offeringId, goodsDetails})
    Ctrl->>OSvc: createOrder(customerId, offeringId, goodsDetails)
    OSvc->>CustRepo: findById(customerId)
    CustRepo-->>OSvc: Customer
    OSvc->>OrdRepo: save(new Order(...))
    OSvc->>InvRepo: save(new Invoice(...))
    OSvc->>ShpRepo: save(new Shipment(...))
    OSvc-->>Ctrl: OrderConfirmationDTO
    Ctrl-->>UI: Confirmation
    UI-->>Customer: Shows order reference & payment button
```

---

## 2. Seq-V2: Payment Processing

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as "Payment Page\n(src/app/payment/page.tsx)"
    participant Ctrl as "SmartFMController"
    participant PSvc as "PaymentService"
    participant InvRepo as "InvoiceRepository"
    participant Factory as "PaymentStrategyFactory"
    participant Strategy as "PaymentStrategy"
    participant PayRepo as "PaymentRepository"

    Customer->>UI: Opens /payment?invoiceId=INV-001
    UI->>Ctrl: getInvoice(invoiceId)
    Ctrl->>PSvc: getInvoice(invoiceId)
    PSvc->>InvRepo: findById(invoiceId)
    InvRepo-->>PSvc: Invoice
    PSvc-->>Ctrl: InvoiceDTO
    Ctrl-->>UI: InvoiceDTO
    Customer->>UI: Selects method, clicks "Pay"
    UI->>Ctrl: processPayment({invoiceId, method, metadata})
    Ctrl->>PSvc: pay(invoiceId, method, metadata)
    PSvc->>Factory: create(method)
    Factory-->>PSvc: Strategy
    PSvc->>Strategy: process(amount, metadata)
    Strategy-->>PSvc: PaymentResult
    PSvc->>PayRepo: save(new Payment(...))
    PSvc->>InvRepo: save(invoice)
    PSvc-->>Ctrl: Receipt Confirmation
    Ctrl-->>UI: Confirmation
    UI-->>Customer: Shows receipt & "Theo dõi đơn hàng"
```

---

## 3. Seq-V3: Assign Vehicle & Driver

```mermaid
sequenceDiagram
    autonumber
    actor Staff as "Branch Staff"
    participant UI as "Assignment Page\n(src/app/assignment/page.tsx)"
    participant Ctrl as "SmartFMController"
    participant ASvc as "AssignmentService"
    participant SRepo as "ShipmentRepository"
    participant Vehicle as "Vehicle"
    participant Driver as "Driver"
    participant VRepo as "VehicleRepository"
    participant DRepo as "DriverRepository"

    Staff->>UI: Opens /assignment
    UI->>Ctrl: getUnassignedShipments()
    Ctrl->>ASvc: findUnassignedShipments()
    ASvc->>SRepo: findByStatus(UNASSIGNED)
    SRepo-->>ASvc: Shipment[]
    ASvc-->>Ctrl: ShipmentDTO[]
    Ctrl-->>UI: List
    Staff->>UI: Clicks "Phân công" on SHP-001
    UI->>Ctrl: assignVehicleDriver(shipmentId, branchId)
    Ctrl->>ASvc: assign(shipmentId, branchId)
    ASvc->>SRepo: findById(shipmentId)
    SRepo-->>ASvc: Shipment
    ASvc->>VRepo: findAvailableByType(branchId, type)
    VRepo-->>ASvc: Vehicle
    ASvc->>Vehicle: canCarry(weight, volume)
    Vehicle-->>ASvc: true
    ASvc->>DRepo: findAvailableDriver(branchId, type)
    DRepo-->>ASvc: Driver
    ASvc->>Driver: isQualifiedFor(vehicleType)
    Driver-->>ASvc: true
    ASvc->>Vehicle: assignToShipment(shipmentId)
    ASvc->>Driver: assignToShipment(shipmentId)
    ASvc->>VRepo: save(vehicle)
    ASvc->>DRepo: save(driver)
    ASvc->>SRepo: save(shipment)
    ASvc-->>Ctrl: AssignmentResult
    Ctrl-->>UI: Success
    UI-->>Staff: Shows assigned vehicle + driver
```

---

## 4. Seq-V4: Track Shipment

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    actor Driver
    participant UI_C as "Tracking Page (Customer)"
    participant UI_D as "Driver App"
    participant Ctrl as "SmartFMController"
    participant TSvc as "TrackingService"
    participant Shipment as "Shipment"
    participant TU as "TrackingUpdate"
    participant Notifier as "TrackingNotifier"
    participant SRepo as "ShipmentRepository"
    participant TRepo as "TrackingUpdateRepository"

    Customer->>UI_C: Opens /tracking?trackingNo=TRK-001
    UI_C->>Ctrl: trackShipment(trackingNo)
    Ctrl->>TSvc: getTrackingHistory(trackingNo)
    TSvc->>SRepo: findByTrackingNo(trackingNo)
    SRepo-->>TSvc: Shipment
    TSvc->>TRepo: findByShipmentId(shipmentId)
    TRepo-->>TSvc: TrackingUpdate[]
    TSvc-->>Ctrl: TrackingHistoryDTO
    Ctrl-->>UI_C: Data
    UI_C-->>Customer: Renders TrackingTimeline

    Driver->>UI_D: Taps "Đã lấy hàng" (PICKED_UP)
    UI_D->>Ctrl: addTrackingUpdate(trackingNo, PICKED_UP, location)
    Ctrl->>TSvc: addUpdate(trackingNo, status, location)
    TSvc->>SRepo: findByTrackingNo(trackingNo)
    SRepo-->>TSvc: Shipment
    TSvc->>Shipment: shipment.addTrackingUpdate(status, location)
    TSvc->>TRepo: save(TrackingUpdate)
    TSvc->>SRepo: save(Shipment)
    TSvc->>Notifier: notifyObservers(shipmentId, update)
    Notifier-->>UI_C: Push/SSE update (real-time)
    TSvc-->>Ctrl: UpdateConfirmation
    Ctrl-->>UI_D: Success toast
```
