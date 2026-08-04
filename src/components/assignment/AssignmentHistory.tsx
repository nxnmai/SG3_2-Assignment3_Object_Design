'use client'

import {
  Calendar,
  CheckCircle2,
  Clock3,
  History,
  Truck,
  User,
} from 'lucide-react'

interface AssignmentRecord {
  id: string
  shipmentId: string
  vehicleId: string
  driverName: string
  assignedAt: string
  status: 'Completed' | 'In Progress'
}

interface AssignmentHistoryProps {
  history?: AssignmentRecord[]
}

export default function AssignmentHistory({
  history = [
    {
      id: '1',
      shipmentId: 'SHP-001',
      vehicleId: 'VEH-003',
      driverName: 'Le Thanh Son',
      assignedAt: 'Today • 09:15',
      status: 'In Progress',
    },
    {
      id: '2',
      shipmentId: 'SHP-002',
      vehicleId: 'VEH-001',
      driverName: 'Pham Van Long',
      assignedAt: 'Today • 08:42',
      status: 'Completed',
    },
    {
      id: '3',
      shipmentId: 'SHP-003',
      vehicleId: 'VEH-004',
      driverName: 'Tran Minh Duc',
      assignedAt: 'Yesterday • 16:20',
      status: 'Completed',
    },
  ],
}: AssignmentHistoryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3">
            <History
              className="text-slate-700"
              size={22}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Recent Assignments
            </h2>

            <p className="text-sm text-slate-500">
              Latest vehicle and driver assignments
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
          {history.length} Records
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map((record) => (
          <div
            key={record.id}
            className="flex flex-col gap-5 p-6 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {record.shipmentId}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    record.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {record.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  {record.vehicleId}
                </div>

                <div className="flex items-center gap-2">
                  <User size={16} />
                  {record.driverName}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {record.assignedAt}
                </div>
              </div>
            </div>

            <div>
              {record.status === 'Completed' ? (
                <div className="flex items-center gap-2 text-green-600">

                  <CheckCircle2 size={18} />

                  <span className="font-medium">
                    Completed
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">

                  <Clock3 size={18} />

                  <span className="font-medium">
                    In Progress
                  </span>
                </div>
              )}

            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No assignments have been made yet.
          </div>

        )}
      </div>
    </div>
  )
}