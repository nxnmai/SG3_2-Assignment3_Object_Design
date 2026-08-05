'use client';

import { FormEvent, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentMethod } from '../../domain/Payment';
import { PaymentService } from '../../services/PaymentService';
import { ShieldCheck, CreditCard, Landmark, Banknote, ArrowRight } from 'lucide-react';

function PaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentService] = useState(() => new PaymentService());

  const [invoiceId, setInvoiceId] = useState('INV-001');
  const [amount, setAmount] = useState('250000');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [cardHolder, setCardHolder] = useState('NGUYEN VAN A');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [reference, setReference] = useState('');
  const [isDeposit, setIsDeposit] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<{ message: string; trackingNo?: string } | null>(null);

  useEffect(() => {
    const queryInvoice = searchParams.get('invoiceId') || invoiceId;
    if (queryInvoice) {
      setInvoiceId(queryInvoice);
      paymentService
        .getInvoice(queryInvoice)
        .then((inv) => {
          if (inv) {
            const bal = inv.getBalance ? inv.getBalance() : inv.totalAmount;
            setAmount(bal.toString());
          }
        })
        .catch(() => {
          // Keep default amount if invoice lookup is pending
        });
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setReceipt(null);

    const numericAmount = Number(amount);
    if (!method) {
      setError('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Số tiền không hợp lệ. Vui lòng nhập số tiền lớn hơn 0.');
      return;
    }

    if (method === PaymentMethod.CARD) {
      if (cardNumber.toLowerCase().includes('invalid') || cardNumber.toLowerCase().includes('expired')) {
        setError('Thanh toán thất bại. Thẻ không hợp lệ hoặc đã hết hạn.');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await paymentService.processPayment({
        invoiceId,
        amount: numericAmount,
        method,
        cardToken: cardNumber,
        reference,
        isDeposit,
      });

      if (result.success) {
        setReceipt({
          message: result.receiptMessage,
          trackingNo: 'TRK-001',
        });
      } else {
        setError(result.error || 'Thanh toán thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Phương Thức Thanh Toán</h1>
        <p className="text-xs text-slate-500 mt-1">Flow V2 / U3 — Cổng thanh toán mô phỏng an toàn cho hóa đơn SmartFM.</p>
      </div>

      {error && (
        <div className="p-4 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-2xl">
          {error}
        </div>
      )}

      {receipt ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl space-y-4 text-emerald-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Biên Lai Thanh Toán</h2>
              <span className="text-xs text-emerald-700 font-mono">Giao dịch đã được ghi nhận trên hệ thống SmartFM</span>
            </div>
          </div>

          <p className="text-sm font-semibold pt-2">{receipt.message}</p>

          <div className="border-t border-emerald-200 pt-4 flex gap-4">
            <button
              onClick={() => router.push('/tracking')}
              className="bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-emerald-800 transition text-xs uppercase tracking-wider shadow-md"
            >
              Theo Dõi Đơn Hàng Ngay →
            </button>
            <button
              onClick={() => setReceipt(null)}
              className="bg-white text-emerald-800 border border-emerald-300 font-bold px-6 py-3 rounded-xl hover:bg-emerald-100/50 transition text-xs uppercase tracking-wider"
            >
              Giao Dịch Khác
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/60 p-6 rounded-3xl border border-blue-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider">Thanh Toán An Toàn</h3>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mã Hóa Đơn</span>
                <span className="text-xl font-mono font-black text-slate-900 block mt-0.5">{invoiceId}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tổng Số Tiền</span>
                <span className="text-3xl font-black text-blue-700 block mt-0.5">
                  {Number(amount).toLocaleString()} <span className="text-base font-bold text-slate-600">VND</span>
                </span>
              </div>

              <div className="border-t border-blue-200/60 pt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>🔒 Mã hóa SSL 256-bit</span>
                <span>•</span>
                <span>Bảo vệ 100%</span>
              </div>
            </div>
          </div>

          {/* Right Payment Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setMethod(PaymentMethod.CARD)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  method === PaymentMethod.CARD ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ Tín Dụng</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod(PaymentMethod.BANK_TRANSFER)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  method === PaymentMethod.BANK_TRANSFER ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>Chuyển Khoản</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod(PaymentMethod.CASH)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition ${
                  method === PaymentMethod.CASH ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Tiền Mặt</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {method === PaymentMethod.CARD && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Tên Chủ Thẻ
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-3 text-xs font-bold uppercase bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Số Thẻ
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Dùng invalid hoặc expired để thử nghiệm lỗi"
                      className="w-full p-3 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Ngày Hết Hạn
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-3 text-xs font-semibold text-center bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="***"
                        className="w-full p-3 text-xs font-semibold text-center bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              {method === PaymentMethod.BANK_TRANSFER && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mã Tham Chiếu Ngân Hàng
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Nhập mã giao dịch chuyển khoản (tùy chọn)"
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              )}

              {method === PaymentMethod.CASH && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  Thanh toán bằng tiền mặt sẽ được thực hiện trực tiếp tại chi nhánh kho gửi hàng.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Đang Xử Lý...' : 'Thanh Toán Ngay'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <PaymentFormContent />
    </Suspense>
  );
}
