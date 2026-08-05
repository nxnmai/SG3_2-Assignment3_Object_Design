// PaymentService — application service layer

import { Payment, PaymentMethod, PaymentStatus } from '../domain/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { PaymentStrategyFactory } from '../domain/PaymentStrategy';
import { generateId } from '../utils/idGenerator';

export interface InvoiceLike {
  id: string;
  getTotal(): number;
  getBalance(): number;
  isPaid(): boolean;
  addPayment?(payment: Payment): void;
  recordPayment(amount: number, isDeposit?: boolean): number;
  generateReceipt?(): string;
}

export interface PaymentMetadata {
  cardToken?: string;
  reference?: string;
  amount?: number;
  isDeposit?: boolean;
}

export interface PaymentConfirmation {
  success: boolean;
  payment?: Payment;
  receiptMessage: string;
  balance: number;
  error?: string;
}

export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository = new PaymentRepository(),
    private readonly invoiceRepository: InvoiceRepository = new InvoiceRepository(),
  ) {}

  async getInvoice(invoiceId: string): Promise<any> {
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

    if (invoice.isFullyPaid && invoice.isFullyPaid()) {
      throw new Error('Hóa đơn này đã được thanh toán hoàn tất.');
    }

    const currentBalance = invoice.getBalance ? invoice.getBalance() : invoice.totalAmount - (invoice.paidAmount || 0);
    const amountToPay = metadata.amount && metadata.amount > 0 ? metadata.amount : currentBalance;

    if (!Number.isFinite(amountToPay) || amountToPay <= 0) {
      throw new Error('Số tiền không hợp lệ. Vui lòng nhập số tiền lớn hơn 0.');
    }

    // Process via Strategy Pattern
    const strategy = PaymentStrategyFactory.create(method);
    const strategyResult = await strategy.process(amountToPay, metadata);

    if (!strategyResult.success) {
      return {
        success: false,
        receiptMessage: '',
        balance: currentBalance,
        error: strategyResult.error || 'Thanh toán thất bại.',
      };
    }

    const payment = new Payment(
      generateId('PAY'),
      invoice.id,
      method,
      amountToPay,
      strategyResult.transactionRef,
      PaymentStatus.SUCCESS,
      undefined,
      metadata.isDeposit || false,
      new Date(),
    );

    await this.paymentRepository.save(payment);

    if (invoice.recordPayment) {
      invoice.recordPayment(amountToPay, metadata.isDeposit || false);
      await this.invoiceRepository.save(invoice);
    }

    const remainingBalance = invoice.getBalance ? invoice.getBalance() : 0;

    return {
      success: true,
      payment,
      receiptMessage: `Thanh toán thành công ${amountToPay.toLocaleString()} VND qua ${payment.getMethodLabel()}. Mã giao dịch: ${strategyResult.transactionRef}.`,
      balance: remainingBalance,
    };
  }

  async processPayment(input: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    cardToken?: string;
    reference?: string;
    isDeposit?: boolean;
  }): Promise<PaymentConfirmation> {
    return this.pay(input.invoiceId, input.method, {
      amount: input.amount,
      cardToken: input.cardToken,
      reference: input.reference,
      isDeposit: input.isDeposit,
    });
  }
}
