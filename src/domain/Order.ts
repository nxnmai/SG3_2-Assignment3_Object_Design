// Order — domain class (ported/refined from Assignment 2 design)

import { VehicleType } from './Vehicle';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  public readonly id: string;
  public readonly customerId: string;
  public readonly offeringId: string;
  public goodsDescription: string;
  public origin: string;
  public destination: string;
  public weight: number;
  public volume: number;
  public requiredVehicleType: VehicleType;
  public status: OrderStatus;
  public totalAmount: number;
  public readonly createdAt: Date;

  constructor(
    id: string,
    customerId: string,
    offeringId: string,
    goodsDescription: string,
    origin: string,
    destination: string,
    weight: number,
    requiredVehicleType: VehicleType = VehicleType.VAN,
    totalAmount = 0,
    status: OrderStatus = OrderStatus.PENDING_PAYMENT,
    volume = 0.5,
    createdAt: Date = new Date(),
  ) {
    if (!id || !id.trim()) throw new Error('Order ID cannot be empty.');
    if (!customerId || !customerId.trim()) throw new Error('Customer ID cannot be empty.');
    if (!offeringId || !offeringId.trim()) throw new Error('Offering ID cannot be empty.');
    if (!goodsDescription || !goodsDescription.trim()) throw new Error('Vui lòng nhập mô tả hàng hóa.');
    if (!origin || !origin.trim() || !destination || !destination.trim()) {
      throw new Error('Vui lòng chọn điểm đi và điểm đến.');
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new Error('Trọng lượng phải lớn hơn 0 kg.');
    }
    if (!Number.isFinite(volume) || volume < 0) {
      throw new Error('Thể tích hàng hóa không hợp lệ.');
    }

    this.id = id.trim();
    this.customerId = customerId.trim();
    this.offeringId = offeringId.trim();
    this.goodsDescription = goodsDescription.trim();
    this.origin = origin.trim();
    this.destination = destination.trim();
    this.weight = weight;
    this.volume = volume;
    this.requiredVehicleType = requiredVehicleType;
    this.status = status;
    this.totalAmount = totalAmount > 0 ? totalAmount : this.calculateTotal(100000, 15000);
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  public calculateTotal(baseRate: number, ratePerKg: number): number {
    const calculated = baseRate + this.weight * ratePerKg;
    this.totalAmount = Math.max(calculated, baseRate);
    return this.totalAmount;
  }

  public updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  public cancel(): void {
    if (this.status === OrderStatus.IN_TRANSIT || this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel an order that is in transit or already delivered.');
    }
    this.status = OrderStatus.CANCELLED;
  }

  public isPaid(): boolean {
    return (
      this.status === OrderStatus.PAID ||
      this.status === OrderStatus.ASSIGNED ||
      this.status === OrderStatus.IN_TRANSIT ||
      this.status === OrderStatus.DELIVERED
    );
  }
}
