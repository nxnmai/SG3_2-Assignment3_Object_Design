// TrackingService — application service layer

import { Shipment, ShipmentStatus } from '../domain/Shipment';
import { TrackingSource, TrackingUpdate } from '../domain/TrackingUpdate';
import { ShipmentRepository } from '../repositories/ShipmentRepository';
import { TrackingNotifier } from '../domain/TrackingNotifier';

export interface TrackingHistory {
  shipment: Shipment;
  status: ShipmentStatus;
  currentLocation: string;
  history: TrackingUpdate[];
  trackingNo: string;
  origin: string;
  destination: string;
  shipmentId: string;
}

export class TrackingService {
  constructor(
    private readonly shipmentRepository: ShipmentRepository = new ShipmentRepository(),
    private readonly trackingNotifier: TrackingNotifier = TrackingNotifier.getInstance(),
  ) {}

  async getTrackingHistory(trackingNo: string): Promise<TrackingHistory> {
    if (!trackingNo.trim()) {
      throw new Error('Mã theo dõi không được để trống.');
    }

    const shipment = await this.shipmentRepository.findByTrackingNo(trackingNo.trim());
    if (!shipment) {
      throw new Error('Mã theo dõi không tồn tại.');
    }

    const history = shipment.getTrackingHistory();

    return {
      shipment,
      shipmentId: shipment.id,
      trackingNo: shipment.trackingNo,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.getCurrentStatus(),
      currentLocation: shipment.getLatestLocation(),
      history: [...history].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
      ),
    };
  }

  async addTrackingUpdate(input: {
    trackingNo: string;
    status: ShipmentStatus;
    location: string;
    source?: TrackingSource;
  }): Promise<{ success: boolean; update?: TrackingUpdate; error?: string }> {
    const shipment = await this.shipmentRepository.findByTrackingNo(input.trackingNo.trim());
    if (!shipment) {
      return { success: false, error: 'Mã theo dõi không tồn tại.' };
    }

    try {
      const update = shipment.addTrackingUpdate(
        input.status,
        input.location,
        input.source || TrackingSource.DRIVER,
      );

      await this.shipmentRepository.save(shipment);

      // Notify real-time observers (Observer Pattern)
      if (this.trackingNotifier) {
        this.trackingNotifier.notifyObservers(update);
      }

      return { success: true, update };
    } catch (err: any) {
      return { success: false, error: err.message || 'Cập nhật thất bại.' };
    }
  }
}
