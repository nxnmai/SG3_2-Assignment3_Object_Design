// Driver — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

import {
    StaffMember,
    StaffRole,
    Credentials
} from "./StaffMember";

import { VehicleType } from "./Vehicle";

export enum DriverStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    UNAVAILABLE = "UNAVAILABLE"
}

export class Driver extends StaffMember {
    public licenseExpiry: Date;
    public assignedVehicle?: string;
    public assignedShipmentId?: string;
    public vehicleTypes: VehicleType[];
    public status: DriverStatus;

    constructor(
        id: string,
        branchId: string,
        name: string,
        phone: string,
        email: string,
        credentials: Credentials,
        licenseExpiry: Date,
        vehicleTypes: VehicleType[],
        status: DriverStatus = DriverStatus.AVAILABLE,
        assignedVehicle?: string,
        assignedShipmentId?: string
    ) {
        super(
            id,
            branchId,
            name,
            phone,
            email,
            StaffRole.DRIVER,
            credentials
        );

        this.validateLicenseExpiry(licenseExpiry);

        if (vehicleTypes.length === 0) {
            throw new Error(
                "A driver must be qualified for at least one vehicle type."
            );
        }

        this.licenseExpiry = licenseExpiry;
        this.vehicleTypes = [...vehicleTypes];
        this.status = status;
        this.assignedVehicle = assignedVehicle;
        this.assignedShipmentId = assignedShipmentId;
    }

    public isQualifiedFor(vehicleType: VehicleType): boolean {
        return (
            this.vehicleTypes.includes(vehicleType) &&
            this.licenseExpiry > new Date()
        );
    }

    public assignToShipment(
        shipmentId: string,
        vehicleId: string
    ): void {
        if (!this.isAvailable()) {
            throw new Error(
                `Driver '${this.id}' is not available.`
            );
        }

        if (!shipmentId.trim()) {
            throw new Error("Shipment ID cannot be empty.");
        }

        if (!vehicleId.trim()) {
            throw new Error("Vehicle ID cannot be empty.");
        }

        this.assignedShipmentId = shipmentId;
        this.assignedVehicle = vehicleId;
        this.status = DriverStatus.IN_USE;
    }

    public release(): void {
        this.assignedShipmentId = undefined;
        this.assignedVehicle = undefined;
        this.status = DriverStatus.AVAILABLE;
    }

    public isAvailable(): boolean {
        return (
            this.status === DriverStatus.AVAILABLE &&
            this.licenseExpiry > new Date()
        );
    }

    // Validation
    private validateLicenseExpiry(expiry: Date): void {
        if (!(expiry instanceof Date) || isNaN(expiry.getTime())) {
            throw new Error("Invalid licence expiry date.");
        }
    }
}
