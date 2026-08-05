import React from 'react';
import { ServiceOffering } from '../services/OrderService';
import { Truck, Plane, Ship } from 'lucide-react';

interface OrderCardProps {
  offering: ServiceOffering;
  weight: number;
  onSelect: (offering: ServiceOffering) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ offering, weight, onSelect }) => {
  const calculatedTotal = offering.baseRate + weight * offering.ratePerKg;
  const isExpress = offering.name.includes('Hỏa Tốc');

  const getIcon = () => {
    if (offering.name.includes('Hỏa Tốc')) return Plane;
    if (offering.name.includes('Tiết Kiệm')) return Ship;
    return Truck;
  };

  const Icon = getIcon();

  return (
    <div
      className={`rounded-3xl p-6 shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
        isExpress
          ? 'bg-blue-900 text-white border-2 border-blue-800 shadow-xl shadow-blue-900/30'
          : 'bg-white text-slate-800 border border-slate-200 hover:shadow-lg'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${isExpress ? 'bg-blue-800/80 text-white' : 'bg-blue-50 text-blue-700'}`}>
            <Icon className="w-6 h-6" />
          </div>

          {isExpress && (
            <span className="bg-white text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Đề Xuất
            </span>
          )}
        </div>

        <h4 className="text-xl font-black mb-1">{offering.name}</h4>
        <p className={`text-xs mb-4 ${isExpress ? 'text-blue-200' : 'text-slate-500'}`}>
          Tùy chọn cước phí tối ưu cho tuyến đường này
        </p>

        {/* Price Tag */}
        <div className="mb-4">
          <span className="text-3xl font-black">{calculatedTotal.toLocaleString()}</span>
          <span className="text-sm font-bold ml-1">đ</span>
          <p className={`text-xs mt-1 font-medium ${isExpress ? 'text-blue-200' : 'text-slate-500'}`}>
            ⏱ Thời gian dự kiến: ~{offering.estimatedHours} giờ
          </p>
        </div>

        {/* Rate Detail Slider visual */}
        <div className="space-y-1 mb-6 text-xs">
          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${isExpress ? 'bg-blue-300' : 'bg-blue-600'}`} style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Select Action Button */}
      <button
        onClick={() => onSelect(offering)}
        className={`w-full font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition ${
          isExpress
            ? 'bg-white text-blue-900 hover:bg-blue-50 font-extrabold shadow-md'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold'
        }`}
      >
        {isExpress ? 'Chọn Hỏa Tốc' : 'Chọn Gói Này'}
      </button>
    </div>
  );
};
