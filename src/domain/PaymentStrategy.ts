// PaymentStrategy — Strategy Pattern (A2 feedback: was deferred, now implemented)
// CHANGES vs A2: Concrete payment-method variation extracted to separate classes

export interface PaymentStrategy {
  readonly method: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  process(amount: number, metadata?: Record<string, any>): Promise<{ success: boolean; transactionRef?: string; error?: string }>;
}

// Cash: in-branch only (A21)
export class CashStrategy implements PaymentStrategy {
  readonly method = 'CASH' as const;
  async process(amount: number) {
    // Simplified: always succeeds, generates reference
    return { success: true, transactionRef: `CSH-${Date.now()}` };
  }
}

// Card: via payment gateway (A21, A22 - no raw card details stored)
export class CardStrategy implements PaymentStrategy {
  readonly method = 'CARD' as const;
  async process(amount: number, metadata?: { cardToken: string }) {
    if (!metadata?.cardToken) {
      return { success: false, error: 'Thiếu token thẻ. Vui lòng thử lại.' };
    }
    // Simulate gateway call
    await new Promise(r => setTimeout(r, 500));
    return { success: true, transactionRef: `CRD-${Date.now()}` };
  }
}

// Bank Transfer: reference number provided by customer
export class BankTransferStrategy implements PaymentStrategy {
  readonly method = 'BANK_TRANSFER' as const;
  async process(amount: number, metadata?: { referenceNo: string }) {
    if (!metadata?.referenceNo) {
      return { success: false, error: 'Vui lòng cung cấp mã tham chiếu chuyển khoản.' };
    }
    return { success: true, transactionRef: `BNK-${metadata.referenceNo}` };
  }
}

// Factory for strategy selection
export class PaymentStrategyFactory {
  static create(method: 'CASH' | 'CARD' | 'BANK_TRANSFER'): PaymentStrategy {
    switch (method) {
      case 'CASH': return new CashStrategy();
      case 'CARD': return new CardStrategy();
      case 'BANK_TRANSFER': return new BankTransferStrategy();
      default: throw new Error(`Phương thức thanh toán không hỗ trợ: ${method}`);
    }
  }
}