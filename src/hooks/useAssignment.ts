'use client'

import { useMemo, useState } from 'react'

import { Driver } from '@/domain/Driver'
import { Vehicle } from '@/domain/Vehicle'

interface Shipment {
  id: string
  destination: string
  weight: number
  volume: number
  requiredVehicle: string
}

interface UseAssignmentProps {
  shipments: Shipment[]
  vehicles: Vehicle[]
  drivers: Driver[]
}

export function useAssignment({
  shipments,
  vehicles,
  drivers,
}: UseAssignmentProps) {
  const [selectedShipment, setSelectedShipment] =
    useState<Shipment>()

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle>()

  const [selectedDriver, setSelectedDriver] =
    useState<Driver>()

  const recommendedVehicles = useMemo(() => {
    if (!selectedShipment) {
      return vehicles
    }

    return vehicles.filter(
      (vehicle) =>
        vehicle.isAvailable() &&
        vehicle.type === selectedShipment.requiredVehicle &&
        vehicle.canCarry(
          selectedShipment.weight,
          selectedShipment.volume
        )
    )
  }, [selectedShipment, vehicles])


  const recommendedDrivers = useMemo(() => {
    if (!selectedVehicle) {
      return drivers
    }

    return drivers.filter(
      (driver) =>
        driver.isAvailable() &&
        driver.isQualifiedFor(selectedVehicle.type)
    )
  }, [selectedVehicle, drivers])

  function selectShipment(shipment: Shipment) {
    setSelectedShipment(shipment)

    setSelectedVehicle(undefined)
    setSelectedDriver(undefined)
  }

  function selectVehicle(vehicle: Vehicle) {
    setSelectedVehicle(vehicle)

    setSelectedDriver(undefined)
  }

  function selectDriver(driver: Driver) {
    setSelectedDriver(driver)
  }

  function clearSelection() {
    setSelectedShipment(undefined)
    setSelectedVehicle(undefined)
    setSelectedDriver(undefined)
  }

  async function confirmAssignment() {
        if (
            !selectedShipment ||
            !selectedVehicle ||
            !selectedDriver
        ) {
            return false;
        }

        await assignmentService.assignShipment(

            selectedShipment.id,

            selectedVehicle.id,

            selectedDriver.id

        );

        return true;
    }

  return {
    // data
    shipments,
    vehicles,
    drivers,

    // filtered lists
    recommendedVehicles,
    recommendedDrivers,

    // selected
    selectedShipment,
    selectedVehicle,
    selectedDriver,

    // actions
    selectShipment,
    selectVehicle,
    selectDriver,
    clearSelection,
    confirmAssignment,
  }
}