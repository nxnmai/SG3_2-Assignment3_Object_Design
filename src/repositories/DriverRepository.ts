import { JsonFileRepository } from "./JsonFileRepository";
import { Driver, DriverStatus } from "../domain/Driver";
import { VehicleType } from "../domain/Vehicle";

export class DriverRepository extends JsonFileRepository<Driver & { id: string }> {
    constructor() {
        super("src/data/drivers.json");
    }

    private hydrate(raw: any): Driver {
        return new Driver(
            raw.id,
            raw.branchId,
            raw.name,
            raw.phone,
            raw.email,
            raw.credentials || { username: raw.id, password: "123" },
            raw.licenseExpiry ? new Date(raw.licenseExpiry) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            raw.vehicleTypes as VehicleType[] || [],
            raw.status as DriverStatus,
            raw.assignedVehicle,
            raw.assignedShipmentId
        );
    }

    public async findAll(): Promise<Driver[]> {
        const items = await super.findAll();
        return items.map((item) => this.hydrate(item));
    }

    public async findById(id: string): Promise<Driver | undefined> {
        const item = await super.findById(id);
        return item ? this.hydrate(item) : undefined;
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
