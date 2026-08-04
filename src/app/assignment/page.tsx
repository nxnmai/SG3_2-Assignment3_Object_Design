'use client'

import AssignmentHeader from '@/components/assignment/AssignmentHeader'
import AssignmentStats from '@/components/assignment/AssignmentStats'
import AssignmentHistory from '@/components/assignment/AssignmentHistory'
import AssignmentSummary from '@/components/assignment/AssignmentSummary'
import DriverTable from '@/components/assignment/DriverTable'
import OrderSelector from '@/components/assignment/OrderSelector'
import VehicleTable from '@/components/assignment/VehicleTable'

import { useAssignment } from '@/hooks/useAssignment'

export default function AssignmentPage() {
  const {
    // Dashboard metrics
    statistics,

    // Data
    shipments,
    assignmentHistory,
    recommendedVehicles,
    recommendedDrivers,

    // Selected resources
    selectedShipment,
    selectedVehicle,
    selectedDriver,

    // UI state
    loading,
    error,

    // Actions
    refresh,
    selectShipment,
    selectVehicle,
    selectDriver,
    confirmAssignment,
  } = useAssignment()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-slate-600">
            Loading assignment centre...
          </p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-red-200 bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load data
          </h2>

          <p className="mt-2 text-slate-600">
            {error}
          </p>

          <button
            onClick={refresh}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-8">
        <AssignmentHeader
          branch="BR-HCM"
          pendingAssignments={statistics.pendingShipments}
          onRefresh={refresh}
        />

        <AssignmentStats
          pendingShipments={statistics.pendingShipments}
          availableVehicles={statistics.availableVehicles}
          availableDrivers={statistics.availableDrivers}
          completedAssignments={statistics.completedAssignmentsToday}
        />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
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

          </div>

          <div className="col-span-4">
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

        <AssignmentHistory
          history={assignmentHistory}
        />
      </div>
    </main>
  )
}