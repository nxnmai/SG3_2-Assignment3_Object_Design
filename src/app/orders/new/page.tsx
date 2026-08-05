'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderService } from '../../../services/OrderService';
import { Package, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

function OrderPlacementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderService] = useState(() => new OrderService());

  const offeringId = searchParams.get('offeringId') || 'OFF-STD';
  const origin = searchParams.get('origin') || 'BR-HCM';
  const destination = searchParams.get('destination') || 'BR-HN';
  const weight = parseFloat(searchParams.get('weight') || '5');

  const offering = orderService.getOfferingById(offeringId);
  const baseRate = offering?.baseRate || 150000;
  const ratePerKg = offering?.ratePerKg || 15000;

  const [goodsDescription, setGoodsDescription] = useState('2 thùng tài liệu máy tính');
  const [packageCount, setPackageCount] = useState(1);
  const [isFragile, setIsFragile] = useState(false);
  const [lengthCm, setLengthCm] = useState('30');
  const [widthCm, setWidthCm] = useState('20');
  const [heightCm, setHeightCm] = useState('15');

  const [senderName, setSenderName] = useState('Nguyễn Văn A');
  const [senderPhone, setSenderPhone] = useState('0901234567');
  const [senderAddress, setSenderAddress] = useState('123 Nguyễn Huệ, Quận 1, TP.HCM');

  const [recipientName, setRecipientName] = useState('Trần Thị B');
  const [recipientPhone, setRecipientPhone] = useState('0988776655');
  const [recipientAddress, setRecipientAddress] = useState('45 Tràng Tiền, Hoàn Kiếm, Hà Nội');

  const fragileFee = isFragile ? 30000 : 0;
  const totalAmount = baseRate + weight * ratePerKg + fragileFee;

  const [waybillNo, setWaybillNo] = useState('VN-892401');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWaybillNo(`VN-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodsDescription.trim()) {
      setError('Vui lòng nhập mô tả hàng hóa.');
      return;
    }
    if (!senderName.trim() || !senderPhone.trim()) {
      setError('Vui lòng đăng ký/đăng nhập để hoàn tất đặt hàng.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await orderService.createOrder({
        customerId: 'CUST-001',
        offeringId,
        goodsDescription: `${goodsDescription}${isFragile ? ' (Hàng dễ vỡ)' : ''}`,
        origin,
        destination,
        weight,
      });

      router.push(`/orders/${result.order.id}`);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn hàng.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Step Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
            Bước 2 / 3
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-0.5">Chi Tiết Đơn Hàng</h1>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          VẬN ĐƠN #{waybillNo}
        </span>
      </div>

      {error && (
        <div className="p-4 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Goods Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Thông Tin Hàng Hóa</h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mô Tả Chi Tiết *
              </label>
              <textarea
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                rows={3}
                placeholder="Vd: Thiết bị điện tử, linh kiện máy tính..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Khối Lượng (KG)
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${weight} KG`}
                  className="w-full p-3 text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Số Lượng Kiện
                </label>
                <input
                  type="number"
                  min="1"
                  value={packageCount}
                  onChange={(e) => setPackageCount(parseInt(e.target.value) || 1)}
                  className="w-full p-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Kích Thước Ước Tính (Dài x Rộng x Cao cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Dài (cm)"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  className="p-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-center"
                />
                <input
                  type="text"
                  placeholder="Rộng (cm)"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  className="p-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-center"
                />
                <input
                  type="text"
                  placeholder="Cao (cm)"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="p-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-center"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="w-4 h-4 text-blue-700 rounded"
                />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Hàng Dễ Vỡ / Yêu Cầu Xử Lý Đặc Biệt 🍷
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Phụ phí xử lý nhẹ nhàng 30.000đ sẽ được áp dụng.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Sender & Recipient Location Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Thông Tin Giao Nhận</h3>
            </div>

            {/* Sender Info */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider block">
                1. Điểm Lấy Hàng ({origin})
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tên người gửi"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Địa chỉ kho lấy hàng"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Recipient Info */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
                2. Điểm Giao Hàng ({destination})
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tên người nhận"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Địa chỉ điểm giao hàng"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-xl space-y-5">
            <h3 className="text-lg font-black border-b border-blue-800 pb-3">Tóm Tắt Đơn Hàng</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-blue-200">
                <span>Gói dịch vụ:</span>
                <span className="font-bold text-white">{offering?.name}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Phí cơ bản:</span>
                <span className="font-semibold text-white">{baseRate.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Phí theo khối lượng ({weight}kg):</span>
                <span className="font-semibold text-white">{(weight * ratePerKg).toLocaleString()} đ</span>
              </div>
              {isFragile && (
                <div className="flex justify-between text-amber-300">
                  <span>Phụ phí hàng dễ vỡ:</span>
                  <span className="font-semibold">{fragileFee.toLocaleString()} đ</span>
                </div>
              )}
            </div>

            <div className="border-t border-blue-800 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Tổng Cộng</span>
                <span className="text-3xl font-black text-white">{totalAmount.toLocaleString()} <span className="text-base">đ</span></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-900 hover:bg-blue-50 font-black py-4 rounded-xl shadow-lg transition text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Đang Khởi Tạo Đơn...' : 'Xác Nhận & Đặt Hàng →'}
            </button>
          </div>

          {/* Insurance Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 text-xs space-y-2 flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900 block">Bảo hiểm hàng hóa</span>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                Tất cả các chuyến hàng đều được bảo hiểm mặc định lên đến 20,000,000đ.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function OrderPlacementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <OrderPlacementContent />
    </Suspense>
  );
}
