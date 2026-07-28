// Order — Domain class (A2 CRC: capture/validate shipment request, multi-shipment support)
// CHANGES vs A2: Explicit validation, Shipment creation, Invoice linking, status tracking

import { idGenerator } from '@/utils/idGenerator';
import { getMessage } from '@/utils/validationMessages';
import { Invoice } from './Invoice';
import { Shipment } from './Shipment';

export interface OrderInput {
  customerId: string;
  offeringId: string;        // from search results
  goodsDescription: string;
  weightKg: number;
  dimensionsCm?: string;     // "LxWxH"
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  public readonly id: string;              // ORD-XXXXXX
  public readonly customerId: string;
  public readonly offeringId: string;
  public readonly goodsDescription: string;
  public readonly weightKg: number;
  public readonly dimensionsCm?: string;
  public readonly createdAt: Date;
  public status: OrderStatus = OrderStatus.DRAFT;
  public readonly invoice: Invoice;
  public readonly shipments: Shipment[] = [];

  constructor(input: OrderInput) {
    // Validation (Information Expert)
    if (!input.customerId) throw new Error(getMessage('required', 'Mã khách hàng'));
    if (!input.offeringId) throw new Error(getMessage('required', 'Mã gói dịch vụ'));
    if (!input.goodsDescription?.trim()) throw new Error(getMessage('required', 'Mô tả hàng hóa'));
    if (input.weightKg <= 0) throw new Error(getMessage('invalidWeight'));

    this.id = idGenerator.generateOrderId();
    this.customerId = input.customerId;
    this.offeringId = input.offeringId;
    this.goodsDescription = input.goodsDescription.trim();
    this.weightKg = input.weightKg;
    this.dimensionsCm = input.dimensionsCm?.trim();
    this.createdAt = new Date();

    // Creates Invoice (Creator pattern)
    this.invoice = new Invoice(this.id, this.calculateCharge());
  }

  // Responsibility: Calculate base charge from offering + weight
  private calculateCharge(): number {
    // Simplified: base rate * weight; real impl would fetch offering details
    const baseRate = 15000; // VND/kg
    return Math.ceil(this.weightKg * baseRate);
  }

  // Responsibility: Create shipment(s) after payment confirmed
  // A2 A12: order may create multiple shipments for multi-destination/multi-vehicle
  createShipments(destinations: { address: string; branchId: string }[]): Shipment[] {
    if (this.status !== OrderStatus.PAID) {
      throw new Error('Chỉ tạo vận đơn sau khi đơn hàng đã thanh toán.');
    }
    for (const dest of destinations) {
      const shipment = new Shipment(this.id, dest.address, dest.branchId);
      this.shipments.push(shipment);
    }
    this.status = OrderStatus.ASSIGNED; // will be updated by AssignmentService
    return this.shipments;
  }

  // Responsibility: Link payment, update status
  markPaid(): void {
    if (!this.invoice.isPaid()) throw new Error('Hóa đơn chưa thanh toán đủ.');
    this.status = OrderStatus.PAID;
  }

  // Responsibility: Cancel (only before dispatch)
  cancel(reason: string): boolean {
    if (this.status === OrderStatus.IN_TRANSIT || this.status === OrderStatus.DELIVERED) {
      throw new Error('Không thể hủy đơn hàng đã giao hoặc đang giao.');
    }
    this.status = OrderStatus.CANCELLED;
    return true;
  }

  // Read-only accessors
  getInvoice(): Invoice { return this.invoice; }
  getShipments(): Shipment[] { return [...this.shipments]; }
  getStatus(): OrderStatus { return this.status; }
}