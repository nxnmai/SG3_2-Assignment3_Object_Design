// TrackingUpdate — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

import type { ShipmentStatus } from './Shipment';

export enum TrackingSource {
  GPS = 'GPS',
  DRIVER = 'DRIVER',
  SYSTEM = 'SYSTEM',
}

export class TrackingUpdate {
  public readonly id: string;

  public readonly shipmentId: string;

  public readonly status: ShipmentStatus;

  public readonly location: string;

  public readonly source: TrackingSource;

  public readonly timestamp: Date;

  constructor(
    id: string,
    shipmentId: string,
    status: ShipmentStatus,
    location: string,
    source: TrackingSource = TrackingSource.DRIVER,
    timestamp: Date = new Date(),
  ) {
    if (!id.trim()) throw new Error('Tracking update ID cannot be empty.');
    if (!shipmentId.trim()) throw new Error('Shipment ID cannot be empty.');
    if (!location.trim()) throw new Error('Tracking location cannot be empty.');
    if (!(timestamp instanceof Date) || Number.isNaN(timestamp.getTime())) {
      throw new Error('Invalid tracking timestamp.');
    }

    this.id = id;
    this.shipmentId = shipmentId;
    this.status = status;
    this.location = location.trim();
    this.source = source;
    this.timestamp = timestamp;
  }
}
