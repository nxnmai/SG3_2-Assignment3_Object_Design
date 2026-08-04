'use client'

import { User } from 'lucide-react'

import { Driver } from '@/domain/Driver'
import DriverRow from './DriverRow'

interface DriverTableProps {
  drivers: Driver[]
  selectedDriver?: Driver
  onSelect?: (driver: Driver) => void
}

export default function DriverTable({
  drivers,
  selectedDriver,
  onSelect,
}: DriverTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-100 p-3">
            <User
              className="text-green-600"
              size={22}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Recommended Drivers
            </h2>

            <p className="text-sm text-slate-500">
              Select a qualified driver for the assignment.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
          {drivers.length} Drivers
        </span>
      </div>

      <div className="space-y-4 p-6">
        {drivers.map((driver, index) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            selected={
              selectedDriver?.id === driver.id
            }
            recommended={index === 0}
            onSelect={onSelect}
          />
        ))}

        {drivers.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No qualified drivers available.
          </div>
        )}
      </div>
    </div>
  )
}