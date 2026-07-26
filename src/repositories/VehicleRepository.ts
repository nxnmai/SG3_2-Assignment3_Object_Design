import { JsonFileRepository } from './JsonFileRepository';
import { Vehicle } from '../domain/Vehicle';

export class VehicleRepository extends JsonFileRepository<Vehicle & { id: string }> {
  constructor() {
    super('src/data/vehicles.json');
  }
}
