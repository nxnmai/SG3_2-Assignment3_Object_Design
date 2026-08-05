// OrderService — Application Service Layer for V1 Browse → Search → Place Order Flow

import { Order, OrderStatus } from '../domain/Order';
import { Invoice } from '../domain/Invoice';
import { Shipment, ShipmentStatus } from '../domain/Shipment';
import { TrackingSource } from '../domain/TrackingUpdate';
import { VehicleType } from '../domain/Vehicle';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { OrderRepository } from '../repositories/OrderRepository';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { ShipmentRepository } from '../repositories/ShipmentRepository';
import { generateId } from '../utils/idGenerator';

export interface ServiceOffering {
  id: string;
  name: string;
  goodsType: string;
  baseRate: number;
  ratePerKg: number;
  estimatedHours: number;
  requiredVehicleType: VehicleType;
}

export interface CreateOrderInput {
  customerId: string;
  offeringId: string;
  goodsDescription: string;
  origin: string;
  destination: string;
  weight: number;
  volume?: number;
}

export interface OrderConfirmationDTO {
  order: Order;
  invoice: Invoice;
  shipment: Shipment;
}

export class OrderService {
  private static readonly SAMPLE_OFFERINGS: ServiceOffering[] = [
    {
      id: 'OFF-STD',
      name: 'Gói Tiêu Chuẩn (Nhanh)',
      goodsType: 'Hàng thông thường',
      baseRate: 100000,
      ratePerKg: 15000,
      estimatedHours: 24,
      requiredVehicleType: VehicleType.VAN,
    },
    {
      id: 'OFF-EXP',
      name: 'Gói Hỏa Tốc (24h)',
      goodsType: 'Hàng thông thường',
      baseRate: 200000,
      ratePerKg: 25000,
      estimatedHours: 12,
      requiredVehicleType: VehicleType.VAN,
    },
    {
      id: 'OFF-FRG',
      name: 'Gói Hàng Dễ Vỡ / Bảo Hiểm',
      goodsType: 'Hàng dễ vỡ',
      baseRate: 250000,
      ratePerKg: 30000,
      estimatedHours: 24,
      requiredVehicleType: VehicleType.TRUCK_2T,
    },
    {
      id: 'OFF-CLD',
      name: 'Gói Hàng Đông Lạnh / Bảo Quản',
      goodsType: 'Đông lạnh',
      baseRate: 350000,
      ratePerKg: 40000,
      estimatedHours: 18,
      requiredVehicleType: VehicleType.TRUCK_5T,
    },
  ];

  constructor(
    private customerRepo: CustomerRepository = new CustomerRepository(),
    private orderRepo: OrderRepository = new OrderRepository(),
    private invoiceRepo: InvoiceRepository = new InvoiceRepository(),
    private shipmentRepo: ShipmentRepository = new ShipmentRepository(),
  ) {}

  public getOfferings(criteria?: { goodsType?: string; weight?: number }): ServiceOffering[] {
    let offerings = OrderService.SAMPLE_OFFERINGS;
    if (criteria?.goodsType && criteria.goodsType.trim()) {
      const typeStr = criteria.goodsType.trim().toLowerCase();
      offerings = offerings.filter(o => o.goodsType.toLowerCase().includes(typeStr));
    }
    return offerings;
  }

  public getOfferingById(offeringId: string): ServiceOffering | null {
    return OrderService.SAMPLE_OFFERINGS.find(o => o.id === offeringId) || null;
  }

  public async createOrder(input: CreateOrderInput): Promise<OrderConfirmationDTO> {
    if (!input.customerId?.trim()) {
      throw new Error('Vui lòng đăng ký/đăng nhập để hoàn tất đặt hàng.');
    }

    const offering = this.getOfferingById(input.offeringId) || OrderService.SAMPLE_OFFERINGS[0];

    const orderId = generateId('ORD');
    const order = new Order(
      orderId,
      input.customerId,
      offering.id,
      input.goodsDescription,
      input.origin,
      input.destination,
      input.weight,
      offering.requiredVehicleType,
      0,
      OrderStatus.PENDING_PAYMENT,
      input.volume || 0.5,
    );
    order.calculateTotal(offering.baseRate, offering.ratePerKg);

    const invoiceId = generateId('INV');
    const invoice = new Invoice(
      invoiceId,
      order.id,
      order.totalAmount,
    );

    const shipmentId = generateId('SHP');
    const trackingNo = generateId('TRK');
    const shipment = new Shipment(
      shipmentId,
      order.id,
      trackingNo,
      order.origin,
      order.destination,
      order.weight,
      order.requiredVehicleType,
      ShipmentStatus.UNASSIGNED,
      undefined,
      undefined,
      order.origin,
      new Date(),
      [],
    );
    shipment.addTrackingUpdate(ShipmentStatus.UNASSIGNED, order.origin, TrackingSource.SYSTEM);

    // Save to repositories
    await this.orderRepo.save(order);
    await this.invoiceRepo.save(invoice);
    await this.shipmentRepo.save(shipment);

    // Add order reference to customer
    try {
      const customer = await this.customerRepo.findById(input.customerId);
      if (customer) {
        customer.addOrder(order.id);
        await this.customerRepo.save(customer);
      }
    } catch (err) {
      // Log or handle missing customer gracefully
    }

    return { order, invoice, shipment };
  }

  public async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepo.findById(orderId);
  }

  public async getCustomerOrders(customerId: string): Promise<Order[]> {
    const orders = await this.orderRepo.findAll();
    return orders.filter(o => o.customerId === customerId);
  }
}
