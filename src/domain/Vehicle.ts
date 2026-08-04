// Vehicle — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

export enum VehicleType {
    TRUCK_2T = "TRUCK_2T",
    TRUCK_5T = "TRUCK_5T",
    VAN = "VAN",
    MOTORBIKE = "MOTORBIKE"
}

export enum VehicleStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    MAINTENANCE = "MAINTENANCE"
}

export class Vehicle {
    public readonly id: string;
    public branchId: string;
    public type: VehicleType;
    public capacityKg: number;
    public capacityVolumeM3: number;
    public status: VehicleStatus;
    public assignedShipmentId?: string;

    constructor(
        id: string,
        branchId: string,
        type: VehicleType,
        capacityKg: number,
        capacityVolumeM3: number,
        status: VehicleStatus = VehicleStatus.AVAILABLE,
        assignedShipmentId?: string
    ) {
        this.validateId(id);
        this.validateBranchId(branchId);
        this.validateCapacity(capacityKg, capacityVolumeM3);

        this.id = id;
        this.branchId = branchId;
        this.type = type;
        this.capacityKg = capacityKg;
        this.capacityVolumeM3 = capacityVolumeM3;
        this.status = status;
        this.assignedShipmentId = assignedShipmentId;
    }

    public canCarry(weight: number, volume: number): boolean {
        return (
            weight <= this.capacityKg &&
            volume <= this.capacityVolumeM3
        );
    }

    public assignToShipment(shipmentId: string): void {
        if (!this.isAvailable()) {
            throw new Error(
                `Vehicle '${this.id}' is not available for assignment.`
            );
        }

        if (!shipmentId.trim()) {
            throw new Error("Shipment ID cannot be empty.");
        }

        this.assignedShipmentId = shipmentId;
        this.status = VehicleStatus.IN_USE;
    }

    public release(): void {
        this.assignedShipmentId = undefined;
        this.status = VehicleStatus.AVAILABLE;
    }

    public isAvailable(): boolean {
        return this.status === VehicleStatus.AVAILABLE;
    }

    // Validation
    private validateId(id: string): void {
        if (!/^VEH-[A-Z0-9-]+$/.test(id)) {
            throw new Error(
                "Vehicle ID must follow the format 'VEH-XXXXXX'."
            );
        }
    }

    private validateBranchId(branchId: string): void {
        if (!branchId.trim()) {
            throw new Error("Branch ID cannot be empty.");
        }
    }

    private validateCapacity(
        capacityKg: number,
        capacityVolumeM3: number
    ): void {
        if (capacityKg <= 0) {
            throw new Error(
                "Vehicle capacity (kg) must be greater than zero."
            );
        }

        if (capacityVolumeM3 <= 0) {
            throw new Error(
                "Vehicle capacity (m³) must be greater than zero."
            );
        }
    }
}