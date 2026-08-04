// Shipment — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

import { Vehicle, VehicleType } from './Vehicle';
import { Driver } from './Driver';
import { generateId } from '../utils/idGenerator';
import { TrackingSource, TrackingUpdate } from './TrackingUpdate';

export enum ShipmentStatus {
  UNASSIGNED = 'UNASSIGNED',
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

export class Shipment {
  public readonly id: string;

  public readonly orderId: string;

  public readonly trackingNo: string;

  public readonly origin: string;

  public readonly destination: string;

  public readonly weight: number;

  public readonly volume: number;

  public readonly requiredVehicleType: VehicleType;

  public status: ShipmentStatus;

  public vehicleId?: string;

  public driverId?: string;

  public currentLocation: string;

  public lastUpdated: Date;

  public trackingUpdates: TrackingUpdate[];

  constructor(
    id: string,
    orderId: string,
    trackingNo: string,
    origin: string,
    destination: string,
    weight: number,
    requiredVehicleType: VehicleType,
    status: ShipmentStatus = ShipmentStatus.UNASSIGNED,
    vehicleId?: string,
    driverId?: string,
    currentLocation = origin,
    lastUpdated: Date = new Date(),
    trackingUpdates: TrackingUpdate[] = [],
    volume = 0,
  ) {
    if (!id.trim()) throw new Error('Shipment ID cannot be empty.');
    if (!orderId.trim()) throw new Error('Order ID cannot be empty.');
    if (!trackingNo.trim()) throw new Error('Tracking number cannot be empty.');
    if (!origin.trim() || !destination.trim()) {
      throw new Error('Shipment origin and destination are required.');
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new Error('Shipment weight must be greater than zero.');
    }
    if (!Number.isFinite(volume) || volume < 0) {
      throw new Error('Shipment volume cannot be negative.');
    }
    if (!Object.values(VehicleType).includes(requiredVehicleType)) {
      throw new Error('Invalid required vehicle type.');
    }
    if (!(lastUpdated instanceof Date) || Number.isNaN(lastUpdated.getTime())) {
      throw new Error('Invalid shipment update date.');
    }

    this.id = id;
    this.orderId = orderId;
    this.trackingNo = trackingNo;
    this.origin = origin.trim();
    this.destination = destination.trim();
    this.weight = weight;
    this.volume = volume;
    this.requiredVehicleType = requiredVehicleType;
    this.status = status;
    this.vehicleId = vehicleId;
    this.driverId = driverId;
    this.currentLocation = currentLocation.trim() || this.origin;
    this.lastUpdated = lastUpdated;
    this.trackingUpdates = [...trackingUpdates];
  }

  public assign(vehicle: Vehicle, driver: Driver): void {
    if (this.status !== ShipmentStatus.UNASSIGNED) {
      throw new Error('Only an unassigned shipment can be assigned.');
    }
    if (!vehicle || !driver) throw new Error('Vehicle and driver are required.');

    this.vehicleId = vehicle.id;
    this.driverId = driver.id;
    this.status = ShipmentStatus.PENDING;
    this.lastUpdated = new Date();
  }

  public addTrackingUpdate(
    status: ShipmentStatus,
    location: string | null,
    source: TrackingSource = TrackingSource.DRIVER,
  ): TrackingUpdate {
    if (!this.canTransitionTo(status)) {
      throw new Error(`Invalid shipment status transition: ${this.status} -> ${status}.`);
    }

    const resolvedLocation = location?.trim() || this.currentLocation;
    if (!resolvedLocation) {
      throw new Error('A location is required when no previous location exists.');
    }

    const update = new TrackingUpdate(
      generateId('TRK-UPD'),
      this.id,
      status,
      resolvedLocation,
      source,
    );

    this.status = status;
    this.currentLocation = resolvedLocation;
    this.lastUpdated = update.timestamp;
    this.trackingUpdates.push(update);

    return update;
  }

  public getStatusHistory(): TrackingUpdate[] {
    return [...this.trackingUpdates].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }

  public getTrackingHistory(): TrackingUpdate[] {
    return this.getStatusHistory();
  }

  public getCurrentStatus(): ShipmentStatus {
    return this.status;
  }

  public getLatestLocation(): string {
    return this.currentLocation;
  }

  public isDelivered(): boolean {
    return this.status === ShipmentStatus.DELIVERED;
  }

  private canTransitionTo(next: ShipmentStatus): boolean {
    if (next === this.status) return true;

    const transitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      [ShipmentStatus.UNASSIGNED]: [ShipmentStatus.PENDING],
      [ShipmentStatus.PENDING]: [ShipmentStatus.PICKED_UP, ShipmentStatus.EXCEPTION],
      [ShipmentStatus.PICKED_UP]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.EXCEPTION],
      [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED, ShipmentStatus.EXCEPTION],
      [ShipmentStatus.DELIVERED]: [],
      [ShipmentStatus.EXCEPTION]: [
        ShipmentStatus.PENDING,
        ShipmentStatus.PICKED_UP,
        ShipmentStatus.IN_TRANSIT,
      ],
    };

    return transitions[this.status].includes(next);
  }
}
