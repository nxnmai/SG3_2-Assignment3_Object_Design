'use client'

import { CheckCircle2, Truck, Bike, Package } from 'lucide-react'
import {
  Vehicle,
  VehicleStatus,
  VehicleType,
} from '@/domain/Vehicle'

interface VehicleRowProps {
  vehicle: Vehicle
  selected?: boolean
  recommended?: boolean
  onSelect?: (vehicle: Vehicle) => void
}

export default function VehicleRow({
  vehicle,
  selected = false,
  recommended = false,
  onSelect,
}: VehicleRowProps) {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case VehicleType.TRUCK_2T:
      case VehicleType.TRUCK_5T:
        return <Truck size={26} />

      case VehicleType.VAN:
        return <Package size={26} />

      case VehicleType.MOTORBIKE:
        return <Bike size={26} />

      default:
        return <Truck size={26} />
    }
  }

  const getStatusColor = () => {
    switch (vehicle.status) {
      case VehicleStatus.AVAILABLE:
        return 'bg-green-100 text-green-700'

      case VehicleStatus.IN_USE:
        return 'bg-blue-100 text-blue-700'

      case VehicleStatus.MAINTENANCE:
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div
      onClick={() =>
        vehicle.isAvailable() &&
        onSelect?.(vehicle)
      }
      className={`cursor-pointer rounded-xl border p-5 transition-all duration-200
      ${
        selected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow'
      }
      ${
        !vehicle.isAvailable()
          ? 'cursor-not-allowed opacity-60'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            {getVehicleIcon()}
          </div>
          
          <div>
            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-slate-900">
                {vehicle.id}
              </h3>

              {recommended && (
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  Recommended
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {vehicle.type.replace('_', ' ')}
            </p>

            <div className="mt-4 flex gap-8 text-sm">
              <div>
                <p className="text-slate-400">
                  Capacity
                </p>

                <p className="font-medium">
                  {vehicle.capacityKg} kg
                </p>
              </div>

              <div>
                <p className="text-slate-400">
                  Volume
                </p>

                <p className="font-medium">
                  {vehicle.capacityVolumeM3} m³
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}
          >
            {vehicle.status.replace('_', ' ')}
          </span>

          <button
            disabled={!vehicle.isAvailable()}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition
            ${
              selected
                ? 'bg-blue-600 text-white'
                : vehicle.isAvailable()
                ? 'bg-slate-100 hover:bg-blue-600 hover:text-white'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Selected
              </span>
            ) : (
              'Select'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}