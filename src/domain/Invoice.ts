// Invoice — domain class (ported/refined from Assignment 2 design)

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
}

export class Invoice {
  public readonly id: string;
  public readonly orderId: string;
  public readonly totalAmount: number;
  public paidAmount: number;
  public status: InvoiceStatus;
  public readonly createdAt: Date;

  constructor(
    id: string,
    orderId: string,
    totalAmount: number,
    paidAmount = 0,
    status: InvoiceStatus = InvoiceStatus.UNPAID,
    createdAt: Date = new Date(),
  ) {
    if (!id || !id.trim()) throw new Error('Invoice ID cannot be empty.');
    if (!orderId || !orderId.trim()) throw new Error('Order ID cannot be empty.');
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new Error('Invoice total amount must be greater than zero.');
    }

    this.id = id.trim();
    this.orderId = orderId.trim();
    this.totalAmount = totalAmount;
    this.paidAmount = Math.max(0, paidAmount);
    this.status = status;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);

    this.recalculateStatus();
  }

  public getBalance(): number {
    return Math.max(0, this.totalAmount - this.paidAmount);
  }

  public recordPayment(amount: number, isDeposit = false): number {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Số tiền không hợp lệ. Vui lòng nhập số tiền lớn hơn 0.');
    }

    const currentBalance = this.getBalance();
    if (currentBalance <= 0) {
      throw new Error('Hóa đơn này đã được thanh toán hoàn tất.');
    }

    if (amount > currentBalance) {
      throw new Error(`Số tiền thanh toán (${amount.toLocaleString()} VND) vượt quá số dư còn lại (${currentBalance.toLocaleString()} VND).`);
    }

    this.paidAmount += amount;
    this.recalculateStatus(isDeposit);
    return this.getBalance();
  }

  public isFullyPaid(): boolean {
    return this.status === InvoiceStatus.PAID || this.getBalance() <= 0;
  }

  private recalculateStatus(isDeposit = false): void {
    if (this.paidAmount >= this.totalAmount) {
      this.status = InvoiceStatus.PAID;
    } else if (this.paidAmount > 0 || isDeposit) {
      this.status = InvoiceStatus.PARTIALLY_PAID;
    } else {
      this.status = InvoiceStatus.UNPAID;
    }
  }
}
