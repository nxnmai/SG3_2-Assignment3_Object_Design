// TrackingService — application service layer

import { Shipment, ShipmentStatus } from '../domain/Shipment';
import { TrackingSource, TrackingUpdate } from '../domain/TrackingUpdate';
import { ShipmentRepository } from '../repositories/ShipmentRepository';
import { generateId } from '../utils/idGenerator';

export interface TrackingUpdateRepositoryLike {
  findByShipmentId(shipmentId: string): Promise<TrackingUpdate[]>;
  save(update: TrackingUpdate): Promise<void>;
}

export interface TrackingHistory {
  shipment: Shipment;
  status: ShipmentStatus;
  currentLocation: string;
  history: TrackingUpdate[];
}

export interface TrackingNotifierLike {
  notifyObservers(shipmentId: string, update: TrackingUpdate): void | Promise<void>;
}

export class TrackingService {
  constructor(
    private readonly shipmentRepository: ShipmentRepository,
    private readonly trackingUpdateRepository?: TrackingUpdateRepositoryLike,
    private readonly trackingNotifier?: TrackingNotifierLike,
  ) {}

  async getTrackingHistory(trackingNo: string): Promise<TrackingHistory> {
    if (!trackingNo.trim()) {
      throw new Error('Mã theo dõi không được để trống.');
    }

    const shipment = await this.shipmentRepository.findByTrackingNo(trackingNo.trim());
    if (!shipment) {
      throw new Error('Mã theo dõi không tồn tại.');
    }

    const history = this.trackingUpdateRepository
      ? await this.trackingUpdateRepository.findByShipmentId(shipment.id)
      : shipment.getTrackingHistory();

    return {
      shipment,
      status: shipment.getCurrentStatus(),
      currentLocation: shipment.getLatestLocation(),
      history: [...history].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
      ),
    };
  }

  async addUpdate(
    trackingNo: string,
    status: ShipmentStatus,
    location: string | null,
    source: TrackingSource = TrackingSource.DRIVER,
  ): Promise<TrackingUpdate> {
    const shipment = await this.shipmentRepository.findByTrackingNo(trackingNo.trim());
    if (!shipment) {
      throw new Error('Mã theo dõi không tồn tại.');
    }

    // A null GPS location means the external GPS adapter is unavailable.
    // Shipment.addTrackingUpdate() deliberately falls back to its last known location.
    const update = shipment.addTrackingUpdate(status, location, source);

    if (this.trackingUpdateRepository) {
      await this.trackingUpdateRepository.save(update);
    }
    await this.shipmentRepository.save(shipment);

    if (this.trackingNotifier) {
      await this.trackingNotifier.notifyObservers(shipment.id, update);
    }

    return update;
  }

  /** Convenience method for reconstructing an update when importing legacy data. */
  createUpdate(
    shipmentId: string,
    status: ShipmentStatus,
    location: string,
    source: TrackingSource = TrackingSource.DRIVER,
  ): TrackingUpdate {
    return new TrackingUpdate(
      generateId('TRK-UPD'),
      shipmentId,
      status,
      location,
      source,
    );
  }
}
