import { JsonFileRepository } from './JsonFileRepository';
import { Driver } from '../domain/Driver';

export class DriverRepository extends JsonFileRepository<Driver & { id: string }> {
  constructor() {
    super('src/data/drivers.json');
  }
}
