// Branch — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

export class Branch {
    public readonly id: string;
    public name: string;
    public address: string;

    public vehicleIds: string[];
    public staffIds: string[];
    public driverIds: string[];

    constructor(
        id: string,
        name: string,
        address: string,
        vehicleIds: string[] = [],
        staffIds: string[] = [],
        driverIds: string[] = []
    ) {
        this.validateId(id);
        this.validateName(name);
        this.validateAddress(address);

        this.id = id;
        this.name = name.trim();
        this.address = address.trim();
        this.vehicleIds = [...vehicleIds];
        this.staffIds = [...staffIds];
        this.driverIds = [...driverIds];
    }

    public transferVehicle(
        vehicleId: string,
        targetBranch: Branch
    ): void {
        const index = this.vehicleIds.indexOf(vehicleId);

        if (index === -1) {
            throw new Error(
                `Vehicle '${vehicleId}' does not belong to branch '${this.id}'.`
            );
        }

        this.vehicleIds.splice(index, 1);

        if (!targetBranch.vehicleIds.includes(vehicleId)) {
            targetBranch.vehicleIds.push(vehicleId);
        }
    }

    public addStaff(staffId: string): void {
        if (!this.staffIds.includes(staffId)) {
            this.staffIds.push(staffId);
        }
    }

    public addDriver(driverId: string): void {
        if (!this.driverIds.includes(driverId)) {
            this.driverIds.push(driverId);
        }
    }

    public addVehicle(vehicleId: string): void {
        if (!this.vehicleIds.includes(vehicleId)) {
            this.vehicleIds.push(vehicleId);
        }
    }

    public removeVehicle(vehicleId: string): void {
        this.vehicleIds = this.vehicleIds.filter(id => id !== vehicleId);
    }

    public removeDriver(driverId: string): void {
        this.driverIds = this.driverIds.filter(id => id !== driverId);
    }

    public removeStaff(staffId: string): void {
        this.staffIds = this.staffIds.filter(id => id !== staffId);
    }

    // Validation
    private validateId(id: string): void {
        if (!/^BR-[A-Z]{2,5}$/.test(id)) {
            throw new Error(
                "Branch ID must follow the format 'BR-XXX'."
            );
        }
    }

    private validateName(name: string): void {
        if (!name.trim()) {
            throw new Error("Branch name cannot be empty.");
        }
    }

    private validateAddress(address: string): void {
        if (!address.trim()) {
            throw new Error("Branch address cannot be empty.");
        }
    }
}