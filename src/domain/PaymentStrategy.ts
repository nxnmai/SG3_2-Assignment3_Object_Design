// PaymentStrategy — Strategy Pattern implementation (GoF) for Payment Processing

import { PaymentMethod } from './Payment';
import { generateId } from '../utils/idGenerator';

export interface PaymentProcessResult {
  success: boolean;
  transactionRef?: string;
  error?: string;
}

export interface PaymentStrategy {
  readonly method: PaymentMethod;
  process(amount: number, metadata?: Record<string, any>): Promise<PaymentProcessResult>;
}

export class CashStrategy implements PaymentStrategy {
  public readonly method = PaymentMethod.CASH;

  public async process(amount: number, metadata?: Record<string, any>): Promise<PaymentProcessResult> {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền thanh toán phải lớn hơn 0.' };
    }
    const branchId = metadata?.branchId || 'BR-MAIN';
    return {
      success: true,
      transactionRef: `CASH-${branchId}-${generateId('TX')}`,
    };
  }
}

export class CardStrategy implements PaymentStrategy {
  public readonly method = PaymentMethod.CARD;

  public async process(amount: number, metadata?: Record<string, any>): Promise<PaymentProcessResult> {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền thanh toán phải lớn hơn 0.' };
    }

    const cardToken = metadata?.cardToken;
    if (!cardToken || cardToken === 'invalid_card' || cardToken === 'expired_card') {
      return {
        success: false,
        error: 'Thanh toán thất bại. Thẻ không hợp lệ hoặc đã hết hạn.',
      };
    }

    return {
      success: true,
      transactionRef: `CARD-GATEWAY-${generateId('TX')}`,
    };
  }
}

export class BankTransferStrategy implements PaymentStrategy {
  public readonly method = PaymentMethod.BANK_TRANSFER;

  public async process(amount: number, metadata?: Record<string, any>): Promise<PaymentProcessResult> {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền thanh toán phải lớn hơn 0.' };
    }

    return {
      success: true,
      transactionRef: `BANK-${generateId('TX')}`,
    };
  }
}

export class PaymentStrategyFactory {
  public static create(method: PaymentMethod): PaymentStrategy {
    switch (method) {
      case PaymentMethod.CASH:
        return new CashStrategy();
      case PaymentMethod.CARD:
        return new CardStrategy();
      case PaymentMethod.BANK_TRANSFER:
        return new BankTransferStrategy();
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}
