import { JsonFileRepository } from "./JsonFileRepository";
import {
    Vehicle,
    VehicleType
} from "../domain/Vehicle";

export class VehicleRepository extends JsonFileRepository<Vehicle> {

    constructor() {
        super("vehicles.json");
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