'use client'

import { Package, Route, Search } from 'lucide-react'
import { Shipment } from '../../domain/Shipment'

interface OrderSelectorProps {
  orders?: any[]
  selectedOrder?: any
  onSelect?: (order: any) => void
}

export default function OrderSelector({
  orders = [
    {
      id: 'SHP-001',
      destination: 'Ha Noi',
      weight: 1200,
      volume: 8,
      requiredVehicle: 'TRUCK_2T',
    },
    {
      id: 'SHP-002',
      destination: 'Da Nang',
      weight: 600,
      volume: 3,
      requiredVehicle: 'VAN',
    },
    {
      id: 'SHP-003',
      destination: 'Can Tho',
      weight: 60,
      volume: 0.4,
      requiredVehicle: 'MOTORBIKE',
    },
  ],
  selectedOrder,
  onSelect,
}: OrderSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Package
              className="text-indigo-600"
              size={22}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Shipment Selection
            </h2>

            <p className="text-sm text-slate-500">
              Select a shipment to begin assignment.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {orders.map((order) => {
          const selected =
            selectedOrder?.id === order.id

          return (
            <div
              key={order.id}
              onClick={() => onSelect?.(order)}
              className={`cursor-pointer rounded-xl border p-5 transition-all
              ${
                selected
                  ? 'border-blue-600 bg-blue-50 shadow'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {order.id}
                    </h3>

                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                    <div>
                      <p className="text-slate-400">
                        Destination
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Route size={15} />

                        {order.destination}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Required Vehicle
                      </p>

                      <p className="mt-1 font-medium">
                        {(order.requiredVehicle || order.requiredVehicleType || 'VAN').replaceAll('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Weight
                      </p>

                      <p className="mt-1">
                        {order.weight} kg
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">
                        Volume
                      </p>

                      <p className="mt-1">
                        {order.volume} m³
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition
                  ${
                    selected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {selected
                    ? 'Selected'
                    : 'Select'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-5">
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
          <Search size={18} />

          Browse All Shipments

        </button>
      </div>
    </div>
  )
}