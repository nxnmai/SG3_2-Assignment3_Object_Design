'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchForm, SearchCriteria } from '../../components/SearchForm';
import { OrderCard } from '../../components/OrderCard';
import { OrderService, ServiceOffering } from '../../services/OrderService';
import { LayoutGrid, List } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [orderService] = useState(() => new OrderService());
  const [criteria, setCriteria] = useState<SearchCriteria>({
    origin: 'BR-HCM',
    destination: 'BR-HN',
    goodsType: 'Hàng thông thường',
    weight: 5,
  });

  const offerings = orderService.getOfferings({ goodsType: criteria.goodsType, weight: criteria.weight });

  const handleSelectOffering = (offering: ServiceOffering) => {
    const query = new URLSearchParams({
      offeringId: offering.id,
      origin: criteria.origin,
      destination: criteria.destination,
      goodsType: criteria.goodsType,
      weight: criteria.weight.toString(),
    }).toString();

    router.push(`/orders/new?${query}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner Search Component */}
      <SearchForm onSearch={(newCriteria) => setCriteria(newCriteria)} />

      {/* Offerings Result Grid Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Kết Quả Phân Tích Đường Bay & Tuyến Đường
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Có {offerings.length} tùy chọn dịch vụ khả dụng cho tuyến đường từ {criteria.origin} đến {criteria.destination}.
            </p>
          </div>

          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Offerings Grid */}
        {offerings.length === 0 ? (
          <div className="p-8 text-center bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-2xl">
            Không tìm thấy gói dịch vụ phù hợp cho tiêu chí này. Thử thay đổi thông số.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offerings.map((offering) => (
              <OrderCard
                key={offering.id}
                offering={offering}
                weight={criteria.weight}
                onSelect={handleSelectOffering}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Network Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 p-6 rounded-3xl border border-emerald-200/50 flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">Mạng Lưới Vận Chuyển Toàn Quốc ABC-Trans</h4>
          <p className="text-xs text-slate-600 mt-1">
            Kết nối 63 tỉnh thành với hệ thống trung chuyển thông minh, đảm bảo hàng hóa luôn di chuyển an toàn & đúng tiến độ.
          </p>
        </div>
        <span className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
          Hoạt Động 24/7
        </span>
      </div>
    </div>
  );
}
