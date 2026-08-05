// AssignmentService — application service layer
import { ShipmentRepository } from "../repositories/ShipmentRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { DriverRepository } from "../repositories/DriverRepository";

import { Shipment, ShipmentStatus } from "../domain/Shipment";
import { Vehicle } from "../domain/Vehicle";
import { Driver } from "../domain/Driver";

export class AssignmentService {
    constructor(
        private shipmentRepository: ShipmentRepository = new ShipmentRepository(),
        private vehicleRepository: VehicleRepository = new VehicleRepository(),
        private driverRepository: DriverRepository = new DriverRepository()
    ) {}

    async findUnassignedShipments(): Promise<Shipment[]> {
        return this.shipmentRepository.findPaidUnassigned();
    }

    async findAllVehicles(): Promise<Vehicle[]> {
        return this.vehicleRepository.findAll();
    }

    async findAllDrivers(): Promise<Driver[]> {
        return this.driverRepository.findAll();
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

        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) throw new Error(`Shipment '${shipmentId}' not found.`);

        const vehicle = await this.vehicleRepository.findById(vehicleId);
        if (!vehicle) throw new Error(`Vehicle '${vehicleId}' not found.`);

        const driver = await this.driverRepository.findById(driverId);
        if (!driver) throw new Error(`Driver '${driverId}' not found.`);

        shipment.assign(vehicle, driver);
        vehicle.assignToShipment(shipment.id);
        driver.assignToShipment(shipment.id, vehicle.id);

        await this.shipmentRepository.save(shipment);
        await this.vehicleRepository.save(vehicle);
        await this.driverRepository.save(driver);

        return shipment;
    }

    async assignVehicleAndDriver(shipmentId: string, branchId: string) {
        const shipment = await this.shipmentRepository.findById(shipmentId);
        if (!shipment) throw new Error(`Kiện hàng '${shipmentId}' không tồn tại.`);

        const vehicle = await this.recommendVehicles(branchId, shipment);
        if (!vehicle) throw new Error('Không có xe phù hợp khả dụng tại chi nhánh này.');

        const driver = await this.recommendDrivers(branchId, vehicle);
        if (!driver) throw new Error('Không tìm thấy tài xế đủ điều kiện và khả dụng.');

        const assignedShipment = await this.assignShipment(shipment.id, vehicle.id, driver.id);
        return {
            shipment: assignedShipment,
            vehicle,
            driver,
        };
    }
}
