'use client'

import {
  CheckCircle2,
  User,
  Calendar,
  Car,
} from 'lucide-react'

import {
  Driver,
  DriverStatus,
} from '../../domain/Driver'

interface DriverRowProps {
  driver: Driver
  selected?: boolean
  recommended?: boolean
  onSelect?: (driver: Driver) => void
}

export default function DriverRow({
  driver,
  selected = false,
  recommended = false,
  onSelect,
}: DriverRowProps) {
  const getStatusColor = () => {
    switch (driver.status) {
      case DriverStatus.AVAILABLE:
        return 'bg-green-100 text-green-700'

      case DriverStatus.IN_USE:
        return 'bg-blue-100 text-blue-700'

      case DriverStatus.UNAVAILABLE:
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-slate-100 text-slate-700'
    }
  }
  
  const getLicenceStatus = () => {
    const today = new Date()

    const expiry = new Date(driver.licenseExpiry)

    const diffDays = Math.ceil(
        (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) {
        return {
        label: 'Expired',
        className: 'bg-red-100 text-red-700',
        }
    }

    if (diffDays <= 30) {
        return {
        label: `Expires in ${diffDays} day${
            diffDays === 1 ? '' : 's'
        }`,
        className: 'bg-amber-100 text-amber-700',
        }
    }

    return {
        label: `Valid until ${expiry.toLocaleDateString()}`,
        className: 'bg-green-100 text-green-700',
        }
    }

    const licenceStatus = getLicenceStatus()

  return (
    <div
      onClick={() =>
        driver.isAvailable() &&
        onSelect?.(driver)
      }
      className={`cursor-pointer rounded-xl border p-5 transition-all duration-200
      ${
        selected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow'
      }
      ${
        !driver.isAvailable()
          ? 'cursor-not-allowed opacity-60'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <User size={26} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                {driver.name}
              </h3>

              {recommended && (
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  Recommended
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {driver.id}
            </p>

            <div className="mt-4 flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-slate-400">
                    Licence Status
                </p>

                <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${licenceStatus.className}`}
                >
                    {licenceStatus.label}
                </span>
              </div>

              <div>
                <p className="text-slate-400">
                  Qualified For
                </p>

                <div className="mt-1 flex flex-wrap gap-2">
                  {driver.vehicleTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}
          >
            {driver.status.replace('_', ' ')}
          </span>

          <button
            disabled={!driver.isAvailable()}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition
            ${
              selected
                ? 'bg-blue-600 text-white'
                : driver.isAvailable()
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