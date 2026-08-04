// PaymentService — application service layer

import { Payment, PaymentMethod, PaymentStatus } from '../domain/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { generateId } from '../utils/idGenerator';

export interface InvoiceLike {
  id: string;
  getTotal(): number;
  getBalance(): number;
  isPaid(): boolean;
  addPayment(payment: Payment): void;
  generateReceipt(): string;
}

export interface InvoiceRepositoryLike {
  findById(id: string): Promise<InvoiceLike | undefined>;
  save(invoice: InvoiceLike): Promise<void>;
}

export interface PaymentMetadata {
  cardToken?: string;
  reference?: string;
  amount?: number;
  isDeposit?: boolean;
}

export interface PaymentConfirmation {
  payment: Payment;
  receiptMessage: string;
  balance: number;
}

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly invoiceRepository: InvoiceRepositoryLike,
  ) {}

  async getInvoice(invoiceId: string): Promise<InvoiceLike> {
    if (!invoiceId.trim()) throw new Error('Invoice ID cannot be empty.');

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) throw new Error('Hóa đơn không tồn tại.');
    return invoice;
  }

  async pay(
    invoiceId: string,
    method: PaymentMethod,
    metadata: PaymentMetadata = {},
  ): Promise<PaymentConfirmation> {
    const invoice = await this.getInvoice(invoiceId);

    if (invoice.isPaid()) {
      throw new Error('Hóa đơn đã thanh toán.');
    }

    const balance = invoice.getBalance();
    if (!Number.isFinite(balance) || balance <= 0) {
      throw new Error('Hóa đơn không có số tiền cần thanh toán.');
    }

    const amount = metadata.amount ?? balance;
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Số tiền thanh toán phải lớn hơn 0.');
    }
    if (amount > balance) {
      throw new Error('Số tiền thanh toán không được vượt quá số dư hóa đơn.');
    }

    const result = this.processSimulatedPayment(method, metadata);
    const payment = new Payment(
      generateId('PAY'),
      invoiceId,
      method,
      amount,
      result.transactionRef,
      result.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      result.error,
      metadata.isDeposit ?? amount < invoice.getTotal(),
    );

    await this.paymentRepository.save(payment);

    if (!payment.isSuccess()) {
      throw new Error(result.error ?? 'Thanh toán thất bại. Vui lòng thử lại.');
    }

    invoice.addPayment(payment);
    await this.invoiceRepository.save(invoice);

    const newBalance = invoice.getBalance();
    const receiptMessage =
            invoice.generateReceipt() ||
            `Thanh toán ${amount.toLocaleString('vi-VN')} VND thành công`;

    return {
      payment,
      receiptMessage,
      balance: newBalance,
    };
  }

  private processSimulatedPayment(
    method: PaymentMethod,
    metadata: PaymentMetadata,
  ): { success: boolean; transactionRef?: string; error?: string } {
    switch (method) {
      case PaymentMethod.CASH:
        return {
          success: true,
          transactionRef: `CASH-${Date.now()}`,
        };

      case PaymentMethod.BANK_TRANSFER:
        return {
          success: true,
          transactionRef: metadata.reference?.trim() || `BANK-${Date.now()}`,
        };

      case PaymentMethod.CARD: {
        const token = metadata.cardToken?.trim();
        if (!token) {
          return { success: false, error: 'Thẻ không hợp lệ' };
        }
        if (token.toLowerCase() === 'expired') {
          return { success: false, error: 'Thẻ hết hạn' };
        }
        if (token.toLowerCase() === 'invalid') {
          return { success: false, error: 'Thẻ không hợp lệ' };
        }
        return {
          success: true,
          transactionRef: `CARD-${Date.now()}`,
        };
      }

      default:
        return { success: false, error: 'Phương thức thanh toán không hợp lệ.' };
    }
  }
}

