import React, { useState } from 'react';
import { MapPin, Calendar, Weight, ArrowRight } from 'lucide-react';

export interface SearchCriteria {
  origin: string;
  destination: string;
  goodsType: string;
  weight: number;
}

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState('BR-HCM');
  const [destination, setDestination] = useState('BR-HN');
  const [goodsType, setGoodsType] = useState('Hàng thông thường');
  const [weight, setWeight] = useState(5);
  const [date, setDate] = useState('2026-08-05');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || origin === destination) {
      setError('Vui lòng chọn điểm đi và điểm đến (khác nhau).');
      return;
    }
    if (!weight || weight <= 0) {
      setError('Trọng lượng phải lớn hơn 0 kg.');
      return;
    }

    setError('');
    onSearch({ origin, destination, goodsType, weight });
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-100/40 p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Hero Text Section */}
        <div className="lg:col-span-6 space-y-5">
          <span className="bg-blue-600/10 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Báo Giá Trực Tuyến
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Vận chuyển nhanh chóng. <br />
            <span className="text-blue-700">Minh bạch & Tối ưu.</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md">
            Nhập thông tin tuyến đường và khối lượng để nhận báo giá theo thời gian thực cho các tùy chọn giao hàng trên toàn quốc.
          </p>

          <div className="flex gap-8 pt-4 border-t border-slate-200/60">
            <div>
              <span className="text-2xl font-black text-slate-900 block">99.8%</span>
              <span className="text-xs font-semibold text-slate-500 block">Đúng Hẹn</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">63+</span>
              <span className="text-xs font-semibold text-slate-500 block">Tỉnh Thành</span>
            </div>
          </div>
        </div>

        {/* Right Floating Search Box */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 space-y-4"
          >
            {error && (
              <div className="p-3 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Điểm Đi
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-blue-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="BR-HCM">Chi nhánh TP.HCM (BR-HCM)</option>
                    <option value="BR-HN">Chi nhánh Hà Nội (BR-HN)</option>
                    <option value="BR-DN">Chi nhánh Đà Nẵng (BR-DN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Điểm Đến
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-blue-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="BR-HN">Chi nhánh Hà Nội (BR-HN)</option>
                    <option value="BR-HCM">Chi nhánh TP.HCM (BR-HCM)</option>
                    <option value="BR-DN">Chi nhánh Đà Nẵng (BR-DN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Ngày Gửi Dự Kiến
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-blue-50/50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Trọng Lượng (KG)
                </label>
                <div className="relative">
                  <Weight className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-blue-50/50 border border-slate-200 rounded-xl"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Loại Hàng Hóa
              </label>
              <select
                value={goodsType}
                onChange={(e) => setGoodsType(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Hàng thông thường">Hàng thông thường (Tài liệu, quần áo, thiết bị)</option>
                <option value="Hàng dễ vỡ">Hàng dễ vỡ / Yêu cầu xử lý đặc biệt</option>
                <option value="Đông lạnh">Hàng thực phẩm / Đông lạnh</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <span>Tìm Kiếm Gói Cước</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
