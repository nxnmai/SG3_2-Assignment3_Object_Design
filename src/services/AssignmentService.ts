// AssignmentService — application service layer
import { ShipmentRepository } from "../repositories/ShipmentRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { DriverRepository } from "../repositories/DriverRepository";

import { Shipment } from "../domain/Shipment";
import { Vehicle } from "../domain/Vehicle";
import { Driver } from "../domain/Driver";

export class AssignmentService {
    constructor(
        private shipmentRepository: ShipmentRepository,
        private vehicleRepository: VehicleRepository,
        private driverRepository: DriverRepository
    ) {}

    async findUnassignedShipments(): Promise<Shipment[]> {
        return this.shipmentRepository.findPaidUnassigned();
    }

    async recommendVehicles(
        branchId: string,
        shipment: Shipment
    ): Promise<Vehicle | null> {

        const vehicles =
            await this.vehicleRepository.findAvailableByType(
                branchId,
                shipment.requiredVehicleType
            );

        return (
            vehicles.find(vehicle =>
                vehicle.isAvailable() &&
                vehicle.canCarry(
                    shipment.weight,
                    shipment.volume
                )
            ) ?? null
        );
    }

    async recommendDrivers(
        branchId: string,
        vehicle: Vehicle
    ): Promise<Driver | null> {

        return await this.driverRepository.findAvailableDriver(
            branchId,
            vehicle.type
        );
    }

    async assignShipment(
        shipmentId: string,
        vehicleId: string,
        driverId: string
    ): Promise<Shipment> {

        const shipment =
            await this.shipmentRepository.findById(shipmentId);

        if (!shipment) {
            throw new Error("Shipment not found.");
        }

        const vehicle =
            await this.vehicleRepository.findById(vehicleId);

        if (!vehicle) {
            throw new Error("Vehicle not found.");
        }

        const driver =
            await this.driverRepository.findById(driverId);

        if (!driver) {
            throw new Error("Driver not found.");
        }

        if (!vehicle.isAvailable()) {
            throw new Error("Vehicle is unavailable.");
        }

        if (!driver.isAvailable()) {
            throw new Error("Driver is unavailable.");
        }

        if (
            !driver.isQualifiedFor(vehicle.type)
        ) {
            throw new Error(
                "Driver is not qualified for this vehicle."
            );
        }

        if (
            !vehicle.canCarry(
                shipment.weight,
                shipment.volume
            )
        ) {
            throw new Error(
                "Vehicle capacity is insufficient."
            );
        }

        vehicle.assignToShipment(shipment.id);

        driver.assignToShipment(
            shipment.id,
            vehicle.id
        );

        shipment.assign(vehicle, driver);

        await this.vehicleRepository.save(vehicle);

        await this.driverRepository.save(driver);

        await this.shipmentRepository.save(shipment);

        return shipment;
    }
}
