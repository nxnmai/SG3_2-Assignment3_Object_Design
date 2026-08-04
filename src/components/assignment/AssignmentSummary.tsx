'use client'

import {
  CheckCircle2,
  Circle,
  MapPin,
  Package,
  Truck,
  User,
  ClipboardCheck,
} from 'lucide-react'

interface AssignmentSummaryProps {
  shipmentId?: string
  destination?: string

  vehicleId?: string
  vehicleType?: string

  driverName?: string

  onAssign?: () => void
}

export default function AssignmentSummary({
  shipmentId,
  destination,
  vehicleId,
  vehicleType,
  driverName,
  onAssign,
}: AssignmentSummaryProps) {
  const ready =
    !!shipmentId &&
    !!vehicleId &&
    !!driverName

  const checklist = [
    {
      label: 'Shipment Selected',
      completed: !!shipmentId,
    },
    {
      label: 'Vehicle Assigned',
      completed: !!vehicleId,
    },
    {
      label: 'Driver Assigned',
      completed: !!driverName,
    },
  ]

  return (
    <div className="sticky top-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <ClipboardCheck
              size={22}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Assignment Summary
            </h2>

            <p className="text-sm text-slate-500">
              Review before confirming dispatch
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Package
              size={18}
              className="text-blue-600"
            />

            <span className="font-semibold">
              Shipment
            </span>
          </div>

          <p className="font-medium text-slate-900">
            {shipmentId ?? 'No shipment selected'}
          </p>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

            <MapPin size={15} />

            {destination ?? 'Destination unavailable'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Truck
              size={18}
              className="text-blue-600"
            />

            <span className="font-semibold">
              Vehicle
            </span>
          </div>

          <p className="font-medium text-slate-900">
            {vehicleId ?? 'Not selected'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {vehicleType ?? '-'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <User
              size={18}
              className="text-blue-600"
            />

            <span className="font-semibold">
              Driver
            </span>
          </div>

          <p className="font-medium text-slate-900">
            {driverName ?? 'Not selected'}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <h3 className="mb-4 font-semibold">
            Dispatch Checklist
          </h3>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3"
              >
                {item.completed ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />
                ) : (
                  <Circle
                    size={18}
                    className="text-slate-400"
                  />
                )}

                <span
                  className={
                    item.completed
                      ? 'text-slate-900'
                      : 'text-slate-500'
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            ready
              ? 'border-green-200 bg-green-50'
              : 'border-amber-200 bg-amber-50'
          }`}
        >

          <div className="flex items-center gap-2">
            <CheckCircle2
              size={18}
              className={
                ready
                  ? 'text-green-600'
                  : 'text-amber-600'
              }
            />

            <span
              className={`font-semibold ${
                ready
                  ? 'text-green-700'
                  : 'text-amber-700'
              }`}
            >
              {ready
                ? 'Ready to Dispatch'
                : 'Waiting for Selection'}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {ready
              ? 'Everything is ready. Click below to confirm the assignment.'
              : 'Complete the checklist before confirming.'}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-6">
        <button
          disabled={!ready}
          onClick={onAssign}
          className={`w-full rounded-xl py-3 font-semibold transition ${
            ready
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'cursor-not-allowed bg-slate-200 text-slate-500'
          }`}
        >
          Confirm Assignment
        </button>
      </div>
    </div>
  )
}