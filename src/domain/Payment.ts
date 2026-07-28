// Payment — Domain class (A2 CRC: record individual payment transactions)
// CHANGES vs A2: Delegates to PaymentStrategy; records outcome only

import { idGenerator } from '@/utils/idGenerator';
import { PaymentStrategy, PaymentStrategyFactory } from './PaymentStrategy';

export interface PaymentInput {
  invoiceId: string;
  method: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  amount: number;
  metadata?: Record<string, any>; // cardToken, referenceNo, etc.
}

export class Payment {
  public readonly id: string;              // PAY-XXXXXX
  public readonly invoiceId: string;
  public readonly method: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  public readonly amount: number;
  public readonly transactionRef: string;
  public readonly status: 'SUCCESS' | 'FAILED';
  public readonly error?: string;
  public readonly createdAt: Date;

  private constructor(
    id: string,
    invoiceId: string,
    method: 'CASH' | 'CARD' | 'BANK_TRANSFER',
    amount: number,
    transactionRef: string,
    status: 'SUCCESS' | 'FAILED',
    error?: string
  ) {
    this.id = id;
    this.invoiceId = invoiceId;
    this.method = method;
    this.amount = amount;
    this.transactionRef = transactionRef;
    this.status = status;
    this.error = error;
    this.createdAt = new Date();
  }

  // Factory: process payment via Strategy, return Payment record
  static async process(input: PaymentInput): Promise<Payment> {
    const strategy = PaymentStrategyFactory.create(input.method);
    const result = await strategy.process(input.amount, input.metadata);

    return new Payment(
      idGenerator.generatePaymentId(),
      input.invoiceId,
      input.method,
      input.amount,
      result.transactionRef || `ERR-${Date.now()}`,
      result.success ? 'SUCCESS' : 'FAILED',
      result.error
    );
  }

  // Read-only
  isSuccess(): boolean { return this.status === 'SUCCESS'; }
  getMethodLabel(): string {
    switch (this.method) {
      case 'CASH': return 'Tiền mặt';
      case 'CARD': return 'Thẻ';
      case 'BANK_TRANSFER': return 'Chuyển khoản';
    }
  }
}