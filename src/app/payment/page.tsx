// Payment page (Flow V2) — simulated payment only, no real processing.
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { PaymentMethod } from '../../domain/Payment';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.CARD]: 'Thẻ',
  [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
};

export default function PaymentPage() {
  const [invoiceId, setInvoiceId] = useState('INV-001');
  const [amount, setAmount] = useState('150000');
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [cardToken, setCardToken] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryInvoice = params.get('invoiceId');
    if (queryInvoice) setInvoiceId(queryInvoice);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setReceipt('');

    const numericAmount = Number(amount);
    if (!method) {
      setError('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Số tiền thanh toán phải lớn hơn 0.');
      return;
    }
    if (!invoiceId.trim()) {
      setError('Mã hóa đơn không được để trống.');
      return;
    }

    if (method === PaymentMethod.CARD) {
      if (!cardToken.trim()) {
        setError('Vui lòng nhập mã thẻ kiểm thử.');
        return;
      }
      if (cardToken.toLowerCase() === 'invalid') {
        setError('Thẻ không hợp lệ.');
        return;
      }
      if (cardToken.toLowerCase() === 'expired') {
        setError('Thẻ hết hạn.');
        return;
      }
    }

    const transactionRef =
            method === PaymentMethod.CASH
              ? `CASH-${Date.now()}`
              : method === PaymentMethod.CARD
                ? `CARD-${Date.now()}`
                : reference.trim() || `BANK-${Date.now()}`;

    setReceipt(
      `Thanh toán ${numericAmount.toLocaleString('vi-VN')} VND thành công. ` +
            `Mã giao dịch: ${transactionRef}.`,
    );
  };

  return (
        <main style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
            <h1>Thanh toán hóa đơn</h1>
            <p>Thanh toán mô phỏng cho Flow V2 — không kết nối cổng thanh toán thật.</p>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
                <label>
                    Mã hóa đơn
                    <input
                        value={invoiceId}
                        onChange={(event) => setInvoiceId(event.target.value)}
                        style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                    />
                </label>

                <label>
                    Số tiền (VND)
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                    />
                </label>

                <label>
                    Phương thức thanh toán
                    <select
                        value={method}
                        onChange={(event) => {
                          setMethod(event.target.value as PaymentMethod | '');
                          setCardToken('');
                          setReference('');
                          setError('');
                        }}
                        style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                    >
                        <option value="">-- Chọn phương thức --</option>
                        {Object.values(PaymentMethod).map((value) => (
                            <option key={value} value={value}>{METHOD_LABELS[value]}</option>
                        ))}
                    </select>
                </label>

                {method === PaymentMethod.CARD && (
                    <label>
                        Mã thẻ kiểm thử
                        <input
                            value={cardToken}
                            onChange={(event) => setCardToken(event.target.value)}
                            placeholder="Nhập token bất kỳ; dùng invalid/expired để kiểm thử lỗi"
                            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                        />
                    </label>
                )}

                {method === PaymentMethod.BANK_TRANSFER && (
                    <label>
                        Mã tham chiếu
                        <input
                            value={reference}
                            onChange={(event) => setReference(event.target.value)}
                            placeholder="Có thể để trống để hệ thống sinh mã"
                            style={{ display: 'block', width: '100%', padding: 10, marginTop: 6 }}
                        />
                    </label>
                )}

                {error && <p role="alert">{error}</p>}
                {receipt && (
                    <section aria-live="polite">
                        <h2>Biên lai</h2>
                        <p>{receipt}</p>
                    </section>
                )}

                <button type="submit" style={{ padding: 12 }}>Xác nhận thanh toán</button>
            </form>
        </main>
  );
}
