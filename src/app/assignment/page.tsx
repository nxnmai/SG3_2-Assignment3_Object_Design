'use client'

import { useState } from 'react'

import AssignmentHeader from '@/components/assignment/AssignmentHeader'
import AssignmentStats from '@/components/assignment/AssignmentStats'
import OrderSelector from '@/components/assignment/OrderSelector'
import VehicleTable from '@/components/assignment/VehicleTable'
import DriverTable from '@/components/assignment/DriverTable'
import AssignmentSummary from '@/components/assignment/AssignmentSummary'
import AssignmentHistory from '@/components/assignment/AssignmentHistory'

import {
  Vehicle,
  VehicleStatus,
  VehicleType,
} from '@/domain/Vehicle'

import {
  Driver,
  DriverStatus,
} from '@/domain/Driver'

import { Credentials } from '@/domain/StaffMember'

const credentials: Credentials = {
  username: '',
  password: '',
}

export default function AssignmentPage() {
  // -----------------------
  // Mock Orders
  // -----------------------

  const orders = [
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
      weight: 650,
      volume: 4,
      requiredVehicle: 'VAN',
    },
    {
      id: 'SHP-003',
      destination: 'Can Tho',
      weight: 60,
      volume: 0.5,
      requiredVehicle: 'MOTORBIKE',
    },
  ]

  // -----------------------
  // Mock Vehicles
  // -----------------------

  const vehicles: Vehicle[] = [
    new Vehicle(
      'VEH-001',
      'BR-HCM',
      VehicleType.TRUCK_2T,
      2000,
      12,
      VehicleStatus.AVAILABLE
    ),

    new Vehicle(
      'VEH-002',
      'BR-HCM',
      VehicleType.VAN,
      1000,
      6,
      VehicleStatus.AVAILABLE
    ),

    new Vehicle(
      'VEH-003',
      'BR-HCM',
      VehicleType.MOTORBIKE,
      80,
      0.5,
      VehicleStatus.IN_USE
    ),
  ]

  // -----------------------
  // Mock Drivers
  // -----------------------

  const drivers: Driver[] = [
    new Driver(
      'STF-001',
      'BR-HCM',
      'Pham Van Long',
      '0911000001',
      'long@smartfm.vn',
      credentials,
      new Date('2028-12-31'),
      [VehicleType.TRUCK_2T],
      DriverStatus.AVAILABLE
    ),

    new Driver(
      'STF-002',
      'BR-HCM',
      'Nguyen Quoc Hung',
      '0911000002',
      'hung@smartfm.vn',
      credentials,
      new Date('2029-05-20'),
      [VehicleType.VAN],
      DriverStatus.AVAILABLE
    ),

    new Driver(
      'STF-003',
      'BR-HCM',
      'Le Thanh Son',
      '0911000003',
      'son@smartfm.vn',
      credentials,
      new Date('2028-09-01'),
      [VehicleType.MOTORBIKE],
      DriverStatus.IN_USE
    ),
  ]

  const [selectedOrder, setSelectedOrder] =
    useState<any>()

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle>()

  const [selectedDriver, setSelectedDriver] =
    useState<Driver>()

  function confirmAssignment() {
    if (
      !selectedOrder ||
      !selectedVehicle ||
      !selectedDriver
    ) {
      return
    }

    alert(
      `Assigned ${selectedVehicle.id} and ${selectedDriver.name} to ${selectedOrder.id}`
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-8">
        <AssignmentHeader
          branch="BR-HCM"
          pendingAssignments={orders.length}
        />

        <AssignmentStats
          pendingShipments={orders.length}
          availableVehicles={
            vehicles.filter((v) =>
              v.isAvailable()
            ).length
          }
          availableDrivers={
            drivers.filter((d) =>
              d.isAvailable()
            ).length
          }
          completedAssignments={12}
        />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <OrderSelector
              orders={orders}
              selectedOrder={selectedOrder}
              onSelect={setSelectedOrder}
            />

            <VehicleTable
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelect={setSelectedVehicle}
            />

            <DriverTable
              drivers={drivers}
              selectedDriver={selectedDriver}
              onSelect={setSelectedDriver}
            />

          </div>

          <div className="col-span-4">
            <AssignmentSummary
              shipmentId={selectedOrder?.id}
              destination={
                selectedOrder?.destination
              }
              vehicleId={selectedVehicle?.id}
              vehicleType={
                selectedVehicle?.type
              }
              driverName={
                selectedDriver?.name
              }
              onAssign={confirmAssignment}
            />
          </div>
        </div>

        <AssignmentHistory />

      </div>
    </main>
  )
}