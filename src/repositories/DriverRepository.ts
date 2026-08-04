import { JsonFileRepository } from "./JsonFileRepository";
import { Driver } from "../domain/Driver";
import { VehicleType } from "../domain/Vehicle";

export class DriverRepository extends JsonFileRepository<Driver> {
    constructor() {
        super("drivers.json");
    }

    public async findAvailableDriver(
        branchId: string,
        vehicleType: VehicleType
    ): Promise<Driver | null> {

        const drivers = await this.findAll();

        return (
            drivers.find(driver =>
                driver.branchId === branchId &&
                driver.isAvailable() &&
                driver.isQualifiedFor(vehicleType)
            ) ?? null
        );
    }

    public async findByBranch(
        branchId: string
    ): Promise<Driver[]> {

        const drivers = await this.findAll();

        return drivers.filter(driver =>
            driver.branchId === branchId
        );
    }

    public async findAvailable(): Promise<Driver[]> {

        const drivers = await this.findAll();

        return drivers.filter(driver =>
            driver.isAvailable()
        );
    }

    public async findExpiringLicences(
        withinDays: number = 30
    ): Promise<Driver[]> {

        const drivers = await this.findAll();

        const today = new Date();
        const cutoff = new Date(today);
        cutoff.setDate(today.getDate() + withinDays);

        return drivers.filter(driver =>
            driver.licenseExpiry >= today &&
            driver.licenseExpiry <= cutoff
        );
    }
}
