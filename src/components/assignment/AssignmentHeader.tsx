'use client'

import { RefreshCw } from 'lucide-react'

interface AssignmentHeaderProps {
  branch?: string
  pendingAssignments?: number
  onRefresh?: () => void
}

export default function AssignmentHeader({
  branch = 'BR-HCM',
  pendingAssignments = 5,
  onRefresh,
}: AssignmentHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Branch {branch}
          </span>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
            {pendingAssignments} Pending Assignment
            {pendingAssignments !== 1 && 's'}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Vehicle & Driver Assignment
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Assign available vehicles and qualified drivers to paid
            shipments. The system recommends suitable resources based on
            vehicle type, capacity and availability.
          </p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        <RefreshCw size={18} />
        Refresh
      </button>
    </div>
  )
}