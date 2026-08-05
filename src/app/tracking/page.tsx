'use client';

import { FormEvent, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShipmentStatus } from '../../domain/Shipment';
import { TrackingSource } from '../../domain/TrackingUpdate';
import { TrackingService, TrackingHistory } from '../../services/TrackingService';
import { TrackingNotifier, Observer } from '../../domain/TrackingNotifier';
import { Search, MapPin, Package, FileText, Smartphone } from 'lucide-react';

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.UNASSIGNED]: 'Chưa phân công',
  [ShipmentStatus.PENDING]: 'Đã phân công',
  [ShipmentStatus.PICKED_UP]: 'Đã lấy hàng',
  [ShipmentStatus.IN_TRANSIT]: 'Đang vận chuyển',
  [ShipmentStatus.DELIVERED]: 'Đã hoàn thành',
  [ShipmentStatus.EXCEPTION]: 'Gặp sự cố / Ngoại lệ',
};

const STATUS_STEPS = [
  { key: ShipmentStatus.UNASSIGNED, label: 'Tiếp Nhận' },
  { key: ShipmentStatus.PENDING, label: 'Chờ Xử Lý' },
  { key: ShipmentStatus.PICKED_UP, label: 'Đã Lấy Hàng' },
  { key: ShipmentStatus.IN_TRANSIT, label: 'Đang Giao' },
  { key: ShipmentStatus.DELIVERED, label: 'Hoàn Thành' },
];

