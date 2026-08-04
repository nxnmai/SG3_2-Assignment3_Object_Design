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

    private async findAvailableVehicle(
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

    private async findAvailableDriver(
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
        branchId: string
    ): Promise<Shipment> {

        const shipment =
            await this.shipmentRepository.findById(shipmentId);

        if (!shipment) {
            throw new Error("Shipment not found.");
        }

        const vehicle =
            await this.findAvailableVehicle(branchId, shipment);

        if (!vehicle) {
            throw new Error(
                "No suitable vehicle available."
            );
        }

        const driver =
            await this.findAvailableDriver(branchId, vehicle);

        if (!driver) {
            throw new Error(
                "No qualified driver available."
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
