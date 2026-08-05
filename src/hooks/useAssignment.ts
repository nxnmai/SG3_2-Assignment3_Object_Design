'use client'

import { useEffect, useMemo, useState } from 'react'

import { Driver } from '../domain/Driver'
import { Vehicle } from '../domain/Vehicle'
import { Shipment } from '../domain/Shipment'
import { AssignmentService } from '../services/AssignmentService'

interface UseAssignmentProps {
  shipments?: any[]
  vehicles?: Vehicle[]
  drivers?: Driver[]
}

export function useAssignment(props?: UseAssignmentProps) {
  const [assignmentService] = useState(() => new AssignmentService())
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedShipment, setSelectedShipment] = useState<Shipment>()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>()
  const [selectedDriver, setSelectedDriver] = useState<Driver>()

  const refreshData = async () => {
    setLoading(true)
    setError('')
    try {
      const [unassigned, allVehicles, allDrivers] = await Promise.all([
        assignmentService.findUnassignedShipments(),
        assignmentService.findAllVehicles(),
        assignmentService.findAllDrivers(),
      ])
      setShipments(unassigned)
      setVehicles(allVehicles)
      setDrivers(allDrivers)
    } catch (err: any) {
      setError(err.message || 'Failed to load assignment data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const recommendedVehicles = useMemo(() => {
    const available = vehicles.filter(v => v.isAvailable())
    if (!selectedShipment) return available.length > 0 ? available : vehicles

    const matches = available.filter(v => v.canCarry(selectedShipment.weight, selectedShipment.volume || 0))
    return matches.length > 0 ? matches : (available.length > 0 ? available : vehicles)
  }, [selectedShipment, vehicles])

  const recommendedDrivers = useMemo(() => {
    const available = drivers.filter(d => d.isAvailable())
    if (selectedVehicle) {
      const matches = available.filter(d => d.isQualifiedFor(selectedVehicle.type))
      return matches.length > 0 ? matches : (available.length > 0 ? available : drivers)
    }
    if (selectedShipment) {
      const matches = available.filter(d => d.isQualifiedFor(selectedShipment.requiredVehicleType))
      return matches.length > 0 ? matches : (available.length > 0 ? available : drivers)
    }
    return available.length > 0 ? available : drivers
  }, [selectedShipment, selectedVehicle, drivers])

  const statistics = useMemo(() => ({
    pendingShipments: shipments.length,
    availableVehicles: vehicles.filter(v => v.isAvailable()).length,
    availableDrivers: drivers.filter(d => d.isAvailable()).length,
    completedAssignmentsToday: 5,
  }), [shipments, vehicles, drivers])

  const assignmentHistory = useMemo(() => [], [])

  function selectShipment(shipment: any) {
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
    if (!selectedShipment || !selectedVehicle || !selectedDriver) {
      return false
    }

    await assignmentService.assignShipment(
      selectedShipment.id,
      selectedVehicle.id,
      selectedDriver.id
    )

    await refreshData()
    clearSelection()
    return true
  }

  return {
    shipments,
    vehicles,
    drivers,
    recommendedVehicles,
    recommendedDrivers,
    selectedShipment,
    selectedVehicle,
    selectedDriver,
    statistics,
    assignmentHistory,
    loading,
    error,
    refresh: refreshData,
    selectShipment,
    selectVehicle,
    selectDriver,
    clearSelection,
    confirmAssignment,
  }
}