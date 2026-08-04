// Payment — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class Payment {
  public readonly id: string;

  public readonly invoiceId: string;

  public readonly method: PaymentMethod;

  public readonly amount: number;

  public readonly transactionRef?: string;

  public readonly status: PaymentStatus;

  public readonly error?: string;

  public readonly isDeposit: boolean;

  public readonly createdAt: Date;

  constructor(
    id: string,
    invoiceId: string,
    method: PaymentMethod,
    amount: number,
    transactionRef?: string,
    status: PaymentStatus = PaymentStatus.PENDING,
    error?: string,
    isDeposit = false,
    createdAt: Date = new Date(),
  ) {
    if (!id.trim()) throw new Error('Payment ID cannot be empty.');
    if (!invoiceId.trim()) throw new Error('Invoice ID cannot be empty.');
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }
    if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
      throw new Error('Invalid payment creation date.');
    }

    this.id = id;
    this.invoiceId = invoiceId;
    this.method = method;
    this.amount = amount;
    this.transactionRef = transactionRef;
    this.status = status;
    this.error = error;
    this.isDeposit = isDeposit;
    this.createdAt = createdAt;
  }

  public isSuccess(): boolean {
    return this.status === PaymentStatus.SUCCESS;
  }

  public isFullSettlement(invoiceTotal: number): boolean {
    return this.isSuccess() && this.amount >= invoiceTotal;
  }

  public getMethodLabel(): string {
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: 'Tiền mặt',
      [PaymentMethod.CARD]: 'Thẻ',
      [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
    };
    return labels[this.method];
  }
}
