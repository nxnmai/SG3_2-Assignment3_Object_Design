import { JsonFileRepository } from "./JsonFileRepository";
import {
    Vehicle,
    VehicleType,
    VehicleStatus
} from "../domain/Vehicle";

export class VehicleRepository extends JsonFileRepository<Vehicle & { id: string }> {

    constructor() {
        super("src/data/vehicles.json");
    }

    private hydrate(raw: any): Vehicle {
        return new Vehicle(
            raw.id,
            raw.branchId,
            raw.type as VehicleType,
            raw.capacityKg,
            raw.capacityVolumeM3,
            raw.status as VehicleStatus,
            raw.assignedShipmentId
        );
    }

    public async findAll(): Promise<Vehicle[]> {
        const items = await super.findAll();
        return items.map((item) => this.hydrate(item));
    }

    public async findById(id: string): Promise<Vehicle | undefined> {
        const item = await super.findById(id);
        return item ? this.hydrate(item) : undefined;
    }

    public async findAvailableByType(branchId: string, type: VehicleType): Promise<Vehicle[]> {
        const vehicles = await this.findAll();

        return vehicles.filter(vehicle =>
            vehicle.branchId === branchId &&
            vehicle.type === type &&
            vehicle.isAvailable()
        );
    }

    public async findByBranch(branchId: string): Promise<Vehicle[]> {
        const vehicles = await this.findAll();

        return vehicles.filter(vehicle =>
            vehicle.branchId === branchId
        );
    }

    public async findAvailable(): Promise<Vehicle[]> {
        const vehicles = await this.findAll();

        return vehicles.filter(vehicle =>
            vehicle.isAvailable()
        );
    }
}