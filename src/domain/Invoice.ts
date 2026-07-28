// Invoice — Domain class (A2 CRC: charge calculation, payment-state recording)
// CHANGES vs A2: Explicit payment collection, balance tracking, receipt generation

import { idGenerator } from '@/utils/idGenerator';
import { Payment } from './Payment';

export class Invoice {
  public readonly id: string;              // INV-XXXXXX
  public readonly orderId: string;
  public readonly baseAmount: number;      // VND
  public readonly payments: Payment[] = [];
  public readonly createdAt: Date;

  constructor(orderId: string, baseAmount: number) {
    this.id = idGenerator.generateInvoiceId();
    this.orderId = orderId;
    this.baseAmount = baseAmount;
    this.createdAt = new Date();
  }

  // Responsibility: Calculate total including any supplementary charges
  getTotal(): number {
    return this.baseAmount + this.getSupplementaryTotal();
  }

  // Responsibility: Supplementary charges (extra mileage, waiting time)
  private supplementaryCharges: { reason: string; amount: number }[] = [];
  addSupplementaryCharge(reason: string, amount: number): void {
    if (amount <= 0) throw new Error('Số tiền phụ phí phải lớn hơn 0.');
    this.supplementaryCharges.push({ reason, amount });
  }
  private getSupplementaryTotal(): number {
    return this.supplementaryCharges.reduce((sum, c) => sum + c.amount, 0);
  }

  // Responsibility: Record payment (A18-A20: instalments allowed)
  addPayment(payment: Payment): void {
    if (payment.amount <= 0) throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    const paid = this.getPaidAmount();
    if (paid + payment.amount > this.getTotal()) {
      throw new Error('Số tiền thanh toán vượt quá tổng hóa đơn.');
    }
    this.payments.push(payment);
  }

  // Responsibility: Payment state
  getPaidAmount(): number {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }
  getBalance(): number {
    return this.getTotal() - this.getPaidAmount();
  }
  isPaid(): boolean {
    return this.getBalance() <= 0;
  }

  // Responsibility: Generate receipt message (V2 flow)
  generateReceipt(): string {
    return [
      `=== HÓA ĐƠN ${this.id} ===`,
      `Đơn hàng: ${this.orderId}`,
      `Số tiền gốc: ${this.baseAmount.toLocaleString('vi-VN')} VND`,
      this.supplementaryCharges.length > 0
        ? `Phụ phí: ${this.getSupplementaryTotal().toLocaleString('vi-VN')} VND`
        : '',
      `TỔNG CỘNG: ${this.getTotal().toLocaleString('vi-VN')} VND`,
      `ĐÃ THANH TOÁN: ${this.getPaidAmount().toLocaleString('vi-VN')} VND`,
      `CÒN LẠI: ${this.getBalance().toLocaleString('vi-VN')} VND`,
      this.isPaid() ? '✅ ĐÃ THANH TOÁN ĐỦ' : '⏳ CHƯA THANH TOÁN ĐỦ',
      `Ngày: ${this.createdAt.toLocaleString('vi-VN')}`
    ].filter(Boolean).join('\n');
  }

  // Read-only
  getOrderId(): string { return this.orderId; }
  getPayments(): Payment[] { return [...this.payments]; }
}