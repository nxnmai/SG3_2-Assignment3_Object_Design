// SmartFMController — GRASP Controller (Larman Ch.17)
// Coordinates all 4 business flows; delegates to Services.
// CHANGES vs A2: No longer creates all domain objects at startup.
// Now only creates Branch; Branch creates its Vehicle/Staff/Driver (Creator pattern).

import { OrderService } from '@/services/OrderService';
import { PaymentService } from '@/services/PaymentService';
import { AssignmentService } from '@/services/AssignmentService';
import { TrackingService } from '@/services/TrackingService';
import { BranchRepository } from '@/repositories/BranchRepository';
import { CustomerRepository } from '@/repositories/CustomerRepository';
import { Branch } from '@/domain/Branch';
import { Customer } from '@/domain/Customer';

export class SmartFMController {
  private orderService: OrderService;
  private paymentService: PaymentService;
  private assignmentService: AssignmentService;
  private trackingService: TrackingService;
  private branchRepository: BranchRepository;
  private customerRepository: CustomerRepository;

  constructor(
    orderService: OrderService,
    paymentService: PaymentService,
    assignmentService: AssignmentService,
    trackingService: TrackingService,
    branchRepository: BranchRepository,
    customerRepository: CustomerRepository
  ) {
    this.orderService = orderService;
    this.paymentService = paymentService;
    this.assignmentService = assignmentService;
    this.trackingService = trackingService;
    this.branchRepository = branchRepository;
    this.customerRepository = customerRepository;
  }

  // ===== V1: Browse → Search → Place Order =====
  async browseOfferings(criteria: {
    origin: string;
    destination: string;
    date: Date;
    goodsType: string;
    weight: number;
  }) {
    return this.orderService.searchOfferings(criteria);
  }

  async placeOrder(input: {
    customerId: string;
    offeringId: string;
    goodsDetails: { description: string; weight: number; dimensions?: string };
  }) {
    return this.orderService.createOrder(input.customerId, input.offeringId, input.goodsDetails);
  }

  // ===== V2: Payment =====
  async processPayment(input: {
    invoiceId: string;
    method: 'CASH' | 'CARD' | 'BANK_TRANSFER';
    cardToken?: string;
  }) {
    return this.paymentService.pay(input.invoiceId, input.method, input.cardToken);
  }

  // ===== V3: Assign Vehicle & Driver =====
  async assignVehicleDriver(shipmentId: string, branchId: string) {
    return this.assignmentService.assign(shipmentId, branchId);
  }

  // ===== V4: Track Shipment =====
  async trackShipment(trackingNo: string) {
    return this.trackingService.getTrackingHistory(trackingNo);
  }

  async addTrackingUpdate(input: { trackingNo: string; status: string; location: string }) {
    return this.trackingService.addUpdate(input.trackingNo, input.status, input.location);
  }

  // ===== Bootstrap (Creator pattern: Controller only creates Branch) =====
  async initialize(): Promise<void> {
    // 1. Load branches from JSON (BranchRepository uses JsonFileRepository)
    const branches = await this.branchRepository.findAll();
    
    // 2. Each Branch reconstructs its Vehicles, Staff, Drivers from stored data
    //    (Branch.createFromStoredData() handles this - Creator pattern)
    for (const branch of branches) {
      await branch.rehydrateResources();
    }
    
    console.log('[SmartFMController] System initialized:', branches.length, 'branches loaded');
  }

  // Customer registration (T4 from A1)
  async registerCustomer(input: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }): Promise<Customer> {
    return this.customerRepository.save(new Customer(input));
  }
}