function TrackingContent() {
  const searchParams = useSearchParams();
  const [trackingService] = useState(() => new TrackingService());

  const [trackingNo, setTrackingNo] = useState('TRK-001');
  const [trackingData, setTrackingData] = useState<TrackingHistory | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Driver update state (U5 3-tap flow)
  const [activeTab, setActiveTab] = useState<'customer' | 'driver'>('customer');
  const [updateLocation, setUpdateLocation] = useState('Kho TP. Hồ Chí Minh');
  const [updateSource, setUpdateSource] = useState<TrackingSource>(TrackingSource.DRIVER);
  const [updateMessage, setUpdateMessage] = useState('');

  const loadTracking = async (code: string) => {
    if (!code.trim()) {
      setError('Mã theo dõi không được để trống.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await trackingService.getTrackingHistory(code.trim());
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || 'Mã theo dõi không tồn tại. Vui lòng kiểm tra lại.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryTracking = searchParams.get('trackingNo');
    if (queryTracking) {
      setTrackingNo(queryTracking);
      loadTracking(queryTracking);
    } else {
      loadTracking('TRK-001');
    }
  }, [searchParams]);

  // Observer registration for real-time updates
  useEffect(() => {
    const observer: Observer = {
      onTrackingUpdate: (update) => {
        if (trackingData && update.shipmentId === trackingData.shipmentId) {
          loadTracking(trackingNo);
        }
      },
    };

    TrackingNotifier.getInstance().subscribe(observer);
    return () => TrackingNotifier.getInstance().unsubscribe(observer);
  }, [trackingNo, trackingData]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    loadTracking(trackingNo);
  };

  const handleDriverUpdate = async (selectedStatus: ShipmentStatus) => {
    setError('');
    setUpdateMessage('');

    try {
      const result = await trackingService.addTrackingUpdate({
        trackingNo,
        status: selectedStatus,
        location: updateLocation || 'TP. Hồ Chí Minh',
        source: updateSource,
      });

      if (result.success) {
        setUpdateMessage(`Đã cập nhật trạng thái thành công: ${STATUS_LABELS[selectedStatus]}`);
        loadTracking(trackingNo);
      } else {
        setError(result.error || 'Cập nhật trạng thái không hợp lệ.');
      }
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng kiểm tra lại.');
    }
  };

  const currentStepIdx = trackingData
    ? STATUS_STEPS.findIndex((s) => s.key === trackingData.status)
    : -1;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner Search Component */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Theo Dõi Lô Hàng</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhập mã vận đơn của bạn để nhận thông tin cập nhật thời gian thực về trạng thái, vị trí và thời gian giao hàng dự kiến.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              placeholder="TRK-001"
              className="w-full pl-10 pr-3 py-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
          >
            {loading ? '...' : 'Tra Cứu'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Mode Switch Tabs: Customer View U6 vs Driver App U5 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'customer' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Khách Hàng (U6 Timeline)
        </button>
        <button
          onClick={() => setActiveTab('driver')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'driver' ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Tài Xế (U5 3-Tap App)</span>
        </button>
      </div>

      {activeTab === 'customer' ? (
        trackingData && (
          <div className="space-y-6">
            {/* Status Header Progress Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black font-mono text-slate-900">{trackingData.trackingNo}</span>
                    <span className="bg-blue-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {STATUS_LABELS[trackingData.status]}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    Dự kiến giao: 2026-08-06 - 14:30
                  </span>
                </div>

                <button className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition">
                  🔔 Nhận Cập Nhật Tự Động
                </button>
              </div>

              {/* Step Progress Bar */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-2 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                            isPassed
                              ? 'bg-blue-900 text-white shadow-md'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[11px] mt-2 font-bold ${
                            isPassed ? 'text-blue-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Event Timeline */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Chi Tiết Hành Trình
                </h3>

                <div className="space-y-4 pt-2">
                  {trackingData.history.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Chưa có lịch sử cập nhật.</p>
                  ) : (
                    trackingData.history.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {STATUS_LABELS[item.status]}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(item.timestamp).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-slate-600 font-medium mt-1">{item.location}</p>
                          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block mt-1">
                            Nguồn: {item.source}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Cargo Info & Route Panel */}
              <div className="lg:col-span-4 space-y-4">
                {/* Route Snippet Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Lộ Trình</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">ĐIỂM GỬI</span>
                      <span className="font-extrabold text-slate-900 block">{trackingData.origin}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">ĐIỂM NHẬN</span>
                      <span className="font-extrabold text-slate-900 block">{trackingData.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Cargo Info Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Thông Tin Kiện Hàng</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">TRỌNG LƯỢNG</span>
                      <span className="font-black text-slate-900 text-sm">10 kg</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SỐ LƯỢNG</span>
                      <span className="font-black text-slate-900 text-sm">01 Kiện</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Tải Xuống Biên Lai (PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Driver App View U5 */
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900">Giao Diện Tài Xế (U5 — 3-Tap Mobile Updates)</h2>
            <p className="text-xs text-slate-500">Cập nhật nhanh 1-touch trạng thái kiện hàng khi di chuyển.</p>
          </div>

          {updateMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
              {updateMessage}
            </div>
          )}

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mã vận đơn
              </label>
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                className="w-full p-3 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Vị trí hiện tại
              </label>
              <input
                type="text"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
                className="w-full p-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Cập Nhật Trạng Thái Nhanh (3-Tap Buttons)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDriverUpdate(ShipmentStatus.PICKED_UP)}
                  className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl font-bold hover:bg-amber-100 transition text-left"
                >
                  <div className="text-sm font-extrabold">📦 1. Đã Lấy Hàng</div>
                  <div className="text-[11px] text-amber-700 font-normal mt-1">Đã nhận kiện hàng tại kho</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDriverUpdate(ShipmentStatus.IN_TRANSIT)}
                  className="p-4 bg-blue-50 border border-blue-300 text-blue-900 rounded-2xl font-bold hover:bg-blue-100 transition text-left"
                >
                  <div className="text-sm font-extrabold">🚚 2. Đang Vận Chuyển</div>
                  <div className="text-[11px] text-blue-700 font-normal mt-1">Đang trên đường di chuyển</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDriverUpdate(ShipmentStatus.DELIVERED)}
                  className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl font-bold hover:bg-emerald-100 transition text-left"
                >
                  <div className="text-sm font-extrabold">✅ 3. Đã Giao Hàng</div>
                  <div className="text-[11px] text-emerald-700 font-normal mt-1">Xác nhận giao thành công</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
