'use client';

import React from 'react';
import AssignmentHeader from '@/components/assignment/AssignmentHeader';
import AssignmentStats from '@/components/assignment/AssignmentStats';
import AssignmentHistory from '@/components/assignment/AssignmentHistory';
import AssignmentSummary from '@/components/assignment/AssignmentSummary';
import DriverTable from '@/components/assignment/DriverTable';
import OrderSelector from '@/components/assignment/OrderSelector';
import VehicleTable from '@/components/assignment/VehicleTable';

import { useAssignment } from '@/hooks/useAssignment';
import { RefreshCw, Filter, AlertTriangle, Warehouse } from 'lucide-react';

export default function AssignmentPage() {
  const {
    statistics,
    shipments,
    assignmentHistory,
    recommendedVehicles,
    recommendedDrivers,
    selectedShipment,
    selectedVehicle,
    selectedDriver,
    loading,
    error,
    refresh,
    selectShipment,
    selectVehicle,
    selectDriver,
    confirmAssignment,
  } = useAssignment();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-900 border-t-transparent" />
          <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Đang tải trung tâm điều phối...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-center max-w-md mx-auto my-8">
        <h2 className="text-lg font-extrabold text-red-600">Không thể tải dữ liệu</h2>
        <p className="mt-2 text-xs text-slate-600">{error}</p>
        <button
          onClick={refresh}
          className="mt-4 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider hover:bg-blue-800 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner Matching Figure 10 Wireframe */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-100/40 p-6 rounded-3xl border border-blue-100 shadow-xs space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                CHI NHÁNH BR-HCM
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {statistics.pendingShipments} CHỜ PHÂN CÔNG
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Trung Tâm Phân Công Nguồn Lực</h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              Quản lý và điều phối phương tiện, tài xế cho các đơn hàng đã thanh toán tại khu vực TP. Hồ Chí Minh.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition">
              <Filter className="w-3.5 h-3.5" />
              <span>Bộ Lọc</span>
            </button>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-xs hover:bg-blue-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Unassigned Table + Right Selection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <OrderSelector
            orders={shipments}
            selectedOrder={selectedShipment}
            onSelect={selectShipment}
          />

          <VehicleTable
            vehicles={recommendedVehicles}
            selectedVehicle={selectedVehicle}
            onSelect={selectVehicle}
          />

          <DriverTable
            drivers={recommendedDrivers}
            selectedDriver={selectedDriver}
            onSelect={selectDriver}
          />

          {/* Operational Alerts & Status Widgets */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2 text-blue-900">
                <Warehouse className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Trạng Thái Kho Bãi</span>
              </div>
              <span className="text-2xl font-black text-slate-900 block">82%</span>
              <p className="text-[11px] text-slate-500 font-medium">Công suất hiện tại tại bãi xe HCM</p>
            </div>

            <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Cảnh Báo Vận Hành</span>
              </div>
              <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                Dự báo mưa lớn trên tuyến HCM → CT vào chiều nay. Khuyến nghị ưu tiên xe tải kín.
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary Assignment Action Panel */}
        <div className="lg:col-span-4">
          <AssignmentSummary
            shipmentId={selectedShipment?.id}
            destination={selectedShipment?.destination}
            vehicleId={selectedVehicle?.id}
            vehicleType={selectedVehicle?.type}
            driverName={selectedDriver?.name}
            onAssign={confirmAssignment}
          />
        </div>
      </div>

      <AssignmentHistory history={assignmentHistory} />
    </div>
  );
}