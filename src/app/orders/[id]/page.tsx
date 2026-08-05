'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderService } from '../../../services/OrderService';
import { Order } from '../../../domain/Order';
import { InvoiceRepository } from '../../../repositories/InvoiceRepository';
import { ShipmentRepository } from '../../../repositories/ShipmentRepository';
import { Invoice } from '../../../domain/Invoice';
import { Shipment } from '../../../domain/Shipment';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const orderService = new OrderService();
        const invoiceRepo = new InvoiceRepository();
        const shipmentRepo = new ShipmentRepository();

        const ord = await orderService.getOrderById(orderId);
        if (ord) {
          setOrder(ord);
          const inv = await invoiceRepo.findByOrderId(ord.id);
          setInvoice(inv);
          const shpList = await shipmentRepo.findAll();
          const shp = shpList.find(s => s.orderId === ord.id) || null;
          setShipment(shp);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) loadData();
  }, [orderId]);

  if (loading) return <div className="p-8 text-center">Đang tải chi tiết đơn hàng...</div>;
  if (!order) return <div className="p-8 text-center text-red-600 font-bold">Không tìm thấy đơn hàng mã {orderId}.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-green-800 space-y-1">
        <h2 className="text-2xl font-bold">🎉 Đặt Hàng Thành Công!</h2>
        <p className="text-sm">Đơn hàng của bạn đã được khởi tạo và ghi nhận trên hệ thống SmartFM.</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Chi Tiết Đơn Hàng (#{order.id})</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="text-gray-500 block">Mô tả hàng hóa:</span>
            <span className="font-semibold text-gray-900">{order.goodsDescription}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Tuyến đường:</span>
            <span className="font-semibold text-gray-900">{order.origin} → {order.destination}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Trọng lượng:</span>
            <span className="font-semibold text-gray-900">{order.weight} kg</span>
          </div>
          <div>
            <span className="text-gray-500 block">Mã vận đơn (Tracking):</span>
            <span className="font-semibold text-blue-600">{shipment?.trackingNo || 'Đang tạo...'}</span>
          </div>
        </div>

        {invoice && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-bold text-gray-800">Thông Tin Hóa Đơn ({invoice.id})</h4>
            <div className="flex justify-between text-sm">
              <span>Tổng chi phí:</span>
              <span className="font-bold text-lg text-blue-600">{invoice.totalAmount.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Trạng thái thanh toán:</span>
              <span className="font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                {invoice.status}
              </span>
            </div>
          </div>
        )}

        <div className="border-t pt-4 flex gap-4">
          <button
            onClick={() => router.push(`/payment?invoiceId=${invoice?.id}`)}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
          >
            Chuyển Sang Thanh Toán Ngay
          </button>
          <button
            onClick={() => router.push(`/tracking?trackingNo=${shipment?.trackingNo}`)}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Theo Dõi Đơn Hàng
          </button>
        </div>
      </div>
    </div>
  );
}
