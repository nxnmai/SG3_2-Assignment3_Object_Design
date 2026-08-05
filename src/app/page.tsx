import Link from 'next/link';
import { Package, CreditCard, Truck, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-4 border border-blue-800/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-300" />
          <span className="bg-blue-800/80 text-blue-100 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            SWE30003 — Assignment 3 Object Design Implementation
          </span>
        </div>

        <h1 className="text-4xl font-black tracking-tight">
          Hệ Thống Quản Lý Kho Vận Thông Minh <br />
          <span className="text-blue-300">ABC-Trans (SmartFM Logistics)</span>
        </h1>

        <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
          Nền tảng số hóa vận tải đa phương thức hỗ trợ đầy đủ 4 quy trình kinh doanh cốt lõi (Browse & Order, Payment Processing, Resource Assignment, Real-Time Tracking).
        </p>

        <div className="pt-2 flex gap-4">
          <Link
            href="/orders"
            className="bg-white text-blue-950 font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <span>Đặt Hàng Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tracking"
            className="bg-blue-800/60 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition text-xs uppercase tracking-wider border border-blue-700/50"
          >
            Theo Dõi Đơn Hàng
          </Link>
        </div>
      </div>

      {/* 4 Core Business Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* V1 Card */}
        <Link
          href="/orders"
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition space-y-4 group border-l-4 border-l-blue-600 block"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
              <Package className="w-6 h-6" />
            </div>
            <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flow V1 / U1-U2
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition">
              1. Tra Cứu & Đặt Hàng (Browse & Order)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Báo giá trực tuyến theo tuyến đường, khối lượng và loại hàng hóa. Khởi tạo đơn hàng & xuất hóa đơn tự động.
            </p>
          </div>

          <div className="text-xs font-extrabold text-blue-700 flex items-center gap-1 pt-1">
            <span>Khám phá quy trình V1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* V2 Card */}
        <Link
          href="/payment"
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition space-y-4 group border-l-4 border-l-emerald-600 block"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flow V2 / U3
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
              2. Thanh Toán Hóa Đơn (Payment Processing)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Thanh toán linh hoạt qua Strategy Pattern (Thẻ, Tiền mặt, Chuyển khoản) với hỗ trợ đặt cọc & xuất biên lai.
            </p>
          </div>

          <div className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 pt-1">
            <span>Khám phá quy trình V2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* V3 Card */}
        <Link
          href="/assignment"
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition space-y-4 group border-l-4 border-l-amber-600 block"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
              <Truck className="w-6 h-6" />
            </div>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flow V3 / U4
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition">
              3. Điều Phối Xe & Tài Xế (Resource Assignment)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Dành cho nhân viên chi nhánh: ghép nối xe đủ tải trọng và tài xế có bằng lái hợp lệ cho đơn hàng đã thanh toán.
            </p>
          </div>

          <div className="text-xs font-extrabold text-amber-700 flex items-center gap-1 pt-1">
            <span>Khám phá quy trình V3</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* V4 Card */}
        <Link
          href="/tracking"
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-lg transition space-y-4 group border-l-4 border-l-purple-600 block"
        >
          <div className="flex justify-between items-center">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="bg-purple-50 text-purple-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Flow V4 / U5-U6
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition">
              4. Theo Dõi Đơn Hàng Real-Time (Tracking)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Timeline hành trình cập nhật thời gian thực qua Observer Pattern & ứng dụng 3-touch dành cho tài xế.
            </p>
          </div>

          <div className="text-xs font-extrabold text-purple-700 flex items-center gap-1 pt-1">
            <span>Khám phá quy trình V4</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Security & Compliance Footer Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-700" />
          <div>
            <span className="text-xs font-extrabold text-slate-900 block">Tuân Thủ Thiết Kế Đối Tượng Assignment 3</span>
            <span className="text-[11px] text-slate-500 block">Được kiểm thử và xác thực với 100% Type Safety & Seed Data</span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          SmartFM v1.0.0
        </span>
      </div>
    </div>
  );
}
