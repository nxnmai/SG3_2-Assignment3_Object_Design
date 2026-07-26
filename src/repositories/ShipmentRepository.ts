import { JsonFileRepository } from './JsonFileRepository';
import { Shipment } from '../domain/Shipment';

export class ShipmentRepository extends JsonFileRepository<Shipment & { id: string }> {
  constructor() {
    super('src/data/shipments.json');
  }
}
