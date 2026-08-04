import { JsonFileRepository } from './JsonFileRepository';
import { Shipment, ShipmentStatus } from '../domain/Shipment';
import { TrackingSource, TrackingUpdate } from '../domain/TrackingUpdate';

export class ShipmentRepository extends JsonFileRepository<Shipment & { id: string }> {
  constructor() {
    super('src/data/shipments.json');
  }

  private hydrate(raw: Shipment & { id: string }): Shipment {
    const updates = (raw.trackingUpdates ?? []).map((update) =>
      new TrackingUpdate(
        update.id,
        update.shipmentId,
        update.status as ShipmentStatus,
        update.location,
        update.source as TrackingSource,
        new Date(update.timestamp),
      ),
    );

    return new Shipment(
      raw.id,
      raw.orderId,
      raw.trackingNo,
      raw.origin,
      raw.destination,
      raw.weight,
      raw.requiredVehicleType,
      raw.status as ShipmentStatus,
      raw.vehicleId,
      raw.driverId,
      raw.currentLocation,
      new Date(raw.lastUpdated),
      updates,
      raw.volume ?? 0,
    );
  }

  async findAll(): Promise<Shipment[]> {
    const items = await super.findAll();
    return items.map((item) => this.hydrate(item));
  }

  async findById(id: string): Promise<Shipment | undefined> {
    const item = await super.findById(id);
    return item ? this.hydrate(item) : undefined;
  }

  async findByTrackingNo(trackingNo: string): Promise<Shipment | undefined> {
    const items = await super.findAll();
    const item = items.find((shipment) => shipment.trackingNo === trackingNo);
    return item ? this.hydrate(item) : undefined;
  }

  async findByStatus(status: ShipmentStatus): Promise<Shipment[]> {
    const items = await super.findAll();
    return items
      .filter((shipment) => shipment.status === status)
      .map((item) => this.hydrate(item));
  }

  async findPaidUnassigned(): Promise<Shipment[]> {
    // Shipment persistence does not own invoice/payment state. Payment state
    // is therefore deliberately not inferred here; the assignment flow uses
    // the UNASSIGNED shipment state as its repository-level candidate set.
    return this.findByStatus(ShipmentStatus.UNASSIGNED);
  }

  async save(entity: Shipment): Promise<void> {
    await super.save(entity as Shipment & { id: string });
  }
}
