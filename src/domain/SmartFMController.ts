// SmartFMController — Central GRASP Controller Facade for SmartFM Logistics System

import { OrderService, CreateOrderInput, OrderConfirmationDTO } from '../services/OrderService';
import { PaymentService, PaymentConfirmation } from '../services/PaymentService';
import { AssignmentService } from '../services/AssignmentService';
import { TrackingService, TrackingHistory } from '../services/TrackingService';
import { PaymentMethod } from './Payment';
import { ShipmentStatus } from './Shipment';
import { TrackingSource } from './TrackingUpdate';

export class SmartFMController {
  private static instance: SmartFMController;

  private orderService: OrderService;
  private paymentService: PaymentService;
  private assignmentService: AssignmentService;
  private trackingService: TrackingService;

  constructor(
    orderService = new OrderService(),
    paymentService = new PaymentService(),
    assignmentService = new AssignmentService(),
    trackingService = new TrackingService(),
  ) {
    this.orderService = orderService;
    this.paymentService = paymentService;
    this.assignmentService = assignmentService;
    this.trackingService = trackingService;
  }

  public static getInstance(): SmartFMController {
    if (!SmartFMController.instance) {
      SmartFMController.instance = new SmartFMController();
    }
    return SmartFMController.instance;
  }

  // V1 Flow — Browse & Place Order
  public async browseOfferings(criteria?: { goodsType?: string; weight?: number }) {
    return this.orderService.getOfferings(criteria);
  }

  public async placeOrder(input: CreateOrderInput): Promise<OrderConfirmationDTO> {
    return this.orderService.createOrder(input);
  }

  public async getOrder(orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  // V2 Flow — Payment Processing
  public async processPayment(input: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    cardToken?: string;
    reference?: string;
    isDeposit?: boolean;
  }): Promise<PaymentConfirmation> {
    return this.paymentService.processPayment(input);
  }

  // V3 Flow — Vehicle & Driver Assignment
  public async assignVehicleDriver(shipmentId: string, branchId: string) {
    return this.assignmentService.assignVehicleAndDriver(shipmentId, branchId);
  }

  // V4 Flow — Shipment Tracking & Driver Updates
  public async trackShipment(trackingNo: string): Promise<TrackingHistory> {
    return this.trackingService.getTrackingHistory(trackingNo);
  }

  public async addTrackingUpdate(input: {
    trackingNo: string;
    status: ShipmentStatus;
    location: string;
    source?: TrackingSource;
  }) {
    return this.trackingService.addTrackingUpdate(input);
  }
}
