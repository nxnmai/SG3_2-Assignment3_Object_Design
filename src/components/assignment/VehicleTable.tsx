'use client'

import { Truck } from 'lucide-react'
import { Vehicle } from '@/domain/Vehicle'
import VehicleRow from './VehicleRow'

interface VehicleTableProps {
  vehicles: Vehicle[]
  selectedVehicle?: Vehicle
  onSelect?: (vehicle: Vehicle) => void
}

export default function VehicleTable({
  vehicles,
  selectedVehicle,
  onSelect,
}: VehicleTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Truck
              className="text-blue-600"
              size={22}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Recommended Vehicles
            </h2>

            <p className="text-sm text-slate-500">
              Choose an available vehicle for the shipment.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
          {vehicles.length} Vehicles
        </span>
      </div>

      <div className="space-y-4 p-6">
        {vehicles.map((vehicle, index) => (
          <VehicleRow
            key={vehicle.id}
            vehicle={vehicle}
            selected={
              selectedVehicle?.id === vehicle.id
            }
            recommended={index === 0}
            onSelect={onSelect}
          />
        ))}

        {vehicles.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No available vehicles found.
          </div>
        )}
      </div>
    </div>
  )
}